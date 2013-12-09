class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
  
  def redirect_errors
  	begin
  		yield
  	rescue => e
  		flash[:error] = e.message
  		redirect_to root_path
  	end
  end
  
  def render_errors
  	begin
  		yield
  	rescue => e
  		puts Rails.logger.error "#{e.message} #{e.backtrace.join("\n")}"
  		render json: { error: e.message }, status: 422
  	end
  end
end
