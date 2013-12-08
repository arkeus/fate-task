Task::Application.routes.draw do
	root "boards#index"
	post "/create", to: "boards#create", as: :create_board
	post "/load", to: "boards#load", as: :load_board
	
	scope ":board" do
		root "boards#show", as: :board
		resources :schedules, except: [:new, :edit] do
			resources :tasks, except: [:new, :edit]
		end
	end
end
