class SchedulesController < ApplicationController
	#around_action :redirect_errors
	
	def list
		@board = Board.where(name: post_params[:board]).first
		raise "Unknown board" unless @board
		render json: @board.schedules
	end
	
	def show
		@board = Board.where(name: post_params[:board]).first
		raise "Unknown board" unless @board
		@schedule = Schedule.where(board_id: @board.id, id: post_params[:schedule_id]).first
		raise "Unknown schedule" unless @schedule
		render json: @schedule
	end
	
	def create
		@schedule = Schedule.new(params.require(:name, :board_id))
		@schedule.save
		render json: @schedule
	end
	
	private
	
	def post_params
		params.permit(:board, :board_id, :name, :schedule_id)
	end
end
