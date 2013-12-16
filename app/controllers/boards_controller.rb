class BoardsController < ApplicationController
	around_action :redirect_errors, only: [:show]
	around_action :render_errors, only: [:edit]
	before_action :set_board, only: [:show, :edit]
	
	def index; end
	def show; end
	
	def edit
		@board.time_zone = post_params[:board][:time_zone]
		@board.save!
		render nothing: true, status: 200
	end
	
	def create
		raise "A board with that name already exists" if Board.exists?(name: post_params[:name])
		@board = Board.create!(post_params)
		redirect_to board_path(board_name: @board.name)
	rescue => e
		flash[:error] = "Could not create board: #{e.message}"
		redirect_to root_path and return
	end
	
	def load
		raise "A board with that name does not exist" unless Board.exists?(name: post_params[:name])
		redirect_to board_path(board_name: post_params[:name])
	rescue => e
		flash[:error] = "Could not load board: #{e.message}"
		redirect_to root_path and return
	end
	
	private
	
	def set_board
		board_name = post_params[:board_name]
		@board = Board.where(name: board_name).first
		raise "Board with name #{board_name} does not exist" unless @board
	end
	
	def post_params
		params.permit(:board_name, :name, board: [:name, :time_zone])
	end
end
