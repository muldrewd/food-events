
var app = angular.module("MyApp", ['ngSanitize','angularMoment']);

app.controller("MeetupCtrl", function($scope, $http, moment) {
  $http.get('/search').
    success(function(data, status, headers, config) {
      console.log(data);
      data.forEach(data => data.datetime = moment.utc(data.time).local().format('LLL'))
      $scope.meetups = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
});
