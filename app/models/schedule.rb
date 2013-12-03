class Schedule < ActiveRecord::Base
	has_many :schedule_tasks, dependent: :destroy
	belongs_to :board
end
