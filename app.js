const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ★ここをお手持ちの画像枚数に合わせて書き換えてください
const parts = {
  background: 3, 
  body: 2,
  head: 2,
  face: 2,
  accessory: 3
};

const order = ["background", "body", "head", "face", "accessory"];
const state = { background: 0, body: 0, head: 0, face: 0, accessory: 0 };
let randomCount = 0;

async function draw() {
  // 1. まずキャンバスを暗いグレーで塗る（キャンバスが存在するか確認するため）
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, 512, 512);

  // 2. 読み込み中である旨を画面に出す
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px Arial";
  ctx.fillText("Loading images...", 20, 40);

  for (const part of order) {
    const img = new Image();
    // パスを修正（./images/ に変更）
    const imagePath = `./images/${part}${state[part]}.png`;
    img.src = imagePath;

    await new Promise(resolve => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 512, 512);
        resolve();
      };
      img.onerror = () => {
        // 画像がない場合、画面にエラーを表示する
        ctx.fillStyle = "#ff0000";
        ctx.fillText(`Error: ${imagePath} not found`, 20, 70 + (order.indexOf(part) * 25));
        resolve();
      };
    });
  }
}

// 初期実行
draw();

// ボタン操作
document.querySelectorAll(".swipe").forEach(el => {
  el.addEventListener("click", () => {
    const part = el.dataset.part;
    state[part] = (state[part] + 1) % parts[part];
    draw();
  });
});

document.getElementById("randomBtn").addEventListener("click", () => {
  randomCount++;
  document.getElementById("count").innerText = randomCount;
  Object.keys(parts).forEach(part => {
    state[part] = Math.floor(Math.random() * parts[part]);
  });
  draw();
  if (randomCount >= 5) {
    document.getElementById("controls").classList.add("bonus-mode");
  }
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "icon.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
