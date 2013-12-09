class ScheduleTask < ActiveRecord::Base
	belongs_to :schedule
	before_save :before_save
	after_initialize :after_initialize
	validates :name, presence: true
	
	HISTORY_SIZE = 20.freeze
	
	def before_save
		self.data = self.data.sort[-HISTORY_SIZE..data.size] if data.size > HISTORY_SIZE
		self.data = data.join(",")
	end
	
	def after_initialize
		self.data = build_points
	end
	
	def complete(value)
		self.data << value
	end
	
	def uncomplete(value)
		self.data.delete(value)
	end
	
	def as_json(options = {})
		super(except: [:created_at, :updated_at])
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
