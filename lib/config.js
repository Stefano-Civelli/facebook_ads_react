barchart_options = {
  indexAxis: "y",
  plugins: {
    title: {
      display: true,
      text: options.titleText,
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: options.xText,
      },
      ticks: {
        callback: function (value) {
          return "$" + value.toFixed(0) + "M";
        },
        color: "black",
      },
      grid: {
        color: "lightgray",
      },
    },
    y: {
      title: {
        display: true,
        text: options.yText,
      },
      ticks: {
        color: "black",
      },
    },
  },
};
