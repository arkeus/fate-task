//
// APPLICATION
//
	
app.run(["$rootScope", "$interval", "Board", function($rootScope, $interval, Board) {
	var REFRESH_RATE = 5 * 60 * 1000; // 5 minutes
	
	$rootScope.board = BOARD;
	
	// Reload schedules repeatedly
	$interval(function() {
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

app.controller("ScheduleController", ["$scope", "$timeout", "Task", "Board", function($scope, $timeout, Task, Board) {
	$scope.addTask = function(schedule_id) {
		var task = new Task({
			schedule_id: schedule_id,
			name: "Unnamed Task"
		});
		task.$save({ schedule_id: schedule_id }).then(function(task) {
			$scope.schedule.schedule_tasks.push(task);
			$timeout(function() {
				$("#task-" + task.id).click();
			});
		});
	};
	
	$scope.deleteTask = function(task_hash) {
		$scope.schedule.schedule_tasks.splice($scope.schedule.schedule_tasks.indexOf(task_hash), 1);
		var task = new Task(task_hash);
		task.$delete({ schedule_id: task.schedule_id, id: task.id }).then(function() {
			// Success
		}, function() {
			$scope.schedule.schedule_tasks.push(task_hash);
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
	$scope.state = null;
	$scope.error = null;
	$scope.previouslySelected = null;
	
	$scope.submit = function() {
		var board = new BoardOptions($scope.board);
		board.$edit(function() {
			Board.refresh();
			$scope.close();
		}, function(error) {
			$scope.error = error['data']['error'];
		});
	};
	
	$scope.cancel = function() {
		$scope.board.time_zone = $scope.previouslySelected;
		$scope.close();
	};
	
	$scope.close = function() {
		$scope.state = null;
	};
	
	$scope.$on("open-options", function(message) {
		$scope.state = "modal";
		$scope.previouslySelected = $scope.board.time_zone;
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
	return $resource("/:board/schedules/:id", { board: $rootScope.board.name }, {});
}]);

app.factory("Task", ["$rootScope", "$resource", function($rootScope, $resource) {
	return $resource("/:board/schedules/:schedule_id/tasks/:id/:action", { board: $rootScope.board.name }, {
		complete: { method: "PUT", params: { action: "complete" } },
		uncomplete: { method: "PUT", params: { action: "uncomplete" } }
	});
}]);

app.factory("BoardOptions", ["$rootScope", "$resource", function($rootScope, $resource) {
	return $resource("/:board/edit", { board: $rootScope.board.name }, {
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

app.directive("editable", ["$rootScope", "$http", function($rootScope, $http) {
	return {
		restrict: "A",
		template: "",
		link: function(scope, element, attrs) {
			var container = element.parent();
			var object = scope.editObject;
			var property = scope.editProperty;
		
			element.on("click", function(event) {
				var oldProperty = object[property];
				var editable = $("<input>").attr({ type: "text", value: object.name, placeholder: "Name" }).addClass("editable");
				element.removeClass("error").hide();
				container.append(editable).addClass("editing");
				
				editable.focus().on("blur", function(event) {
					editable.prop("disabled", true);
					container.removeClass("editing");
					var newProperty = editable.val();
					
					if (/^\s*$/.test(newProperty) || newProperty == oldProperty) {
						editable.remove();
						element.show();
						return;
					}
					
					var data = {};
					data[property] = object[property] = newProperty;
					
					$http.put(scope.editPath, data).then(function() {
						editable.remove();
						element.show();
					}, function() {
						object[property] = oldProperty;
						editable.remove();
						element.addClass("error").show();
					});
				}).on("keydown", function(event) {
					if (event.which == 13) {
						$(this).blur();
					} else if (event.which == 27) {
						editable.val(oldProperty);
						$(this).blur();
					}
				});
				
				console.log(scope.editObject[scope.editProperty]);
				console.log(scope.editPath);
			});
		},
		scope: {
			editObject: "=",
			editProperty: "@",
			editPath: "@",
		}
	};
}]);

//
// FILTERS
//

// none