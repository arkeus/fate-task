class BoardsController < ApplicationController
	def index; end
	
	def show
		@board = Board.where(name: params[:board]).first
		unless @board
			flash[:error] = "Board with name #{params[:board]} does not exist";
			redirect_to root_path and return
		end
	end
	
	def create
		raise "A board with that name already exists" if Board.exists?(name: post_params[:name])
		@board = Board.create!(post_params)
		redirect_to board_path(board: @board.name)
	rescue => e
		flash[:error] = "Could not create board: #{e.message}"
		redirect_to root_path and return
	end
	
	private
	
	def post_params
		params.permit(:name)
	end
end
