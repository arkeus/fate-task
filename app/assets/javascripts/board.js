//
// APPLICATION
//
	
app.run(["$rootScope", "Board", function($rootScope, Board) {
	var REFRESH_RATE = 5 * 60 * 1000; // 5 minutes
	
	// Reload schedules repeatedly
	setInterval(function() {
		$rootScope.$apply(function() {
			Board.refresh();
		});
	}, REFRESH_RATE);
}]);

//
// CONTROLLERS
//

app.controller("BoardController", ["$scope", "Schedule", "Board", function($scope, Schedule, Board) {
	$scope.loading = true;
	$scope.schedules = null;
	$scope.error = null;
	
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
	
	$scope.openOptions = function() {
		Board.openOptions();
	};
	
	$scope.$on("refresh", function() {
		$scope.loadSchedules();
	});
	
	$scope.loadSchedules = function() {
		Schedule.query().$promise.then(function(schedules) {
			$scope.schedules = schedules;
			$scope.loading = false;
		}, function() {
			$scope.error = "Could not load schedules";
		});
	};
	
	$scope.loadSchedules();
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
	
	$scope.markTask = function() {
		var task_hash = this.task;
		var task = new Task(this.task);
		var value = this.point.value;
		var params = { schedule_id: task.schedule_id, id: task.id, value: value };
		if (task.points.indexOf(value) == -1) {
			task_hash.points.push(value);
			task.$complete(params);
		} else {
			task_hash.points.splice(task.points.indexOf(value), 1);
			task.$uncomplete(params);
		}
	};
}]);

app.controller("BoardOptionsModalController", ["$scope", "$http", "Board", "BoardOptions", function($scope, $http, Board, BoardOptions) {
	$scope.board_options = { name: board.name, time_zone: board.time_zone };
	$scope.state = null;
	$scope.error = null;
	
	$scope.submit = function() {
		var board = new BoardOptions($scope.board_options);
		board.$edit(function() {
			Board.refresh();
			$scope.cancel();
		}, function(error) {
			console.error(error);
			$scope.error = error['data']['error'];
		});
	};
	
	$scope.cancel = function() {
		$scope.state = null;
	};
	
	$scope.$on("open-options", function(message) {
		$scope.state = "modal";
	});
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
			$scope.cancel();
		}, function(error) {
			$scope.error = error['data']['error'];
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
	return $resource("/:board/schedules/:schedule_id/tasks/:id/:action", { board: board.name }, {
		update: { method: "PUT" },
		complete: { method: "PUT", params: { action: "complete" } },
		uncomplete: { method: "PUT", params: { action: "uncomplete" } }
	});
}]);

app.factory("BoardOptions", ["$rootScope", "$resource", function($rootScope, $resource) {
	return $resource("/:board/edit", { board: board.name }, {
		edit: { method: "PUT" }
	});
}]);

app.factory("Board", ["$rootScope", function($rootScope) {
	var module = {};
	
	module.createSchedule = function() {
		$rootScope.$broadcast("create-schedule");
	};
	
	module.openOptions = function() {
		$rootScope.$broadcast("open-options");
	};
	
	module.refresh = function() {
		$rootScope.$broadcast("refresh");
	};
	
	return module;
}]);

//
// DIRECTIVES
//

// none

//
// FILTERS
//

// none