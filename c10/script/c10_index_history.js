export function updateHistoryChart(data, options) {
  const indexData = data.map(d => {
    const data = d.calculatedAt.split('T')[0];
    const tmp = data.split('-');
    const m = tmp[1];
    const ym = `${tmp[0]}-${tmp[1]}`;
    return {
      // t: m === '01' ? `${tmp[0]}-${tmp[1]}`: '',
      t: ym,
      v: d.index,
    }
  });
  const ctx2 = document.getElementById(options.cId).getContext('2d');
  new Chart(ctx2, {
    type: 'line',
    data: {
      labels: indexData.map(d => d.t),
      datasets: [{
        label: 'Trend',
        data: indexData.map(d => d.v),
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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
          }
        }
      }
    }
  });
}