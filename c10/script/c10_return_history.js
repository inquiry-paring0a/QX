
export function updateChart(data, { containerId }) {
  const navCtx = document.getElementById(containerId).getContext('2d');

  const c10Data = data.c10IndexHistory;
  const bitCoinData = data.bitCoinIndexHistory;

  const days = c10Data.map(d => {
    return d.calculatedAt.split('T')[0];
  });
  const navSeries = c10Data.map(d => {
    return d.index;
  })
  // const navSeries = [100, 103, 108, 104, 111, 117, 121, 118, 126, 132, 135, 139];
  // const btcSeries = [100, 106, 114, 107, 118, 126, 134, 126, 140, 151, 154, 160];
  // const btcSeries = bitCoinData.map(d => d.index);
  const btcSeries = generateBitcoinSeries(c10Data, bitCoinData);

  new Chart(navCtx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        {
          label: 'C10 Treasury NAV',
          data: navSeries,
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14,165,233,0.08)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label:'BTC = 100',
          data: btcSeries,
          borderColor: '#64748b',
          backgroundColor: 'transparent',
          fill: true,
          // borderDash: [6, 4],
          tension: 0.35,
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { boxWidth: 10 } } },
      scales: {
        y:
        {
          beginAtZero: false,
          grid:
          {
             color: 'rgba(0,0,0,0.08)'
            }
          },
          x:
          {
            grid:
            {
              color:
              'rgba(0,0,0,0.06)'
            },
            ticks: {
              callback: function(value, index, ticks){
                const date = this.getLabelForValue(value);
                // console.log(date);
                const tmp = date.split('-');
                return `${tmp[0]}-${tmp[1]}`;
              }
            }
          }
        }
    }
  });
}

function generateBitcoinSeries(c10Data, bitcoinData) {
  let ci = bitcoinData[0].index;

  const filledBitcoinIndexList = [];
  let iBit = 0;

  for(let iC10 = 0; iC10 < c10Data.length; iC10 ++){
    const dateC10 = c10Data[iC10].calculatedAt; 
    const dateBit = bitcoinData[iBit].calculatedAt; 

    if(dateC10 === dateBit){
      filledBitcoinIndexList.push(bitcoinData[iBit].index);
      ci = bitcoinData[iBit].index;

      iBit++
      
      continue;
    }

    if(dateC10 <= dateBit){
      filledBitcoinIndexList.push(ci);
      
      continue;
    }
  }

  return filledBitcoinIndexList;
}