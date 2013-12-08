class TasksController < ApplicationController
	around_action :render_errors
	before_action :set_schedule, only: [:index]
	before_action :set_task, only: [:show, :update, :destroy]
	layout false
	
	def index
		render json: @schedule.schedule_tasks
	end
	
	private
	
	def set_schedule
		@schedule = Schedule.where(id: post_params[:schedule_id]).first
		raise "Unknown schedule" unless @schedule
	end
	
	def set_task
		@task = ScheduleTask.where(id: post_params[:task_id]).first
		raise "Unknown task" unless @task
	end
	
	def post_params
		params.permit(:board, :schedule_id, :task_id, task: [:name, :schedule_id])
	end
end
