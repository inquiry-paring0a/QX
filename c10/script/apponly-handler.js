/**
 * APPONLY URL Parameter Handler
 * 
 * When APPONLY=1 is present in the URL, it:
 * - Hides the header navigation
 * - Hides the footer
 * - Adds extra padding to the first content section for proper spacing
 * - Shows a back button (except for the homepage)
 * - Propagates the parameter to internal navigation links
 */
(function () {
    'use strict';

    // Check if APPONLY=1 parameter is present
    function hasAppOnlyParam() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('APPONLY') === '1';
    }

    // Immediately hide header/footer with CSS if APPONLY=1 (prevents flash)
    function preventFlash() {
        if (hasAppOnlyParam()) {
            const style = document.createElement('style');
            style.textContent = `
                header, footer {
                    display: none !important;
                }
                section:first-child, 
                main:first-child,
                body > section:first-of-type,
                body > main:first-of-type {
                    padding-top: calc(2.5rem + 10px) !important;
                }
                /* Fallback for pages without sections */
                body:not(:has(section)):not(:has(main)) {
                    padding-top: 40px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Hide header and footer elements
    function hideNavigationElements() {
        // Hide header
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'none';
        }

        // Hide footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.display = 'none';
        }
    }

    // Create and show back button
    function createBackButton() {
        // Don't show back button on index.html pages (home pages)
        if (window.location.pathname.endsWith('/index.html')) {
            return;
        }

        // Create back button container
        const backButton = document.createElement('div');
        backButton.id = 'apponly-back-button';
        backButton.innerHTML = `
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-6-6 6-6"/>
            </svg>
        `;
        
        // Style the back button
        backButton.style.cssText = `
            position: fixed;
            top: 20px;
            left: 4px;
            z-index: 9999;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: opacity 0.2s ease;
        `;

        // Add hover effect
        backButton.addEventListener('mouseenter', () => {
            backButton.style.opacity = '0.7';
        });

        backButton.addEventListener('mouseleave', () => {
            backButton.style.opacity = '1';
        });

        // Add click handler
        backButton.addEventListener('click', () => {
            window.history.back();
        });

        // Add to page
        document.body.appendChild(backButton);
    }

    // Add APPONLY=1 parameter to internal navigation links
    function propagateParameterToLinks() {
        // Get all internal links (relative paths and same-domain links)
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip if it's an external link, hash link, or already has parameters
            if (!href || 
                href.startsWith('http') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:') ||
                href.startsWith('#') ||
                href.includes('APPONLY=1')) {
                return;
            }

            // Only modify links to HTML pages in the same directory structure
            if (href.endsWith('.html') || 
                (!href.includes('.') && !href.includes('/'))) {
                
                // Add APPONLY=1 parameter
                const separator = href.includes('?') ? '&' : '?';
                link.setAttribute('href', href + separator + 'APPONLY=1');
            }
        });
    }

    // Initialize the APPONLY functionality
    function initializeAppOnly() {
        if (hasAppOnlyParam()) {
            hideNavigationElements();
            createBackButton();
            propagateParameterToLinks();
        }
    }

    // Immediately prevent flash (run as soon as script loads)
    preventFlash();

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAppOnly);
    } else {
        initializeAppOnly();
    }

    // Expose utility functions for potential external use
    window.AppOnlyHandler = {
        hasAppOnlyParam: hasAppOnlyParam,
        initialize: initializeAppOnly
    };

})();
