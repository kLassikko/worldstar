var app = angular.module('Worldstar', []);
var clubID = 101490;


app.factory('club', ['$http', function($http){
	var o = {
		info: [],
		members: [],
		activities: []
	};

	o.getInfo = function() {
		return $http.get('/api/club/'+ clubID).success(function(data){
			angular.copy(data, o.info);
		});
	};

	o.getMembers = function() {
		return $http.get('/api/club/'+ clubID +'/members').success(function(data){
			angular.copy(data, o.members);
		});
	};

	o.getActivities = function() {

		return $http.get('/api/club/'+ clubID +'/activities').success(function(data){
			angular.copy(data, o.activities);
		});
	};


	return o;
}])

app.controller('MainCtrl', [
'$scope',
'club',
function($scope, club){

	$scope.info = club.info;
	$scope.members = club.members;
	$scope.activities = club.activities;

	club.getInfo();
	club.getMembers();
	club.getActivities();

}]);
