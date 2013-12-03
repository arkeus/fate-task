class CreateBoards < ActiveRecord::Migration
  def change
    create_table :boards do |t|
			t.string :name
      t.timestamps
      
      t.index :name, unique: true
    end
  end
end