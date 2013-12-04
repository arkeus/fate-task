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

app.factory("Tooltip", ["$rootScope", function($rootScope) {
	var module = {};
	
	module.show = function(item, element) {
		$rootScope.$broadcast("showTooltip", item, element);
	};
	
	module.hide = function() {
		$rootScope.$broadcast("hideTooltip");
	};
	
	return module;
}]);

//
// DIRECTIVES
//

app.directive("item", ["$timeout", "Tooltip", "ContextMenu", function($timeout, Tooltip, ContextMenu) {
	return {
		restrict: "E",
		controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
			
		}],
		template: "<div class=\"item\"><img></img></div>",
		replace: true,
		link: function(scope, element, attrs) {
			$(element).find("img")
			.attr("src", "images/" + scope.item.image_path)
			.end()
			.addClass(scope.item.type)
			.addClass(scope.item.subtype)
			.addClass(scope.item.rarity)
			.click(function() {
				scope.$apply(function() {
					scope.equip(scope.item);
				});
			}).hover(function() {
				scope.$apply(function() {
					Tooltip.show(scope.item, element);
				});
			}, function() {
				scope.$apply(function() {
					Tooltip.hide();
				});
			}).on("contextmenu", function(event) {
				ContextMenu.show(event, "item", scope.item);
			});
		}
	};
}]);

app.directive("tooltip", [function() {
	var WINDOW_PADDING = 20;
	var ITEM_PADDING = 4;
	
	return {
		restrict: "A",
		controller: ["$scope", function($scope) {
			$scope.item = null;
		}],
		link: function(scope, element, attrs) {
			scope.$on("showTooltip", function(event, item, target) {
				var position = $(target).offset();
				var left = position.left + $(target).outerWidth() + ITEM_PADDING;
				var top = position.top;
				var width = $(element).width();
				var height = $(element).height();
				var windowWidth = $(window).width();
				var windowHeight = $(window).height();
				
				if (left + width > windowWidth - WINDOW_PADDING) {
					left = left - ITEM_PADDING * 2 - 38 - width;
				}
				
				scope.item = item;
				$(element).css({
					left: left,
					top: top
				}).show();
			});
			
			scope.$on("hideTooltip", function(event) {
				$(element).hide();
			});
		}
	};
}]);

app.directive("contextMenu", [function() {
	return {
		restrict: "A",
		controller: ["$scope", function($scope) {
			
		}],
	};
}]);

//
// FILTERS
//

app.filter("displayEffect", function() {
	return function(item) {
		if (!item) {
			return;
		}
		if (item.type == "Weapon") {
			return "<div class='weapon effect'><div class='damage icon'></div> " + item.effect[0] + "</div>" +
			"<div class='weapon effect align-center'><div class='mdamage icon'></div> " + item.effect[1] + "</div>" +
			"<div class='weapon effect align-center'><div class='accuracy icon'></div> " + item.effect[2] + "</div>" +
			"<div class='weapon effect align-right'><div class='price icon'></div> " + item.price + "</div>";
		} else if (item.type == "Armor") {
			return "<div class='armor effect'><div class='armor icon'></div> " + item.effect + "</div>" +
			"<div class='armor effect align-right'><div class='price icon'></div> " + item.price + "</div>";
		} else {
			return "<div class='other effect align-right'><div class='price icon'></div> " + item.price + "</div>";
		}
	};
});