class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
    	t.integer :board_id
			t.string :name
			t.string :schedule_type
			t.string :daily_days
			t.integer :weekly_start
      t.timestamps
      
      t.index :board_id
    end
  end
end
