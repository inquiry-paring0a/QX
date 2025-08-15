const GRAPHQL_ENDPOINT = "http://localhost:8000/graphql";
const C10_DATA_QUERY = `
        query c10 {
    c10LatestMarketData {
        id
        name
        symbol
        currentPrice
        marketCap
        marketCapChangePercentage24h
        weight
        updatedAt
    }
}
        `;

async function fetchData(isFirst) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: C10_DATA_QUERY }),
  });

  const json = await response.json();
  const data = json.data.c10LatestMarketData;
  renderTable2(data);
  if(isFirst){
    renderWeightPie(data);
  }

  // if (json.data && json.data.c10LatestMarketData) {
  //   const indexData = json.data.c10Index24h.map((d) => {
  //     return [d.calculatedAt, d.index];
  //   });

  //   return indexData;
  // }
}



// async function fetchStockList() {
//   try {
//     const response = await fetch(API_URL);
//     if (!response.ok) throw new Error("网络请求失败");

//     const stocks = await response.json();
//     renderTable(stocks);
//   } catch (error) {
//     console.error("获取股票数据失败：", error);
//   }
// }

// function renderTable(stocks) {
//   const tbody = document.querySelector("#stock-table tbody");
//   tbody.innerHTML = ""; // 清空旧数据

//   stocks.forEach(stock => {
//     const tr = document.createElement("tr");
//     tr.innerHTML = `
//           <td>${stock.name}</td>
//           <td>${stock.price}</td>
//         `;
//     tbody.appendChild(tr);
//   });
// }

export function renderTable(constituents) {
        // const constituents = [
        //     { rank: 1, symbol: "BTC", name: "Bitcoin", weight: 35.0, price: 119383.71, marketCap: 2380000000000, change: 0.36 },
        //     { rank: 2, symbol: "ETH", name: "Ethereum", weight: 25.0, price: 4578.78, marketCap: 552900000000, change: 6.88 },
        //     { rank: 3, symbol: "XRP", name: "XRP", weight: 12.0, price: 3.22, marketCap: 191500000000, change: 2.34 },
        //     { rank: 4, symbol: "BNB", name: "Binance Coin", weight: 8.0, price: 830.93, marketCap: 115700000000, change: 2.26 },
        //     { rank: 5, symbol: "SOL", name: "Solana", weight: 7.0, price: 192.63, marketCap: 103900000000, change: 9.76 },
        //     { rank: 6, symbol: "DOGE", name: "Dogecoin", weight: 5.0, price: 0.2343, marketCap: 35200000000, change: 4.15 },
        //     { rank: 7, symbol: "ADA", name: "Cardano", weight: 3.5, price: 0.8368, marketCap: 29800000000, change: 7.12 },
        //     { rank: 8, symbol: "TRX", name: "Tron", weight: 2.5, price: 0.3522, marketCap: 33300000000, change: 1.22 },
        //     { rank: 9, symbol: "AVAX", name: "Avalanche", weight: 1.5, price: 24.55, marketCap: 10900000000, change: 3.45 },
        //     { rank: 10, symbol: "DOT", name: "Polkadot", weight: 0.5, price: 4.14, marketCap: 6200000000, change: -1.23 }
        // ];

  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = ""; 
  constituents.forEach((c,i) => {
    const tr = document.createElement('tr');
    tr.className = 'border-t border-slate-200 hover:bg-slate-50';
    tr.innerHTML = `
                <td class="px-4 py-3">${i + 1}</td>
                <td class="px-4 py-3 font-semibold">${c.symbol.toUpperCase()}</td>
                <td class="px-4 py-3 text-right">${c.weight.toFixed(1)}%</td>
                <td class="px-4 py-3 text-right">$${c.currentPrice.toFixed(2)}</td>
                <td class="px-4 py-3 text-right">$${(c.marketCap / 1e9).toFixed(1)}B</td>
                <td class="px-4 py-3 ${c.marketCapChangePercentage24h >= 0 ? 'text-emerald-600' : 'text-rose-600'}">${c.marketCapChangePercentage24h >= 0 ? '+' : ''}${c.marketCapChangePercentage24h.toFixed(2)}%</td>
            `;
    tbody.appendChild(tr);
  });
}

export function renderWeightPie(constituents){
        const pieChart = echarts.init(document.getElementById('pieChart'));
        const pieData = constituents.map((c, index) => ({
            name: c.symbol.toUpperCase(),
            value: c.weight.toFixed(2),
            itemStyle: {
                color: [
                    '#f59e0b','#3b82f6','#10b981','#f97316','#8b5cf6',
                    '#06b6d4','#ef4444','#84cc16','#f59e0b','#6366f1'
                ][index % 10]
            }
        }));
        
        pieChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}%'
            },
            series: [{
                type: 'pie',
                radius: ['60%', '90%'],
                center: ['50%', '50%'],
                data: pieData,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}',
                    fontSize: 12,
                    color: '#374151'
                },
                labelLine: {
                    show: true,
                    length: 5,
                    length2: 15,
                    lineStyle: {
                        color: '#9ca3af',
                        width: 1
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });

        window.addEventListener('resize', function() {
            pieChart.resize();
        });
}

// export function loadTable(){
//   fetchData(true);
//   setInterval(fetchData, 10 * 1000);
// }
// 页面加载时立即获取一次
// fetchData();


// 每5分钟刷新一次
// setInterval(fetchStockList, 5 * 60 * 1000);