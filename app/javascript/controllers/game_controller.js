import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "field",
    "timer",
    "mushroomCount", "mushroomScore",
    "bambooCount", "bambooScore",
    "catCount", "catScore",
    "totalCount", "totalScore"
  ]

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

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--
      this.timerTarget.textContent = this.timeLeft

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval)
        this.isGameOver = true
        this.timerTarget.textContent = 0

        // ⏰ 時間切れのときだけサーバーにスコア送信
        fetch("/finish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: this.total })
        }).then(() => {
          // 結果ページへ遷移
          window.location.href = "/result"
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
      img.src = "/assets/mushroom.png" // Railsがコンパイル後に配信
    } else if (type === "bamboo") {
      img.src = "/assets/bamboo.png"
    } else {
      img.src = "/assets/cat.png"
    }

    img.className = "absolute cursor-pointer w-12 h-12" // Tailwindで大きさ指定
    img.style.top = `${Math.random() * 90}%`
    img.style.left = `${Math.random() * 90}%`

    img.addEventListener("click", () => this.collectItem(type, img))

    this.fieldTarget.appendChild(img)

    // 一定時間後に消える
    setTimeout(() => div.remove(), 2000)
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
}