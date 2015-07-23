var app = angular.module('Worldstar', []);
var clubID = 101490;


app.factory('club', ['$http', function($http){
	var o = {
		info: [],
		members: [],
		activities: [],
		activitySum: [],
		leaderboard: []
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

		return $http.get('/api/club/'+ clubID +'/activities/latest').success(function(data){
			angular.copy(data, o.activities);
			console.log(data[0]);
		});
	};

	o.getActivitySum = function() {

		return $http.get('/api/club/'+ clubID +'/activities/sum').success(function(data){
			angular.copy(data, o.activitySum);
		});
	};

	o.getLeaderboard = function() {

		return $http.get('/api/club/'+ clubID +'/leaderboard').success(function(data){
			angular.copy(data, o.leaderboard);
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
	$scope.activitySum = club.activitySum;
	$scope.leaderboard = club.leaderboard;
	$scope.activities = club.activities;

	club.getInfo();
	club.getMembers();
	club.getActivitySum();
	club.getLeaderboard();
	club.getActivities();
}]);
