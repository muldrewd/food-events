var app = angular.module("MyApp", ['ngSanitize','angularMoment']);

app.controller("MeetupCtrl", function($scope, $http, moment) {
  $http.get('/search')
    .success(function(data, status, headers, config) {

      console.log(data);

      // convert the UTC time to a locale time format
      data.forEach(data => data.datetime = moment.utc(data.time).local().format('LLL'))

      $scope.meetups = data;

    })
    .error(function(data, status, headers, config) {
      console.log('No data returned...');
    });
});


app.filter('highlight', function () {
  return function (text, search, caseSensitive) {
    if (text && (search || angular.isNumber(search))) {
      text = text.toString();
      search = search.toString();
      if (caseSensitive) {
        return text.split(search).join('<span class="highlighted">' + search + '</span>');
      } else {
        return text.replace(new RegExp(search, 'gi'), '<span class="highlighted">$&</span>');
      }
    } else {
      return text;
    }
  };
});
