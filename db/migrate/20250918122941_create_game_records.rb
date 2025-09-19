class CreateGameRecords < ActiveRecord::Migration[7.2]
  def change
    create_table :game_records do |t|
      t.integer :score

      t.timestamps
    end
  end
end
