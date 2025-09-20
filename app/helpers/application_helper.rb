module ApplicationHelper
  def default_meta_tags(url: "https://res.cloudinary.com/dyafcag5y/image/upload/v1758357387/nnu8puxyejip4rxqgj2w.png")
    {
      site: "のこのこにゃんこ",
      title: "のこのこにゃんこ",
      reverse: true,
      charset: "utf-8",
      description: "「のこのこにゃんこ」は、にゃんこは正義という絶対的ルールのもと、きのこたけのこ狩りを楽しむゲームです。",
      canonical: request.original_url,
      separator: "|",
      og: {
        site_name: "のこのこにゃんこ",
        title: "のこのこにゃんこ",
        description: "「のこのこにゃんこ」は、にゃんこは正義という絶対的ルールのもと、きのこたけのこ狩りを楽しむゲームです。",
        type: "website",
        url: request.original_url,
        locale: "ja_JP"
      },
       twitter: {
        card: "summary_large_image",
        image: url
      }
    }
  end
end
