'use strict';

angular.module('sessApp', ['ui.router', 'ngCookies', 'cgBusy'])
.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider.state( {
        name: 'dashboard',
        url: '/dashboard',
        templateUrl: 'dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        authenticate: true
    });

    $stateProvider.state( {
        name: 'login',
        url: '/login',
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl',
        //authenticate: true
    });

}])
.run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, AuthService) {

    $rootScope.$on('$stateChangeStart', function ( event, next, nextparams ) {
        if ( next.authenticate ){
            if ( !AuthService.getLoginUser() ) {
                $state.go('login', nextparams);
                event.preventDefault();
            }
        } else {
            //AuthService.setLoginUser(null);
        }
    });

    $rootScope.logout = function() {
        AuthService.setLoginUser(null);
        $state.go('login');
    };

}]);

