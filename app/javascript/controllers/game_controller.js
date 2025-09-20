import { Controller } from "@hotwired/stimulus"
import { post } from '@rails/request.js'

export default class extends Controller {
  static targets = [
    "field",
    "timer",
    "mushroomCount", "mushroomScore",
    "bambooCount", "bambooScore",
    "catCount", "catScore",
    "totalCount", "totalScore"
  ]

  static values = {
    mushroomPath: String,
    bambooPath: String,
    catPath: String
  }

  connect() {
    this.timeLeft = 15
    this.isGameOver = false

    // スコア
    this.mushroom = { count: 0, score: 0 }
    this.bamboo = { count: 0, score: 0 }
    this.cat = { count: 0, score: 0 }
    this.total = { count: 0, score: 0 }

    // タイマー開始
    this.startTimer()
    // 出現ループ開始
    this.spawnLoop()
  }

  getAssetPath(filename) {
    // Railsのasset_pathで生成されたパスを使用
    if (filename === "mushroom.png") {
      return this.mushroomPathValue
    } else if (filename === "bamboo.png") {
      return this.bambooPathValue
    } else if (filename === "cat.png") {
      return this.catPathValue
    }
    return `/assets/${filename}` // フォールバック
  }

  isMobile() {
    // 画面幅とタッチデバイスで判定
    return window.innerWidth <= 768 || 'ontouchstart' in window
  }

  // メモリリークの防止
  disconnect() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval)
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--
      this.timerTarget.textContent = this.timeLeft

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval)
        this.isGameOver = true
        this.timerTarget.textContent = 0

        const category = this.getResultCategory()

        // ⏰ 時間切れのときだけサーバーにスコア送信
        post("/finish", {
          body: {
            score: this.total.score,
            category: category
          }
        }).then(() => {
          // 2秒待ってから結果ページへ遷移
          setTimeout(() => {
            window.location.href = `/result?category=${encodeURIComponent(category)}&score=${this.total.score}`
          }, 2000)
        })
      }
    }, 1000)
  }

  spawnLoop() {
    this.spawnInterval = setInterval(() => {
      if (this.isGameOver) return
      this.spawnItem()
    }, 400)
  }

  spawnItem() {
    const itemTypes = ["mushroom", "bamboo", "cat"]
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)]

    // img要素を生成
    const img = document.createElement("img")
    if (type === "mushroom") {
      img.src = this.getAssetPath("mushroom.png")
    } else if (type === "bamboo") {
      img.src = this.getAssetPath("bamboo.png")
    } else {
      img.src = this.getAssetPath("cat.png")
    }

    img.className = "absolute cursor-pointer w-8 h-8 lg:w-12 lgh-12" // Tailwindで大きさ指定
    img.style.top = `${Math.random() * 90}%`
    img.style.left = `${Math.random() * 90}%`

    img.addEventListener("click", () => this.collectItem(type, img))

    this.fieldTarget.appendChild(img)

    // 一定時間後に消える（スマホは早めに消える）
    const removeDelay = this.isMobile() ? 600 : 2000
    setTimeout(() => img.remove(), removeDelay)
  }

  collectItem(type, element) {
    if (this.isGameOver) return // ← 時間切れなら無効
    element.remove()

    if (type === "mushroom") {
      this.mushroom.count++
      this.mushroom.score += 15
      this.mushroomCountTarget.textContent = this.mushroom.count
      this.mushroomScoreTarget.textContent = this.mushroom.score
    } else if (type === "bamboo") {
      this.bamboo.count++
      this.bamboo.score += 15
      this.bambooCountTarget.textContent = this.bamboo.count
      this.bambooScoreTarget.textContent = this.bamboo.score
    } else if (type === "cat") {
      this.cat.count++
      this.cat.score += 28
      this.catCountTarget.textContent = this.cat.count
      this.catScoreTarget.textContent = this.cat.score

      // 🐱 タッチで残り時間を2秒減らす
      this.timeLeft = Math.max(0, this.timeLeft - 2)
      this.timerTarget.textContent = this.timeLeft

      if (this.timeLeft <= 0) {
        this.isGameOver = true
      }
    }

    // 合計も更新
    this.total.count++
    this.total.score = this.mushroom.score + this.bamboo.score + this.cat.score
    this.totalCountTarget.textContent = this.total.count
    this.totalScoreTarget.textContent = this.total.score
  }

  getResultCategory() {
    const { mushroom, bamboo, cat, total } = this

    if (total.score >= 230) {
      return "秋の支配者 🍠"
    } else if (mushroom.count > bamboo.count && mushroom.score >= 100) {
      return "きのこマスター 🍄"
    } else if (bamboo.count > mushroom.count && bamboo.score >= 100) {
      return "たけのこ名人 🎋"
    } else if (cat.count >= 3) {
      return "ねこ様第一主義 🐱"
    } else if (mushroom.count >= 2 && bamboo.count >= 2 && cat.count >= 2) {
      return "バランス王 👑"
    } else {
      return "ゆったりお散歩 🚶"
    }
  }
}