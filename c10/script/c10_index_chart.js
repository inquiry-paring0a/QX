const GRAPHQL_ENDPOINT = "http://localhost:8000/graphql";
const C10_DATA_QUERY = `
        query c10 {
    c10Index24h {
        index
        calculatedAt
    }
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

async function fetchData_2() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1', {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();
    if(json.prices){
      const data = json.prices.map(p => {
        return [
          new Date(p[0]),
          // p[0],
          p[1],
        ]
      });
      return data;
    }

}

async function fetchData_1() {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: C10_DATA_QUERY }),
    });

    const json = await response.json();

    if (json.data && json.data.c10Index24h) {
      // const salesData = json.data.sales.map((item) => [
      //   item.month,
      //   item.value,
      // ]);
      const indexData = json.data.c10Index24h.map((d) => {
        return [d.calculatedAt, d.index];
      });

      return indexData;
    } 
}

async function fetchData() {
  const data = await fetchData_1();
  updateChart(data);
}

let series;
let containerId;

function updateChart(data) {
  var dataSet = anychart.data.set(data);
  var seriesData = dataSet.mapAs({ x: 0, value: 1 });

  if (!series) {
    series = buildChart(seriesData);
  } else {
    series.data(seriesData);
  }
}

function buildChart(data) {
  // var dataSet = anychart.data.set(data);

  // var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });
  const firstSeriesData = data;

  // create line chart
  var chart = anychart.line();

  // turn on chart animation
  chart.animation(true);
  chart.background().fill(background);

  // set chart padding
  chart.padding([10, 20, 5, 20]);

  // turn on the crosshair
  chart.crosshair().enabled(true).displayMode("sticky");
  chart.crosshair().xStroke("#607D8B", 1, "8", "round", "round");
  chart.crosshair().yStroke("#607D8B", 1, "8", "round", "round");
  //   chart.crosshair().enabled(true);
  // chart.crosshair(true).yLabel(false).yStroke(null);

  // set tooltip mode to point
  chart.tooltip().positionMode("point");
  chart.tooltip().format(function () {
    return "xx";
  })

  // set chart title text settings
  //   chart.title(
  //     'Trend of Sales of the Most Popular Products of ACME Corp.'
  //   );

  // set yAxis title
  //   chart.yAxis().title('Number of Bottles Sold (thousands)');
  chart.xAxis().labels().padding(5);
  chart
    .xAxis()
    .labels()
    .format(function (o) {
      // if(this.index === 0) {
      //   return this.value.split(' ')[0]; // 每隔5个点显示一次标签
      // }
      // return this.value.split(' ')[1]; // 只显示时间部分
      const date = new Date(o.value);

      const hours = String(date.getHours()).padStart(2, "0"); // 补零
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    });
  //   chart.xAxis().labels().stroke('black');
  //   chart.xAxis().enabled(false);

  chart.xScale().ticks().interval(20);
  chart.xAxis().stroke({
    color: axisColor,
    thickness: 1,
  });
  chart.xAxis().labels().fontColor("#939393");
  chart.xAxis().labels().padding(5, 0, 0, 0);

  chart.yAxis().orientation("left");
  chart.yAxis().stroke({
    color: axisColor,
    thickness: 1,
  });
  chart.yAxis().labels().fontColor("#939393");

  chart.xGrid().stroke({ color: gridColor, thickness: 1 });
  chart.yGrid().stroke({ color: gridColor, thickness: 1 });
  // chart.xGrid(false);
  // chart.yGrid(false);


  // create first series with mapped data
  var firstSeries = chart.spline(firstSeriesData);
  firstSeries.name("index");
  //   firstSeries.tension(0.7);
  firstSeries.hovered().markers().enabled(true).type("circle").size(4);
  firstSeries
    .tooltip()
    .position("right")
    .anchor("left-center")
    .offsetX(5)
    .offsetY(5);
  firstSeries.stroke({ color: "#0fa5e9", thickness: 4 });

  // turn the legend on
  chart.legend().enabled(false).fontSize(13).padding([0, 0, 10, 0]);

  // set container id for the chart
  chart.container(containerId);
  // initiate chart drawing
  chart.draw();

  return firstSeries;
}

let background;
let gridColor;
let axisColor;
export function initChart({ cId, bg, gdColor, axColor }) {
  console.log(cId, bg);
  containerId = cId;
  background = bg; 
  gridColor = gdColor;
  axisColor = axColor,


  anychart.onDocumentReady(() => {
    fetchData();
    setInterval(fetchData, 30000);
  });
}
