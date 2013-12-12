class TimeUtil
	SECS_PER_DAY = 1.day.seconds.to_i.freeze
	SECS_PER_WEEK = 1.week.seconds.to_i.freeze
	
	def self.day_number(time = Time.now)
		time.year * 10000 + time.month * 100 + time.day 
	end
	
	def self.week_number(time = Time.now)
		(time.to_i / SECS_PER_WEEK).floor
	end
end