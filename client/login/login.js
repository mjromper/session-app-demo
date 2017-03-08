'use strict';

angular.module('sessApp').factory('AuthService', [ '$rootScope', '$http', '$cookies', function($rootScope, $http, $cookies) {
	var loginUser;

	function setLoginUser(u) {
		loginUser = u;
		$cookies.putObject('sessionApp-user', u, { expires: 0, httpOnly: true, path: '/' });
		$rootScope.loginUser = u;
	}

	function getLoginUser() {
		var userCookies = $cookies.getObject('sessionApp-user');
		loginUser = userCookies;
		if ( userCookies && !$rootScope.loginUser ) {
			$rootScope.loginUser = loginUser;
		}
		return loginUser;
	}

	function login(user) {
		return $http.post('/auth', user ).then( function(res) {
			setLoginUser(res.data);
		}, function(err) {
			console.log('err', err);
		});
	}

	return {
		setLoginUser: setLoginUser,
		getLoginUser: getLoginUser,
		login: login
	};

}]);

angular.module('sessApp').controller('LoginCtrl', ['$scope', '$state', 'AuthService',
	function($scope, $state, AuthService) {
	$scope.user = {
		dir: 'ONDEMAND'
	};

	$scope.someUsers = ['20036919', '50013849', '50295945', '20128051', '20078041'];


	$scope.doLogin = function(){
		$scope.loginProm = AuthService.login($scope.user).then( function(res) {
			$state.go('dashboard');
		});
	};
}]);
