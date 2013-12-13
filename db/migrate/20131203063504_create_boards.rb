class CreateBoards < ActiveRecord::Migration
  def change
    create_table :boards do |t|
			t.string :name
			t.string :time_zone
      t.timestamps
      
      t.index :name, unique: true
    end
  end
end
