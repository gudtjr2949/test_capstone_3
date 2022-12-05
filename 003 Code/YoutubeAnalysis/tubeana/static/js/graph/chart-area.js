var timeStr = document.getElementById("time").value;
var timeArr = timeStr.split("\n").slice(2);
var fTimeArr = [];
var xArr = [];
var yArr = [];
var tooltipArr = [];
var acc = 0;

console.log(timeArr);

for (let i = 0; i < timeArr.length; i++) {
  let tmpArr = timeArr[i].split(" ");
  tmpArr = tmpArr.filter(function (item) {
    return item !== "";
  });
  fTimeArr.push(tmpArr);
}
console.log(fTimeArr);

var day = fTimeArr[0][0].substr(5, 2);
xArr.push(fTimeArr[0][0].substr(2, 5).replace("-", "/"));
for (let i = 0; i < fTimeArr.length; i++) {
  if (fTimeArr[i][0].substr(5, 2) == day) {
    acc += Number(fTimeArr[i][2]);
  } else {
    yArr.push(acc);
    day = fTimeArr[i][0].substr(5, 2);
    xArr.push(fTimeArr[i][0].substr(2, 5).replace("-", "/"));
    acc = Number(fTimeArr[i][2]);
  }
}
yArr.push(acc);

// console.log(xArr);
// console.log(yArr);

/////////////////
// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

function TopTime(time) {}

// Area Chart Example
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: xArr,
    datasets: [
      {
        label: "댓글 수 ",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 2,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoveIJIJLJLJLKDFSDrBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: yArr,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0,
      },
    },
    scales: {
      xAxes: [
        {
          time: {
            unit: "date",
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          // ticks: {
          //   maxTicksLimit: 20,
          // },
          padding: 10,
        },
      ],
      yAxes: [
        {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
            padding: 10,
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2],
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: "#6e707e",
      titleFontSize: 12,
      borderColor: "#dddfeb",
      borderWidth: 1,
      xPadding: 10,
      yPadding: 10,
      displayColors: false,
      intersect: false,
      mode: "index",
      caretPadding: 10,
      callbacks: {
        label: (tooltipItem, data) => {
          var multiString = [];
          let label = data.datasets[tooltipItem.datasetIndex].label;
          let value =
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          let x = data.labels[tooltipItem.index].replace("/", "-");
          let rankArr = [];

          fTimeArr.forEach((item, i) => {
            if (item[0].substr(2, 5) == x) {
              rankArr.push([item[0].substr(8, 2), item[2]]);
            }
          });

          rankArr.sort((a, b) => b[1] - a[1]);

          multiString.push(`총 ${value}개`);
          multiString.push("");

          for (let i = 0; i < 3; i++) {
            if (typeof rankArr[i] != "undefined")
              multiString.push(`${rankArr[i][0]}일 : ${rankArr[i][1]}개`);
          }
          return multiString;
        },
      },
    },
  },
});
