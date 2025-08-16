const chartSeries = {};

function updateChart(data, options) {
  var dataSet = anychart.data.set(data);
  var seriesData = dataSet.mapAs({ x: 0, value: 1 });

  let series = chartSeries[options.containerId];

  if (!series) {
    series = buildChart(seriesData, options);
    chartSeries[options.containerId] = series;
  } else {
    series.data(seriesData);
  }
}

function buildChart(data, options) {
  const firstSeriesData = data;

  // create line chart
  var chart = anychart.line();
  chart.interactivity().selectionMode("none");

  // chart.listen('click', function (e) {
  //   e.preventDefault(); // 阻止默认点击行为
  //   e.stopPropagation(); // 阻止事件冒泡
  // });
  // chart.unlisten("pointClick"); // 移除点击事件监听
  chart.contextMenu(false);


  // turn on chart animation
  chart.animation(true);
  chart.background().fill(options.background);

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
  chart.tooltip().format(function (e) {
    return `Index: ${e.value.toFixed(0)}`;
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

  chart.xScale().ticks().interval(200);
  chart.xAxis().stroke({
    color: options.axisColor,
    thickness: 1,
  });
  chart.xAxis().labels().fontColor("#939393");
  chart.xAxis().labels().padding(5, 0, 0, 0);

  chart.yAxis().orientation("left");
  chart.yAxis().stroke({
    color: options.axisColor,
    thickness: 1,
  });
  chart.yAxis().labels().fontColor("#939393");

  chart.xGrid().stroke({ color: options.gridColor, thickness: 1 });
  chart.yGrid().stroke({ color: options.gridColor, thickness: 1 });
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
  chart.container(options.containerId);
  // initiate chart drawing
  chart.draw();

  document.getElementById(options.containerId).addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  return firstSeries;
}

export function createOrUpdateChart(data, { cId, bg, gdColor, axColor }) {
  const indexData = data.map((d) => {
    return [d.calculatedAt, d.index];
  });
  updateChart(indexData, {
    containerId: cId,
    background: bg,
    gridColor: gdColor,
    axisColor: axColor,
  })
}

export function updateIndexValue(data, valueContainerId, changeContainerId)
{
  const index = data.latest?.index;
  const change = data.latest?.change;

  const valueElement = document.getElementById(valueContainerId);
  valueElement.innerText = index.toFixed(2);

  const changeElement = document.getElementById(changeContainerId);
  changeElement.innerText = `${(change * 100).toFixed(2)}%`;
  if(change < 0){
    changeElement.classList.remove('text-emerald-600');
    changeElement.classList.add('text-red-600');
  }else{
    changeElement.classList.remove('text-red-600');
    changeElement.classList.add('text-emerald-600');
  }
}


