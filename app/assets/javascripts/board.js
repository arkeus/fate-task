//
// APPLICATION
//
	
app.run(["$rootScope", function($rootScope) {
	//$("#schedule-form").submit(function(e) { e.preventDefault(); });
}]);

//
// CONTROLLERS
//

app.controller("BoardController", ["$scope", "Schedule", "Board", function($scope, Schedule, Board) {
	$scope.loading = true;
	$scope.schedules = null;
	$scope.error = null;
	
	Schedule.query().$promise.then(function(schedules) {
		$scope.schedules = schedules;
		$scope.loading = false;
	}, function() {
		$scope.error = "Could not load schedules";
	});
	
	$scope.createSchedule = function() {
		Board.createSchedule();
	};
	
	$scope.deleteSchedule = function(schedule_hash) {
		$scope.schedules.splice($scope.schedules.indexOf(schedule_hash), 1);
		var schedule = new Schedule(schedule_hash);
		schedule.$delete({ id: schedule.id }).then(function() {
			console.info("SUCCESS");
		}, function() {
			$scope.schedules.push(schedule_hash);
		});
	};
}]);

app.controller("ScheduleController", ["$scope", "Task", "Board", function($scope, Task, Board) {
	$scope.addTask = function(schedule_id) {
		var task = new Task({
			schedule_id: schedule_id,
			name: "Unnamed Task"
		});
		task.$save({ schedule_id: schedule_id }).then(function(task) {
			$scope.schedule.schedule_tasks.push(task);
		});
	};
	
	$scope.deleteTask = function(task_hash) {
		$scope.schedule.schedule_tasks.splice($scope.schedule.schedule_tasks.indexOf(task_hash), 1);
		var task = new Task(task_hash);
		task.$delete({ schedule_id: task.schedule_id, id: task.id }).then(function() {
			console.info("SUCCESS");
		}, function() {
			$scope.schedule.schedule_tasks.push(task_hash);
		});
	};
	
	$scope.editTask = function(event) {
		var self = this;
		var task = new Task(self.task);
		var element = $(event.target);
		var container = element.parent();
		var editable = $("<input>").attr({ type: "text", value: task.name }).addClass("editable-task");
		element.hide();
		container.append(editable).addClass("editing");
		editable.focus().on("blur", function(event) {
			editable.prop("disabled", true);
			container.removeClass("editing");
			task.name = editable.val();
			if (task.name == self.task.name) {
				editable.remove();
				element.show();
				return;
			}
			task.$update({ schedule_id: task.schedule_id, id: task.id }).then(function() {
				self.task.name = editable.val();
				editable.remove();
				element.show();
			}, function() {
				editable.remove();
				element.show();
			});
		}).on("keydown", function(event) {
			if (event.which == 13) {
				$(this).blur();
			}
		});
	};
}]);

app.controller("ScheduleModalController", ["$scope", "Schedule", function($scope, Schedule) {
	$scope.schedule = null;
	$scope.title = null;
	$scope.action = null;
	$scope.state = null;
	$scope.error = null;
	
	$scope.createSubmit = function() {
		var schedule = new Schedule($scope.schedule);
		schedule.$save(function(schedule) {
			$scope.schedules.push(schedule);
		}, function(error) {
			$scope.error = error['data']['error'];
			console.error("GOT AN ERROR", error);
		});
	};
	
	$scope.editSubmit = function() {
		
	};
	
	$scope.$on("create-schedule", function(message) {
		$scope.schedule = {
			name: "",
			schedule_type: "daily",
			daily_days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			weekly_start: 0
		};
		$scope.title = "Create A New Schedule";
		$scope.action = "Create";
		$scope.state = "modal";
	});
	
	$scope.$on("edit-schedule", function(message, schedule) {
		$scope.schedule = schedule;
		$schedule.title = "Edit A Schedule";
		$schedule.action = "Save";
	});
	
	$scope.cancel = function() {
		$scope.state = "board";
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
}]);

//
// SERVICES
//

app.factory("Schedule", ["$rootScope", "$resource", function($rootScope, $resource) {
	return $resource("/:board/schedules/:id", { board: board.name }, {
		update: { method: "PUT" }
	});
}]);

app.factory("Task", ["$rootScope", "$resource", function($rootScope, $resource) {
	return $resource("/:board/schedules/:schedule_id/tasks/:id", { board: board.name }, {
		update: { method: "PUT" }
	});
}]);

app.factory("Board", ["$rootScope", function($rootScope) {
	var module = {};
	
	module.createSchedule = function() {
		$rootScope.$broadcast("create-schedule");
	};
	
	return module;
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