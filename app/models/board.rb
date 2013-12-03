class Board < ActiveRecord::Base
	has_many :schedules, dependent: :destroy
end
