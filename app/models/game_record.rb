class GameRecord < ApplicationRecord
  validates :score, presence: true, numericality: { only_integer: true }
end
