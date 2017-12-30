
var app = angular.module("MyApp", ['ngSanitize']);

app.controller("MeetupCtrl", function($scope, $http) {
  $http.get('/search').
    success(function(data, status, headers, config) {
      console.log(data);
      $scope.meetups = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
});
