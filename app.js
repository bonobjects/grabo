const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// --- 設定エリア：自分で修正しやすい場所 ---
const parts = {
  background: 4, 
  body: 5,
  face: 4,
  head: 6,
  limited: 2
};

// 描画の重なり順（後ろにあるものほど手前に描画される）
const order = ["background", "body", "face", "head", "limited"];
// ---------------------------------------

const state = { background: 0, body: 0, face: 0, head: 0, limited: 0 };
let randomCount = 0;

async function draw() {
  ctx.clearRect(0, 0, 512, 512);

  for (const part of order) {
    const img = new Image();
    img.src = `./images/${part}${state[part]}.png`;

    await new Promise(resolve => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 512, 512);
        resolve();
      };
      img.onerror = resolve; // 画像がない場合はエラーにせず次へ
    });
  }
}

// 初期実行
draw();

// メニュー項目のクリックイベント
document.querySelectorAll(".swipe").forEach(el => {
  el.addEventListener("click", () => {
    const part = el.dataset.part;
    state[part] = (state[part] + 1) % parts[part];
    draw();
  });
});

// ランダムボタン
document.getElementById("randomBtn").addEventListener("click", () => {
  if (randomCount < 5) {
    randomCount++;
    document.getElementById("count").innerText = randomCount;
  }

  // 各パーツの状態をランダムに変更
  Object.keys(parts).forEach(part => {
    state[part] = Math.floor(Math.random() * parts[part]);
  });
  draw();

  // 5回目でボーナスモードへ
  if (randomCount >= 5) {
    document.getElementById("controls").classList.add("bonus-mode");
  }
});

// ダウンロード機能
document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "icon.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});














