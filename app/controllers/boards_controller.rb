class BoardsController < ApplicationController
	def index; end
	
	def show
		@board = Board.where(name: params[:board]).first
		unless @board
			flash[:error] = "Board with name #{params[:board]} does not exist";
			redirect_to root_path and return
		end
	end
end
