class GamesController < ApplicationController
  protect_from_forgery with: :null_session  # JSからのPOSTを受けるため

  def play
  end

  def finish
    # params[:score] からスコアを受け取り保存
    GameRecord.create(score: params[:score])
    redirect_to result_path
  end

  def result
    @records = GameRecord.order(score: :desc).limit(10)
  end
end
