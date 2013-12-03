class SchedulesController < ApplicationController
	def list
		@board = Board.where(name: post_params[:board])
		render json: @board.schedules
	end
	
	def create
		@schedule = Schedule.new(params.require(:name, :board_id))
		@schedule.save
		render json: @schedule
	end
	
	private
	
	def post_params
		params.require(:board).permit(:board_id, :name)
	end
end