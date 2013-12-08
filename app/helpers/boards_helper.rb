module BoardsHelper
	def days_of_week
		["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	end
	
	def days_of_week_abbr
		days_of_week.map { |day| [day, day.first] }
	end
	
	def start_of_week_options
		{ "Start Of Week" => Array(0..6).map { |index| [days_of_week[index], index] } }
	end
	
	def main_attributes
		attributes = { "ng-app" => "task" }
		attributes['ng-controller'] = content_for :ng_controller if content_for?(:ng_controller)
		attributes
	end
end
