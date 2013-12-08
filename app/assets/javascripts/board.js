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
	$scope.loading = true;
	$scope.schedules = Schedule.query(function() {
		console.info("Schedules", $scope.schedules);
		$scope.loading = false;
	});
}]);

app.controller("ScheduleModalController", ["$scope", "Schedule", function($scope, Schedule) {
	$scope.schedule = null;
	$scope.title = null;
	$scope.action = null;
	
	$scope.createSubmit = function() {
		console.error("Schedule", $scope.schedule);
	};
	
	$scope.create = function() {
		$scope.schedule = {
			name: "",
			type: "daily",
			daily_days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			weekly_start: "Sunday"
		};
		$scope.title = "Create A New Schedule";
		$scope.action = "Create";
	};
	
	$scope.edit = function(schedule) {
		$scope.schedule = schedule;
		$schedule.title = "Edit A Schedule";
		$schedule.action = "Save";
	};
	
	$scope.isCreateDisabled = function() {
		if ($scope.schedule === null) {
			return true;
		}
		return $scope.schedule.name.length < 1;
	};
	
	$scope.toggleDay = function(day) {
		var index = $scope.schedule.daily_days.indexOf(day);
		if (index > -1) {
			$scope.schedule.daily_days.splice(index, 1);
		} else {
			$scope.schedule.daily_days.push(day);
		}
	};
	
	$scope.create();
}]);

//
// SERVICES
//

app.factory("Schedule", ["$rootScope", "$resource", function($rootScope, $resource) {
	return $resource("/:board/schedule", { board: BOARD_NAME }, {
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