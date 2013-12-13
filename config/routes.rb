Task::Application.routes.draw do
	root "boards#index"
	post "/create", to: "boards#create", as: :create_board
	post "/load", to: "boards#load", as: :load_board
	
	scope ":board_name" do
		root "boards#show", as: :board
		put "/edit", to: "boards#edit", as: :edit_board
		
		resources :schedules, except: [:new, :edit] do
			resources :tasks, except: [:new, :edit] do
				member do
					put "complete"
					put "uncomplete"
				end
			end
		end
	end
end
