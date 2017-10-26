
$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [],
  pm2Data = [],
  pm10Data = [];
 //---------yanji start 1/2------------
  
  //20170913
  var pm10Data = [],
      pm25Data = [];
  var result;
 // android 20170912 23:29
  var humilength = humidityData.length;
  // 20170913
  var templength = temperatureData.length;
  var pm10length = pm10Data.length;
  var pm25length = pm25Data.length;
	
  var rpmData = [];
  var rpmlength = rpmData.length;
   
   document.getElementById("motion").innerHTML = "0"
   document.getElementById("ytd").innerHTML = "79"
   document.getElementById("today").innerHTML = "20"
	
  //---------yanji end 1/2------------
  //temperatureData[0] = 0;
  //temperatureData[1] = 1;
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Motion Detect',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Motion Detect Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Motion Detect',
          display: true
        },
        position: 'left',
      }, {
          id: 'pm2.5',
          type: 'linear',
          scaleLabel: {
            labelString: '',
            display: false
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.params.Temperature) {
        return;
      }
	  
	  document.getElementById("motion").innerHTML = obj.params.motion;
	  var time = obj.time;
	  var subS = time.substring(13,19);
	  var hourS = time.substring(11,13);
	  var vv = parseInt(hourS);
	  var timeS = "";
	  vv = vv - 3;
	  if(vv<0)
		{
		  vv = vv + 24;
		}

		if(vv<10)
		{
			timeS = "0" + vv.toString() + subS;
		}
		else
		{
			timeS = vv.toString() + subS;
		}
	  if(obj.params.motion == 1)
	  {
		  var mot = 20;
		  mot = mot + obj.params.motion;
		  document.getElementById("today").innerHTML = mot;
		  if(mot<40)
		  {
			document.getElementById("pm10dis").innerHTML = "낮음";
		  }
		  else if(mot<80)
		  {
			document.getElementById("pm10dis").innerHTML = "보통";
		  }
		  else
		  {
			document.getElementById("pm10dis").innerHTML = "높음";
		  }
		  
		timeData.push(timeS);
		temperatureData.push(obj.params.motion);
	  }
      // only keep no more than 50 points in the line chart
      const maxLen = 10;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      myLineChart.update();
      
    } catch (err) {
      console.error(err);
    }
  }
	
});
