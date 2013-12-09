class ScheduleTask < ActiveRecord::Base
	belongs_to :schedule
	before_save :before_save
	after_initialize :after_initialize
	validates :name, presence: true
	
	attr_accessor :points
	
	def before_save
		self.data = data.join(",")
	end
	
	def after_initialize
		self.data = build_points
	end
	
	def complete
		
	end
	
	def uncomplete
		
	end
	
	def as_json(options = {})
		super(methods: [:points], except: [:created_at, :updated_at])
	end
	
	private
	
	def build_points
		points = []
		data_points = JSON.parse(data || "{}")
		schedule.points.each do |point|
			points << point['value'] if data_points.has_key?(point['value'])
		end
		points
	end
end
