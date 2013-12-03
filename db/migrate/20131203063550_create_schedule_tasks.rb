class CreateScheduleTasks < ActiveRecord::Migration
  def change
    create_table :schedule_tasks do |t|
			t.string :name
			t.integer :schedule_id
			t.text :data
      t.timestamps
      
      t.index :schedule_id
    end
  end
end
