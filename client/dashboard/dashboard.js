'use strict';

require( ["js/qlik"], function ( qlik ) {

    angular.module('sessApp').controller('DashboardCtrl', [ '$scope', '$http', '$timeout','AuthService',
        function($scope, $http, $timeout, AuthService) {

        $scope.sessionApp;

        $scope.user = AuthService.getLoginUser();

        $scope.clearSelections = function() {
            $scope.sessionApp.clearAll();
        }

        $scope.createFromApp = function(){
            $scope.creatingProm = $http.get('/user/createfromapp/'+AuthService.getLoginUser().id).then(function(res){

                var config = {
                    host: res.data.config.host,
                    prefix: res.data.config.prefix,
                    port: (res.data.config.isSecure)? 443: 80,
                    identity: res.data.config.identity,
                    isSecure: res.data.config.isSecure
                };
                var sessionApp = qlik.sessionAppFromApp( res.data.appId, config );

                //AirBnB
                /*sessionApp.getObject("CurrentSelections", "CurrentSelections");
                sessionApp.getObject("kpi1", "GbaUKh");
                sessionApp.getObject("kpi2", "uGMRjmW");
                sessionApp.getObject("kpi3", "fajjSC");
                sessionApp.getObject("kpi4", "sgJxJz");

                sessionApp.getObject("chart1", "pvtJnKf");
                sessionApp.getObject("chart2", "c06528b2-474e-4d6b-86de-ee18580e0f81");
                sessionApp.getObject("chart3", "dnmEmpj");
                sessionApp.getObject("chart4", "a5da096f-bc90-47f0-b4bd-612ac21f8cb6");*/

                // BANK
                sessionApp.getObject("CurrentSelections", "CurrentSelections");
                sessionApp.getObject("kpi1", "LfPLcuc");
                sessionApp.getObject("kpi2", "ayvvjD");
                sessionApp.getObject("kpi3", "d542c53d-bc66-47cc-8a6b-eb9f44fc5cdd");
                sessionApp.getObject("kpi4", "xHWzHz")
                /*;
                */

                sessionApp.getObject("evolucionClientes", "PHWY");
                sessionApp.getObject("clientesSexo", "Pqzmh");

                sessionApp.getObject("tableClientes", "QxVXV");
                sessionApp.getObject("clientesSitLaboral","eSPGpYz");
                sessionApp.getObject("clientesEstadoCivil", "VsqqFH");
                sessionApp.getObject("clientesCanalContratacion", "BJMKDTm");
                /*sessionApp.getObject("chart4", "a5da096f-bc90-47f0-b4bd-612ac21f8cb6");*/


                //Client

                sessionApp.getObject("datosCliente", "JSMUKTT");
                sessionApp.getObject("clientePosicionActualKpi", "cAEtj");
                sessionApp.getObject("clienteSaldoMedioKpi", "VcQP");

                sessionApp.getObject("tablaCliente", "48540a5f-f347-4781-a199-9ccc207bf976");
                sessionApp.getObject("evolucionCliente", "YgFE");




                $scope.sessionAppFromApp = sessionApp;


            }, function(err){
                console.log("err", err);
            });
        };

        $scope.create = function(){
            $scope.creatingProm = $http.get('/user/create/'+AuthService.getLoginUser().id).then(function(res){

                var config = {
                    host: res.data.config.host,
                    prefix: res.data.config.prefix,
                    port: (res.data.config.isSecure)? 443: 80,
                    identity: res.data.config.identity,
                    isSecure: res.data.config.isSecure
                };

                console.log("config", config);

                var sessionApp = qlik.sessionAppFromApp("engineData", config);
                //var sessionApp = qlik.sessionApp(config);

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
