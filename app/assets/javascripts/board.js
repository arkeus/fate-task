//
// APPLICATION
//
	
app.run(["$rootScope", function($rootScope) {
	
}]);

//
// CONTROLLERS
//

app.controller("BoardController", ["$scope", function($scope) {
	$scope.schedules = null;
	
	$scope.create = function(schedule) {
		
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