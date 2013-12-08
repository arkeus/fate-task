class CreateScheduleTasks < ActiveRecord::Migration
  def change
    create_table :schedule_tasks do |t|
    	t.integer :schedule_id
			t.string :name
			t.text :data
      t.timestamps
      
      t.index :schedule_id
    end
  end
end
