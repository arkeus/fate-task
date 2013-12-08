//
// APPLICATION
//
	
app.run(["$rootScope", function($rootScope) {
	$("#schedule-form").submit(function(e) { e.preventDefault(); });
}]);

//
// CONTROLLERS
//

app.controller("BoardController", ["$scope", "Schedule", function($scope, Schedule) {
	$scope.schedules = Schedule.list;
	
	$scope.create = function(schedule) {
		console.error("HI?");
	};
}]);

app.controller("ModalController", ["$scope", "Schedule", function($scope, Schedule) {
	$scope.schedule = {};
	
	$scope.create = function() {
		console.error("Schedule", $scope.schedule);
	};
}]);

//
// SERVICES
//

app.factory("Schedule", ["$rootScope", "$resource", function($rootScope, $resource) {
	return $resource("/schedule/:action", {}, {
		list: { method: "GET", params: { action: "list" }, isArray: true }
	});
}]);

//
// DIRECTIVES
//

app.directive("schedule", [function() {
	return {
		restrict: "A",
		controller: ["$scope", function($scope) {
			
		}],
	};
}]);

//
// FILTERS
//

app.filter("toHours", function() {
	return function(time) {
		return "";
	};
});