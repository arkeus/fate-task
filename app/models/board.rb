class Board < ActiveRecord::Base
	has_many :schedules, dependent: :destroy
	validates :name, format: { with: /\A[a-z0-9-]+\z/, message: "Only lowercase letters, numbers, and dashes allowed in a name" }
	after_initialize :after_initialize
	
	def after_initialize
		self.time_zone = "Pacific Time (US & Canada)" unless time_zone
	end
end
