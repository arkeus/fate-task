class SchedulesController < ApplicationController
	around_action :render_errors
	before_action :set_board
	before_action :set_schedule, only: [:show, :update, :destroy]
	layout false
	
	def index
		render json: @board.schedules
	end
	
	def create
		@schedule = Schedule.new(post_params[:schedule].merge(board: @board))
		@schedule.save!
		render json: @schedule
	end
	
	def show
		render json: @schedule
	end
	
	def update
		# get rid of?
	end
	
	def destroy
		@schedule.destroy!
	end
	
	private
	
	def set_board
		@board = Board.where(name: post_params[:board]).first
		raise "Unknown board" unless @board
	end
	
	def set_schedule
		@schedule = Schedule.where(board_id: @board.id, id: post_params[:schedule_id]).first
		raise "Unknown schedule" unless @schedule
	end
	
	def post_params
		params.permit(:board, :board_id, :schedule_id, schedule: [:name, :schedule_type, { daily_days: [] }, :weekly_start, :board])
	end
end
