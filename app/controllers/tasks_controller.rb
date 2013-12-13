class TasksController < ApplicationController
	around_action :render_errors
	before_action :set_schedule, only: [:index, :create]
	before_action :set_task, only: [:show, :update, :destroy, :complete, :uncomplete]
	layout false
	
	def index
		render json: @schedule.schedule_tasks
	end
	
	def create
		@task = ScheduleTask.new(post_params[:task].merge(schedule: @schedule))
		@task.save!
		render json: @task
	end
	
	def show
		render json: @task
	end
	
	def update
		puts @task.inspect
		puts post_params[:task][:name]
		@task.name = post_params[:task][:name]
		@task.save!
		render nothing: true, status: 200
	end
	
	def destroy
		@task.destroy!
		render nothing: true, status: 200
	end
	
	def complete
		value = params.require(:value).to_i
		@task.complete(value)
		@task.save!
		render nothing: true, status: 200
	end
	
	def uncomplete
		value = params.require(:value).to_i
		@task.uncomplete(value)
		@task.save!
		render nothing: true, status: 200
	end
	
	private
	
	def set_schedule
		@schedule = Schedule.where(id: post_params[:schedule_id]).first
		raise "Unknown schedule" unless @schedule
	end
	
	def set_task
		@task = ScheduleTask.where(id: post_params[:id]).first
		raise "Unknown task" unless @task
	end
	
	def post_params
		params.permit(:schedule_id, :task_id, :id, task: [:id, :name, :schedule_id])
	end
end
