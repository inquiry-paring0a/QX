export function createIndexChart(data, { containerId }) {
  const indexData = data.c10Index24h.map(c => ({
    t: c.calculatedAt,
    v: c.index,
  }))
  const ctx1 = document.getElementById(containerId).getContext('2d');
  return new Chart(ctx1, {
    type: 'line',
    data: {
      labels: indexData.map(d => d.t),
      datasets: [{
        label: 'C10 Index',
        data: indexData.map(d => d.v),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#374151',
          bodyColor: '#374151',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: function (context) {
              return 'Time: ' + context[0].label;
            },
            label: function (context) {
              return 'C10 Index: ' + context.parsed.y.toFixed(2);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0,0,0,0.08)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0,0,0,0.08)'
          },
          ticks: {
            callback: function(value, index, ticks) {
              const v = this.getLabelForValue(value)
              const tmp = v.split('T')[1];
              const h = tmp.split(':')[0];
              const m = tmp.split(':')[1];

              return `${h}:${m}`;
            }
          }
        }
      }
    }
  });
}

export function updateIndexChart(chart, data){
  const indexData = data.c10Index24h.map(c => ({
    t: c.calculatedAt,
    v: c.index,
  }))

  chart.data.labels = indexData.map(d => d.t);
  chart.data.datasets[0].date = indexData.map(d => d.v);
  chart.update();
}