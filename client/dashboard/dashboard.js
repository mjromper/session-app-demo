'use strict';

require( ["js/qlik"], function ( qlik ) {

    angular.module('sessApp').controller('DashboardCtrl', [ '$scope', '$http', '$timeout','AuthService',
        function($scope, $http, $timeout, AuthService) {

        $scope.sessionApp;

        $scope.user = AuthService.getLoginUser();

        $scope.clearSelections = function() {
            $scope.sessionApp.clearAll();
        }

        $scope.create = function(){
            $scope.creatingProm = $http.get('/user/create/'+AuthService.getLoginUser().id).then(function(res){

                var config = {
                    host: res.data.config.host,
                    prefix: res.data.config.prefix,
                    port: (res.data.config.isSecure)? 443: 80,
                    identity: res.data.config.identity,
                    isSecure: res.data.config.isSecure
                };

                var sessionApp = qlik.sessionAppFromApp("engineData", config);

                sessionApp.getObject("CurrentSelections", "CurrentSelections");

                sessionApp.visualization.create('barchart', ["StartWeekDay","=sum(calories)"],{
                     "title": "Calories by week",
                     "showTitles": true
                }).then(function(model) {
                    model.show('calories');
                });

                sessionApp.visualization.create('piechart', ["TimeOfDay","=sum(calories)"],{
                     "title": "Calories by Time of the day",
                     "showTitles": true
                }).then(function(model) {
                    model.show('timeofday');
                });

                sessionApp.visualization.create('linechart', ["[StartDate]","=sum(calories)"],{
                    "title": "Calories by date",
                    "showTitles": true
                }).then(function(model) {
                    model.show('calories2');
                });

                sessionApp.visualization.create('kpi', ["=num(SubField(OSUser(),'=',3),'#.')"], {
                    "title": "Logged-in Username",
                    "fontSize" : "S",
                    "showMeasureTitle": false,
                    "showTitles": true
                }).then(function(model) {
                    model.show('userkpi');
                });

                sessionApp.visualization.create('kpi', ["=sum(calories)"],{
                    "title": "Total calories",
                    "fontSize" : "S",
                    "showMeasureTitle": false,
                    "showTitles": true
                }).then(function(model) {
                    model.show('calorieskpi');
                });

                $scope.sessionApp = sessionApp;


            }, function(err){
                console.log("err", err);
            });
        };



    }]);

    angular.bootstrap( document, ["sessApp", "qlik-angular"] );

});
