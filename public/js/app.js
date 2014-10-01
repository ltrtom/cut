
var app = angular.module('keeps', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

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



