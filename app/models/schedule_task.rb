class ScheduleTask < ActiveRecord::Base
	belongs_to :schedule
	before_save :before_save
	after_initialize :after_initialize
	validates :name, presence: true
	
	HISTORY_SIZE = 20.freeze
	
	attr_accessor :points
	
	def before_save
		self.points = points.sort[-HISTORY_SIZE..points.size] if points.size > HISTORY_SIZE
		self.data = points.join(",")
	end
	
	def after_initialize
		self.points = build_points
	end
	
	def complete(value)
		self.points << value
	end
	
	def uncomplete(value)
		self.points.delete(value)
	end
	
	def as_json(options = {})
		super(methods: [:points], except: [:created_at, :updated_at, :data])
	end
	
	private
	
	def build_points
		points = []
		data_points = Set.new((data || "").split(",").map(&:to_i))
		schedule.points.each do |point|
			points << point[:value] if data_points.include?(point[:value])
		end		
		points
	end
end
