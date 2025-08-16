
export function createIndexTrendChart(data, {
  containerId,
  lang,
}) {
  // const intraday = [
  //   { t: "09:30", v: 2821 },
  //   { t: "10:00", v: 2836 },
  //   { t: "10:30", v: 2849 },
  //   { t: "11:00", v: 2832 },
  //   { t: "11:30", v: 2854 },
  //   { t: "12:00", v: 2861 },
  //   { t: "12:30", v: 2853 },
  //   { t: "13:00", v: 2869 },
  //   { t: "13:30", v: 2876 },
  //   { t: "14:00", v: 2868 },
  //   { t: "14:30", v: 2882 },
  //   { t: "15:00", v: 2891 }
  // ];

  const series = data.map(d => d.v);

  const indexChart = echarts.init(document.getElementById(containerId));
  indexChart.setOption({
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      },
      formatter: function (params) {
        const data = params[0];
        return lang === 'cn'? `时间: ${data.axisValue}<br/>指数: ${data.value.toFixed(2)}` : `Time: ${data.axisValue}<br/>Index: ${data.value.toFixed(2)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.t),
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.25)' } },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.15)' } },
      axisLabel: {
        color: 'rgba(0,0,0,0.7)',
        formatter: function (params) {
          const tmp = params.split('T')[1].split(':');
          console.log(tmp);
          return `${tmp[0]}:${tmp[1]}`;
        },
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.25)' } },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.15)' } },
      axisLabel: { color: 'rgba(0,0,0,0.7)' }
    },
    series: [{
      name: 'C10 Index',
      type: 'line',
      data: series,
      smooth: 1,
      lineStyle: { color: '#0ea5e9', width: 2 },
      symbol: 'none',
      symbolSize: 4,
      itemStyle: {
        color: '#0ea5e9',
        borderColor: '#ffffff',
        borderWidth: 2
      },
      emphasis: {
        itemStyle: {
          color: '#0ea5e9',
          borderColor: '#ffffff',
          borderWidth: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(14, 165, 233, 0.3)'
        },
        symbolSize: 8
      }
    }]
  });

  return indexChart;
}

export function updateIndexTrendChart(data, chart) {
  const series = data.map(d => d.v);
  chart.setOption({
    xAxis: { data: data.map(d => d.t) },
    series: [{ data: series }]
  });
}

export function updateLastPrice(lastPrice, containerId) {
  const c = document.getElementById(containerId);
  c.innerText = lastPrice.toFixed(2);
}

export function updateLastChange(lastChange, containerId) {

  const c = document.getElementById(containerId);
  c.innerText = `${(lastChange * 100).toFixed(2)}%`;
  if (lastChange < 0) {
    c.classList.remove('bg-emerald-100')
    c.classList.remove('text-emerald-600')
    c.classList.add('bg-red-100');
    c.classList.add('text-red-600');
  } else {
    c.classList.remove('bg-red-100');
    c.classList.remove('text-red-600');
    c.classList.add('bg-emerald-100')
    c.classList.add('text-emerald-600')

  }
}