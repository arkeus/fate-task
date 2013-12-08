class Schedule < ActiveRecord::Base
	has_many :schedule_tasks, dependent: :destroy
	belongs_to :board
	before_save :before_save
	after_initialize :after_initialize
	validates :name, presence: true
	attr_accessor :points
	
	NUM_DAILY_POINTS = 8
	NUM_WEEKLY_POINTS = 4
	
	def before_save
		self.daily_days = daily_days.join(",") if daily_days.is_a?(Array)
		raise "daily_days cannot be blank" if daily_days.blank?
	end
	
	def after_initialize
		self.daily_days = daily_days.split(",") if daily_days.is_a?(String)
		self.points = generate_points
	end
	
	def generate_points
		points = []
		time = Time.now
		if schedule_type == "daily"
			NUM_DAILY_POINTS.times do
				points << { value: TimeUtil::day_number(time), display: time.mday.ordinalize }
				time -= 1.day
			end
		elsif schedule_type == "weekly"
			limit = 8
			time -= 1.day while time.wday != weekly_start && (limit -= 1) > 0
			raise "Could not find week start" unless limit > 0
			NUM_WEEKLY_POINTS.times do
				ntime = time - 7.days
				points << { value: TimeUtil::week_number(time), display: "#{ntime.mday.ordinalize} - #{time.mday.ordinalize}" }
				time = ntime
			end
		end
		points
	end
	
	def as_json(options = {})
		super(methods: [:points])
	end
end
