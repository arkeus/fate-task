module BoardsHelper
	def days_of_week
		["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	end
	
	def days_of_week_abbr
		days_of_week.map(&:first)
	end
	
	def start_of_week_options
		{ "Start Of Week" => days_of_week }
	end
end
