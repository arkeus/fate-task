class SchedulesController < ApplicationController
	around_action :render_errors
	before_action :set_board, only: [:index, :create]
	before_action :set_schedule, only: [:show, :update, :destroy]
	layout false
	
	def index
		render json: @board.schedules.includes(:schedule_tasks)
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
		@schedule.name = post_params[:schedule][:name]
		@schedule.save!
		render nothing: true, status: 200
	end
	
	def destroy
		@schedule.destroy!
		render nothing: true, status: 200
	end
	
	private
	
	def set_board
		@board = Board.includes(:schedules).where(name: post_params[:board_name]).first
		raise "Unknown board" unless @board
	end
	
	def set_schedule
		@schedule = Schedule.where(id: post_params[:id]).first
		raise "Unknown schedule" unless @schedule
	end
	
	def post_params
		params.permit(:board_name, :schedule_id, :id, schedule: [:name, :schedule_type, { daily_days: [] }, :weekly_start, :board])
	end
end
