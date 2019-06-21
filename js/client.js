$(document).ready(function() {

  formOne();








});



function formOne() {
  var html = '' +
    '<label>Year<select name="startmonth" id="startmonth">' +
    '<option value="01">January</option>' +
    '<option value="02">Feburary</option>' +
    '<option value="03">March</option>' +
    '<option value="04">April</option>' +
    '<option value="05">May</option>' +
    '<option value="06">June</option>' +
    '<option value="07">July</option>' +
    '<option value="08">August</option>' +
    '<option value="09">September</option>' +
    '<option value="10">October</option>' +
    '<option value="11">November</option>' +
    '<option value="12">December</option>' +
    '</select><br />' +
    '<label>Year<select name="endmonth" id="endmonth">' +
    '<option value="01">January</option>' +
    '<option value="02">Feburary</option>' +
    '<option value="03">March</option>' +
    '<option value="04">April</option>' +
    '<option value="05">May</option>' +
    '<option value="06">June</option>' +
    '<option value="07">July</option>' +
    '<option value="08">August</option>' +
    '<option value="09">September</option>' +
    '<option value="10">October</option>' +
    '<option value="11">November</option>' +
    '<option value="12">December</option>' +
    '</select><br />' +
    '<label>Year<select name="year" id="year">' +
    '<option value="2007">2007</option>' +
    '<option value="2008">2008</option>' +
    '<option value="2009">2009</option>' +
    '<option value="2010">2010</option>' +
    '<option value="2011">2011</option>' +
    '<option value="2012">2012</option>' +
    '<option value="2013">2013</option>' +
    '<option value="2014">2014</option>' +
    '<option value="2015">2015</option>' +
    '<option value="2016">2016</option>' +
    '</select><br />' +
    '<input type="checkbox" id="windspeed" name="windspeed" value="wind" />Windspeed<br />' +
    '<input type="checkbox" id="solar" name="solar" value="solar" />Solar Radiation<br />' +
    '<input type="checkbox" id="graph" value="graph" />Graph<br />' +
    '<input type="checkbox" id="table" value="table" />Table<br />' +

    '<input type="button" value="Submit" onClick="submit();"/>' +
    '<div id="confirmation"></div>' +
    '<br /><p>Please note subsequent uses of the same year will be alot faster.</p>';

  document.getElementById("selectData").innerHTML = html;
  //document.getElementById("datasent").innerHTML="";

}








function submit() {
  var year = document.getElementById("year").value;
  var startmonth = document.getElementById("startmonth").value;
  var endmonth = document.getElementById("endmonth").value;
  var wind = false;
  var solar = false;
  var table = false;
  var graph = false;
  //document.getElementById("ws_table").innerHTML="";
  if (document.getElementById("windspeed").checked)
    wind = true;
  if (document.getElementById("solar").checked)
    solar = true;
  if (document.getElementById("table").checked)
    table = true;
  if (document.getElementById("graph").checked)
    graph = true;
    document.getElementById("ws_div").innerHTML="";
    document.getElementById("sr_div").innerHTML="";
    document.getElementById("ws_table").innerHTML="";
    document.getElementById("sr_table").innerHTML="";

  if (valid(year, startmonth, endmonth, wind, solar, table, graph)) {
    document.getElementById("loading").innerHTML = "<img src='/loading' />";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        //document.getElementById("datasent").innerHTML=xhttp.responseText;
        if (wind && graph)
          windspeedgraph(xhttp.responseText);
        if (solar && graph)
          solargraph(xhttp.responseText);
        if (wind && table) {
          var data = makearrayws(JSON.parse(xhttp.responseText));
          maketablews(data);


        }
        if (solar && table) {
          var data = makearraysr(JSON.parse(xhttp.responseText));
          maketablesr(data);

        }
        document.getElementById("loading").innerHTML = "";
        console.log(xhttp.responseText);
      }
    };


    xhttp.open("GET", "/submit?year=" + year + "&startmonth=" + startmonth +
      "&endmonth=" + endmonth + "&wind=" + wind + "&solar=" + solar + "&table=" + table + "&graph=" + graph, true);
    xhttp.send();
    //document.getElementById("datasent").innerHTML="Sent to server";
  }
}

function maketablews(data) {
  var table = document.getElementById("ws_table");
  table.innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    var row = table.insertRow(i);
    //console.log(data);
    for (var p = 0; p < (data[i]).length; p++) {
      var cell = row.insertCell(p);
      if (p == 1 && i != 0) {
        var newText = document.createTextNode(Math.round(parseFloat(data[i][p]) * 100) / 100);
      } else {
        var newText = document.createTextNode(data[i][p]);
      }
      cell.appendChild(newText);
    }
  }
}

function maketablesr(data) {
  var table = document.getElementById("sr_table");
  table.innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    var row = table.insertRow(i);
    for (var p = 0; p < data[i].length; p++) {
      console.log(data[i]);
      var cell = row.insertCell(p);
      if (p == 1 && i != 0) {
        var newText = document.createTextNode(Math.round(parseFloat(data[i][p]) * 100) / 100);
      } else {
        var newText = document.createTextNode(data[i][p]);
      }
      cell.appendChild(newText);
    }
  }
}

function windspeedgraph(object) {

  var jsonobj = JSON.parse(object);
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {
    'packages': ['corechart']
  });

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    var header = ['Month',

      'Wind Speed Avg Km/h'
    ];
    var months = makearrayws(jsonobj);
    // months.push(header);
    // console.log(jsonobj.month);
    // // if (typeof jsonobj.month['01'] !== "undefined") {
    //   months.push(['January', parseFloat(jsonobj.month['01'].ws)]);
    // }
    // if (typeof jsonobj.month['02'] !== "undefined") {
    //   months.push(['Feburary', parseFloat(jsonobj.month['02'].ws)]);
    // }
    // if (typeof jsonobj.month['03'] !== "undefined") {
    //   months.push(['March', parseFloat(jsonobj.month['03'].ws)]);
    // }
    // if (typeof jsonobj.month['04'] !== "undefined") {
    //   months.push(['April', parseFloat(jsonobj.month['04'].ws)]);
    // }
    // if (typeof jsonobj.month['05'] !== "undefined") {
    //   months.push(['May', parseFloat(jsonobj.month['05'].ws)]);
    // }
    // if (typeof jsonobj.month['06'] !== "undefined") {
    //   months.push(['June', parseFloat(jsonobj.month['06'].ws)]);
    // }
    // if (typeof jsonobj.month['07'] !== "undefined") {
    //   months.push(['July', parseFloat(jsonobj.month['07'].ws)]);
    // }
    // if (typeof jsonobj.month['08'] !== "undefined") {
    //   months.push(['August', parseFloat(jsonobj.month['08'].ws)]);
    // }
    // if (typeof jsonobj.month['09'] !== "undefined") {
    //   months.push(['September', parseFloat(jsonobj.month['09'].ws)]);
    // }
    // if (typeof jsonobj.month['10'] !== "undefined") {
    //   months.push(['October', parseFloat(jsonobj.month['10'].ws)]);
    // }
    // if (typeof jsonobj.month['11'] !== "undefined") {
    //   months.push(['November', parseFloat(jsonobj.month['11'].ws)]);
    // }
    // if (typeof jsonobj.month['12'] !== "undefined") {
    //   months.push(['December', parseFloat(jsonobj.month['12'].ws)]);
    // }
    var data = google.visualization.arrayToDataTable(months);

    // Set chart options
    var options = {
      title: 'Wind Speed Km/h',
      curveType: 'function',
      legend: {
        position: 'bottom'
      }
    };

    function resizeChart() {
      chart.draw(data, options);
    }
    if (document.addEventListener) {
      window.addEventListener('resize', resizeChart);
    } else if (document.attachEvent) {
      window.attachEvent('onresize', resizeChart);
    } else {
      window.resize = resizeChart;
    }
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById('ws_div'));
    chart.draw(data, options);
  }

}

function makearrayws(jsonobj) {
  var header = ['Month',

    'Wind Speed Avg Km/h'
  ];
  var months = new Array();
  months.push(header);
  if (typeof jsonobj.month['01'] !== "undefined") {
    months.push(['Ja', parseFloat(jsonobj.month['01'].ws)]);
  }
  if (typeof jsonobj.month['02'] !== "undefined") {
    months.push(['Fe', parseFloat(jsonobj.month['02'].ws)]);
  }
  if (typeof jsonobj.month['03'] !== "undefined") {
    months.push(['Ma', parseFloat(jsonobj.month['03'].ws)]);
  }
  if (typeof jsonobj.month['04'] !== "undefined") {
    months.push(['Ap', parseFloat(jsonobj.month['04'].ws)]);
  }
  if (typeof jsonobj.month['05'] !== "undefined") {
    months.push(['May', parseFloat(jsonobj.month['05'].ws)]);
  }
  if (typeof jsonobj.month['06'] !== "undefined") {
    months.push(['Ju', parseFloat(jsonobj.month['06'].ws)]);
  }
  if (typeof jsonobj.month['07'] !== "undefined") {
    months.push(['Jul', parseFloat(jsonobj.month['07'].ws)]);
  }
  if (typeof jsonobj.month['08'] !== "undefined") {
    months.push(['Au', parseFloat(jsonobj.month['08'].ws)]);
  }
  if (typeof jsonobj.month['09'] !== "undefined") {
    months.push(['Se', parseFloat(jsonobj.month['09'].ws)]);
  }
  if (typeof jsonobj.month['10'] !== "undefined") {
    months.push(['Oc', parseFloat(jsonobj.month['10'].ws)]);
  }
  if (typeof jsonobj.month['11'] !== "undefined") {
    months.push(['No', parseFloat(jsonobj.month['11'].ws)]);
  }
  if (typeof jsonobj.month['12'] !== "undefined") {
    months.push(['De', parseFloat(jsonobj.month['12'].ws)]);
  }
  return months;
}

function makearraysr(jsonobj) {
  var header = ['Month',
    'Solar Radiation kWh/(meter squared)'
  ];
  var months = new Array();
  months.push(header);

  if (typeof jsonobj.month['01'] !== "undefined") {
    months.push(['Ja', parseFloat(jsonobj.month['01'].sr)]);
  }
  if (typeof jsonobj.month['02'] !== "undefined") {
    months.push(['Fe', parseFloat(jsonobj.month['02'].sr)]);
  }
  if (typeof jsonobj.month['03'] !== "undefined") {
    months.push(['Ma', parseFloat(jsonobj.month['03'].sr)]);
  }
  if (typeof jsonobj.month['04'] !== "undefined") {
    months.push(['Ap', parseFloat(jsonobj.month['04'].sr)]);
  }
  if (typeof jsonobj.month['05'] !== "undefined") {
    months.push(['May', parseFloat(jsonobj.month['05'].sr)]);
  }
  if (typeof jsonobj.month['06'] !== "undefined") {
    months.push(['Ju', parseFloat(jsonobj.month['06'].sr)]);
  }
  if (typeof jsonobj.month['07'] !== "undefined") {
    months.push(['Jul', parseFloat(jsonobj.month['07'].sr)]);
  }
  if (typeof jsonobj.month['08'] !== "undefined") {
    months.push(['Au', parseFloat(jsonobj.month['08'].sr)]);
  }
  if (typeof jsonobj.month['09'] !== "undefined") {
    months.push(['Se', parseFloat(jsonobj.month['09'].sr)]);
  }
  if (typeof jsonobj.month['10'] !== "undefined") {
    months.push(['Oc', parseFloat(jsonobj.month['10'].sr)]);
  }
  if (typeof jsonobj.month['11'] !== "undefined") {
    months.push(['No', parseFloat(jsonobj.month['11'].sr)]);
  }
  if (typeof jsonobj.month['12'] !== "undefined") {
    months.push(['De', parseFloat(jsonobj.month['12'].sr)]);
  }
  return months;
}

function solargraph(object) {

  var jsonobj = JSON.parse(object);
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {
    'packages': ['corechart']
  });

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    var header = ['Month',
      'Solar Radiation kWh/(meter squared)'
    ];
    var months = makearraysr(jsonobj);
    // months.push(header);
    //console.log(jsonobj.month);
    // if (typeof jsonobj.month['01'] !== "undefined") {
    //   months.push(['Ja', parseFloat(jsonobj.month['01'].sr)]);
    // }
    // if (typeof jsonobj.month['02'] !== "undefined") {
    //   months.push(['Fe', parseFloat(jsonobj.month['02'].sr)]);
    // }
    // if (typeof jsonobj.month['03'] !== "undefined") {
    //   months.push(['Ma', parseFloat(jsonobj.month['03'].sr)]);
    // }
    // if (typeof jsonobj.month['04'] !== "undefined") {
    //   months.push(['Ap', parseFloat(jsonobj.month['04'].sr)]);
    // }
    // if (typeof jsonobj.month['05'] !== "undefined") {
    //   months.push(['May', parseFloat(jsonobj.month['05'].sr)]);
    // }
    // if (typeof jsonobj.month['06'] !== "undefined") {
    //   months.push(['Ju', parseFloat(jsonobj.month['06'].sr)]);
    // }
    // if (typeof jsonobj.month['07'] !== "undefined") {
    //   months.push(['Jul', parseFloat(jsonobj.month['07'].sr)]);
    // }
    // if (typeof jsonobj.month['08'] !== "undefined") {
    //   months.push(['Au', parseFloat(jsonobj.month['08'].sr)]);
    // }
    // if (typeof jsonobj.month['09'] !== "undefined") {
    //   months.push(['Se', parseFloat(jsonobj.month['09'].sr)]);
    // }
    // if (typeof jsonobj.month['10'] !== "undefined") {
    //   months.push(['Oc', parseFloat(jsonobj.month['10'].sr)]);
    // }
    // if (typeof jsonobj.month['11'] !== "undefined") {
    //   months.push(['No', parseFloat(jsonobj.month['11'].sr)]);
    // }
    // if (typeof jsonobj.month['12'] !== "undefined") {
    //   months.push(['De', parseFloat(jsonobj.month['12'].sr)]);
    // }
    var data = google.visualization.arrayToDataTable(months);

    // Set chart options
    var options = {
      title: 'Solar Radiation  kWh/(meter squared)',
      curveType: 'function',
      legend: {
        position: 'bottom'
      }
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById('sr_div'));

    function resizeChart() {
      chart.draw(data, options);
    }
    if (document.addEventListener) {
      window.addEventListener('resize', resizeChart);
    } else if (document.attachEvent) {
      window.attachEvent('onresize', resizeChart);
    } else {
      window.resize = resizeChart;
    }
    chart.draw(data, options);
  }

}

function loadtable(object) {

}

function valid(year, startmonth, endmonth, wind, solar, table, graph) {
  var error = false;
  var message = "";
  if (parseInt(startmonth) >= parseInt(endmonth)) {
    message += "first day of startmonth should be prior to last day of endmonth";
    error = true;
  }
  if (!(wind || solar)) {
    message += "please select either windspeed or solar radiation or both\n";
    error = true;
  }
  if (!(table || graph)) {
    message += "please select either table or graph or both";
    error = true;
  }
  if (error) {
    document.getElementById("error").innerHTML = message;
    alert(message);
  } else {
    document.getElementById("error").innerHTML = "";
  }
  // document.getElementById("iderr").innerHTML="";
  // document.getElementById("nameerr").innerHTML="";
  // document.getElementById("surnameerr").innerHTML="";
  // document.getElementById("ageerr").innerHTML="";
  // document.getElementById("gendererr").innerHTML="";
  // document.getElementById("degreeerr").innerHTML="";
  //
  // if(id=="" || id.trim()=="") {
  //   document.getElementById("iderr").innerHTML="Id must be input";
  //   console.log(typeof id);
  //   error=true;
  // }
  // if(name==""||name.trim()=="") {
  //   document.getElementById("nameerr").innerHTML="Name must be input";
  //   error=true;
  // }
  // if(surname==""||surname.trim()=="") {
  //   document.getElementById("surnameerr").innerHTML="Surname must be input";
  //   error=true;
  // }
  // if(age==""||age.trim()=="" || !Number.isInteger(Number(age))) {
  //   document.getElementById("ageerr").innerHTML="Age must be input";
  //   error=true;
  // }
  // if(!document.getElementById("male").checked && !document.getElementById("female").checked){
  //   document.getElementById("gendererr").innerHTML="Gender must be selected";
  //   error=true;
  // }
  // if(degree==""||degree.trim()=="") {
  //   document.getElementById("degreeerr").innerHTML="Degree must be input";
  //   error=true;
  // }
  return !error;
}
