class GamesController < ApplicationController
  def play
  end

  def finish
    # params[:score] からスコアを受け取り保存
    GameRecord.create(score: params[:score])
    redirect_to ranking_path
  end

  def ranking
    @records = GameRecord.order(score: :desc).limit(10)
  end
end
