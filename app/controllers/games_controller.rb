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

    # 今日のランキング
    today = Time.zone.today
    @today_records = GameRecord.where(created_at: today.beginning_of_day..today.end_of_day)
                               .order(score: :desc).limit(10)

    # 週間ランキング（今週の月曜〜日曜）
    week_start = Time.zone.today.beginning_of_week
    week_end   = Time.zone.today.end_of_week
    @week_records = GameRecord.where(created_at: week_start.beginning_of_day..week_end.end_of_day)
                              .order(score: :desc).limit(10)

    @category = params[:category]
    @score    = params[:score]
  end
end
