/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var request = require("request");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/score", function (req, res) {
  const countryCode = req.query.countryCode;
  const requestUrl =
    "https://www.travel-advisory.info/api?countrycode=" + countryCode;

  request(requestUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(404).json({ errorMessage: "3rd Party API Error" });
    }
  });
});

app.get("/covidstats", function (req, res) {
  const countryCode = req.query.countryCode;
  const requestUrl =
    "https://corona-api.com/countries/" + countryCode;

  request(requestUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(404).json({ errorMessage: "3rd Party API Error" });
    }
  });
});

app.get("/covidgraph", function (req, res) {
  const countryCode = req.query.countryCode;
  const requestUrl =
    "https://corona.dnsforfamily.com/graph.png?c=" + countryCode;

  request(requestUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // Here just sending the image url, can render image on front-end with this url as image src
      res.status(200).json({imageUrl: requestUrl});
    } else {
      res.status(404).json({ errorMessage: "3rd Party API Error" });
    }
  });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
