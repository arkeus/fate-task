class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
			t.string :name
			t.integer :board_id
      t.timestamps
      
      t.index :board_id
    end
  end
end
