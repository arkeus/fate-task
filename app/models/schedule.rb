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
			limit = 8
			time += 1.day until daily_days.include?(time.strftime("%A")) || (limit -= 1) <= 0
			until points.length >= NUM_DAILY_POINTS do
				points << { value: TimeUtil::day_number(time), display: time.mday.ordinalize, future: time.future? } if daily_days.include?(time.strftime("%A"))
				time -= 1.day
			end
		elsif schedule_type == "weekly"
			limit = 8
			time -= 1.day while time.wday != weekly_start && (limit -= 1) > 0
			raise "Could not find week start" unless limit > 0
			NUM_WEEKLY_POINTS.times do
				points << { value: TimeUtil::week_number(time), display: "#{time.mday.ordinalize} - #{(time + 6.days).mday.ordinalize}" }
				time -= 7.days
			end
		end
		points
	end
	
	def as_json(options = {})
		super(methods: [:points], include: {
			schedule_tasks: {
				except: [:created_at, :updated_at],
				methods: [:points],
			}
		}, except: [:created_at, :updated_at])
	end
end
