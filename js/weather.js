"use strict";

var xmldom = require('xmldom').DOMParser;
var req = require('request');
var parser = new xmldom();
var year = {};
year['2007'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2007.xml"
year['2008'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2008.xml";
year['2009'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2009.xml";
year['2010'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2010.json";
year['2011'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2011.json";
year['2012'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2012.json";
year['2013'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2013.json";
year['2014'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2014.json";
year['2015'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2015.json";
year['2016'] = "http://sphinx.murdoch.edu.au/~20010930/ICT375/2016.json";

var data = {

}
var years = {
  "2007": {},
  "2008": {},
  "2009": {},
  "2010": {},
  "2011": {},
  "2012": {},
  "2013": {},
  "2014": {},
  "2015": {},
  "2016": {}
}
var weather = {
  years: {
    "2007": {},
    "2008": {},
    "2009": {},
    "2010": {},
    "2011": {},
    "2012": {},
    "2013": {},
    "2014": {},
    "2015": {},
    "2016": {}
  },
  previousyear: "",

  initialize: function(query, response) {
    var ref = this;
    console.log(query.year);
    if (this.previousyear != query.year) {
      if (query.year == '2008' || query.year == '2007' || query.year == '2009') {
        req({
            url: year[query.year]

          },
          function(error, data, body) {
            //  console.log(body);
            var doc = parser.parseFromString(body, 'application/xml');
            var targetNodes = doc.getElementsByTagName('record');
            var totalsr = 0;
            var totalws = 0;
            var currentmonth = '01';
            var lastdays = 31;
            var timecount = 0;
            //console.log(targetNodes[1].childNodes[3].firstChild.nodeValue);
            var size = targetNodes.length;

            for (var i = 0; i < size; i++) {

              var targetObj = targetNodes[i];
              var month = targetObj.childNodes[1].firstChild.nodeValue.split('/')[1];
              console.log(month);
              if (currentmonth != month) {
                console.log(currentmonth + " " + month);
                if (typeof ref.years[query.year].month[currentmonth] === 'undefined')
                  ref.years[query.year].month[currentmonth] = new Object();
                ref.years[query.year].month[currentmonth].ws = totalws / timecount;
                totalws = 0;
                ref.years[query.year].month[currentmonth].sr = totalsr;
                console.log(JSON.stringify(ref.years[query.year].month[month]));
                totalsr = 0;
                timecount = 0;
                currentmonth = month;
              }
              timecount++;
              //console.log(targetObj.childNodes[1].firstChild.nodeValue);
              //console.log(targetObj.childNodes[3].firstChild.nodeValue);
              if (typeof ref.years[query.year] === 'undefined')
                ref.years[query.year] = new Object();
              if (typeof ref.years[query.year].month === "undefined")
                ref.years[query.year].month = new Object();





              totalws += ((parseFloat(targetObj.childNodes[5].firstChild.nodeValue) * 60 * 60) / 1000);

              if (parseFloat(targetObj.childNodes[7].firstChild.nodeValue) >= 100)
                totalsr += ((parseFloat(targetObj.childNodes[7].firstChild.nodeValue) * (1 / 6)) / 1000);
              if (i == size - 1) {
                if (typeof ref.years[query.year].month[currentmonth] === 'undefined')
                  ref.years[query.year].month[currentmonth] = new Object();
                ref.years[query.year].month[currentmonth].ws = totalws / timecount;
                ref.years[query.year].month[currentmonth].sr = totalsr;
                response.writeHead(200, {
                  'Content-Type': 'text/json'
                });
                response.write(ref.senddata(query));
                response.end();
              }

              //console.log(totalws + " " );
            }

          });
        ref.previousyear = query.year;
      } else if (query.year == '2010' || query.year == '2011' || query.year == '2012' || query.year == '2013' || query.year == '2014' || query.year == '2015' || query.year == '2016') {
        //console.log(query.year);
        req({
            url: year[query.year]

          },
          function(error, data, body) {
            //  console.log(body);
            var jsondata = JSON.parse(body);
            var weatherarr = jsondata.weather.record;
            //console.log(targetNodes[1].childNodes[3].firstChild.nodeValue);
            var size = weatherarr.length;
            var totalsr = 0;
            var totalws = 0;
            var currentmonth = '01';
            var lastdays = 31;
            var timecount = 0;
            console.log(size);
            for (var i = 0; i < size; i++) {

              var targetObj = weatherarr[i];
              //console.log(JSON.stringify(targetObj));
              //console.log(targetObj.childNodes[1].firstChild.nodeValue);
              //console.log(targetObj.childNodes[3].firstChild.nodeValue);
              var month = targetObj.date.split('/')[1];
              //console.log(month);
              if (currentmonth != month) {
                //console.log(currentmonth + " " + month);
                if (typeof ref.years[query.year].month[currentmonth] === 'undefined')
                  ref.years[query.year].month[currentmonth] = new Object();
                ref.years[query.year].month[currentmonth].ws = totalws / timecount;
                totalws = 0;
                ref.years[query.year].month[currentmonth].sr = totalsr;
                //console.log(JSON.stringify(ref.years[query.year].month[month]));
                totalsr = 0;
                timecount = 0;
                currentmonth = month;
              }
              timecount++;
              //console.log(targetObj.childNodes[1].firstChild.nodeValue);
              //console.log(targetObj.childNodes[3].firstChild.nodeValue);
              if (typeof ref.years[query.year] === 'undefined')
                ref.years[query.year] = new Object();
              if (typeof ref.years[query.year].month === "undefined")
                ref.years[query.year].month = new Object();





              totalws += ((parseFloat(targetObj.ws) * 60 * 60) / 1000);

              if (parseFloat(targetObj.sr) >= 100)
                totalsr += ((parseFloat(targetObj.sr) * (1 / 6)) / 1000);
              if (i == size - 1) {
                if (typeof ref.years[query.year].month[currentmonth] === 'undefined')
                  ref.years[query.year].month[currentmonth] = new Object();
                ref.years[query.year].month[currentmonth].ws = totalws / timecount;
                ref.years[query.year].month[currentmonth].sr = totalsr;
                response.writeHead(200, {
                  'Content-Type': 'text/json'
                });
                response.write(ref.senddata(query));
                response.end();
              }
              //console.log(targetObj.date);
            }

          });
        ref.previousyear = query.year;
      }

    } else {
      response.writeHead(200, {
        'Content-Type': 'text/json'
      });
      response.write(this.senddata(query));
      response.end();

    }



  },

  print: function() {
    console.log(JSON.stringify(ref.years[query.year]['01/01/2007'].time['12:00']));
  },
  senddata: function(query) {
    var start = parseInt(query.startmonth);

    var end = parseInt(query.endmonth);
    var obj4client = {};
    obj4client.month = {};
    for (var i = start; i <= end; i++) {
      if (i < 10) {

        obj4client.month["0" + i] = new Object();
        obj4client.month["0" + i] = this.years[query.year].month["0" + i];
      } else {
        obj4client.month["" + i] = new Object();
        obj4client.month["" + i] = this.years[query.year].month["" + i];
      }
    }
    return JSON.stringify(obj4client);
  },
  printGraph: function() {

  },
  processdata: function(year) {

  }


}





module.exports.weather = weather;
