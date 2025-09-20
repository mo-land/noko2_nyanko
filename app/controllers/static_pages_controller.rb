class StaticPagesController < ApplicationController
  def top
    # OGP画像の動的設定（カテゴリに応じて切り替え）
    set_dynamic_ogp_image
  end

  private

  # OGP画像を動的に設定するメソッド
  def set_dynamic_ogp_image
    case params[:from]
    when "autumn_god"
      @url = "https://res.cloudinary.com/dyafcag5y/image/upload/v1758354467/otrp4sxko3kkc8akkdzx.png"
    when "kinoko"
      @url = "https://res.cloudinary.com/dyafcag5y/image/upload/v1758354416/otq4eaqk34tmwffrpygi.png"
    when "takenoko"
      @url = "https://res.cloudinary.com/dyafcag5y/image/upload/v1758354468/yu7hlfxxzzqu04tu3a8m.png"
    when "nekosama"
      @url = "https://res.cloudinary.com/dyafcag5y/image/upload/v1758354428/vvjzu7vlwkmvhq5zwp1f.png"
    when "balance"
      @url = "https://res.cloudinary.com/dyafcag5y/image/upload/v1758354468/h1fi4sspv4xsmnpm6tiq.png"
    when "walk"
      @url = "https://res.cloudinary.com/dyafcag5y/image/upload/v1758354469/a3mkqct5nnr5rhcl6u4f.png"
    else
      # デフォルト（直接アクセスやその他）
      @url = "https://res.cloudinary.com/dyafcag5y/image/upload/v1758357387/nnu8puxyejip4rxqgj2w.png"
    end

    set_meta_tags(og: { image: @url }, twitter: { image: @url })
  end
end
