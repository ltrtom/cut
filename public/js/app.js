
var app = angular.module('keeps', ['ngRoute', 'mgcrea.ngStrap']);

app.config(['$routeProvider' , function($routeProvider){
        $routeProvider.
            when('/', {
                templateUrl: '/tpl/keeps.html',
                controller: KeepsCtrl
            })
            .otherwise({
                redirectTo: '/'
            });
}]);



