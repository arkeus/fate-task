class ScheduleTask < ActiveRecord::Base
	belongs_to :schedule
	before_save :before_save
	after_initialize :after_initialize
	validates :name, presence: true
	
	def before_save
		self.data = nil
	end
	
	def after_initialize
		self.data = nil
	end
	
	def as_json(options = {})
		puts "\n\n\n\nASKLJDALSKJDAKLSJD\n\n\n\n"
		super(except: [:created_at, :updated_at])
	end
end
