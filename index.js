// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.




'use strict';
const http = require('https');              //Google Custom Search requires ssl authentication
const weather_host = 'api.worldweatheronline.com';
const weather_api_key = '45988dfb5fae49a1846171234182901';

const search_host = 'www.googleapis.com';
const search_api_key = 'AIzaSyBHR7ched0g9KlxpWAzAZe1Id_7yi8Xovo';
const cse_id = '007799595185471624536%3Ajdruqtribrg';
exports.lakki = (req, res) => {

   let intent = req.body.queryResult.intent.displayName;

   if(intent == "my_google_search" || intent == "Default Fallback Intent"){
      let text = req.body.queryResult.queryText;
      callGoogleSearchAPI(text).then((output) => {
         res.setHeader('Content-Type', 'application/json');
         res.send(JSON.stringify({ 'fulfillment_text': output}));
      }).catch((error) => {
         res.setHeader('Content-Type', 'application/json');
         res.send(JSON.stringify({ 'fulfillment_text': error}));
      });
   }
   else if(intent == "my_weather" ){
   // Get the city and date from the request
     let city = req.body.queryResult.parameters['geo-city']; // city is a required param
     let state = "";
     let country = "";
     if(city == null){
        //Obtain current location
     }
     if(req.body.queryResult.parameters['geo-state-us'] != ""){
        state = "," + req.body.queryResult.parameters['geo-state-us'];
     }
     if(req.body.queryResult.parameters['geo-country'] != ""){
        country = "," + req.body.queryResult.parameters['geo-country'];
     }
     city = city + state + country;
     // Get the date for the weather forecast (if present)
     let date = '';
     if (req.body.queryResult.parameters['date']) {
       date = req.body.queryResult.parameters['date'];
       console.log('Date: ' + date);
     }
     // Call the weather API
     callWeatherApi(city, date).then((output) => {
       // Return the results of the weather API to Dialogflow
       res.setHeader('Content-Type', 'application/json');
       res.send(JSON.stringify({ 'fulfillment_text': output}));
     }).catch((error) => {
       // If there is an error let the user know
       res.setHeader('Content-Type', 'application/json');
       res.send(JSON.stringify({ 'fulfillment_text': error}));
     });
   }
};

function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + weather_api_key + '&date=' + date;
    console.log('API Request: ' + weather_host + path);
    // Make the HTTP request to get the weather
    http.get({host: weather_host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];
        // Create response
        let output = `Current conditions in the ${location['type']}
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempC']}C or ${forecast['maxtempF']}F and a low of
        ${forecast['mintempC']}C or ${forecast['mintempF']}F on
        ${forecast['date']}.

        ${weather_host}${path}`;
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}

function callGoogleSearchAPI (text) {
   return new Promise((resolve, reject) => {
      let path = '/customsearch/v1?key=' + search_api_key + '&cx=' + cse_id + '&q=' + encodeURIComponent(text);

      console.log('API Request' + search_host + path);

    // Make the HTTP request to get the search results
    http.get({host: search_host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
        res.on('data', (d) => { body += d; }); // store each response chunk
        res.on('end', () => {
          // After all the data has been received parse the JSON for desired data
         let response = JSON.parse(body);

         let items = response['items'];

         let totalResults = response['searchInformation']['formattedTotalResults'];
         let totalTime = response['searchInformation']['formattedSearchTime'];

         let imFeelingLucky = items[0];

         let output = `Total search results: ${totalResults}\n
                       Total search duration: ${totalTime}\n
                       First Result:\n
                       ${imFeelingLucky.title}
                       ${imFeelingLucky.link} `;

          console.log(output);
          resolve(output);
        });
        res.on('error', (error) => {
          reject(error);
        });
      });
  });
}
