const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 各カテゴリの画像枚数を指定（お手元の画像数に合わせて調整してください）
const parts = {
  background: 3, 
  body: 2,
  head: 2,
  face: 2,
  accessory: 3
};

const order = ["background", "body", "head", "face", "accessory"];

const state = {
  background: 0,
  body: 0,
  head: 0,
  face: 0,
  accessory: 0
};

let randomCount = 0;

async function draw() {
  ctx.clearRect(0, 0, 512, 512);

  for (const part of order) {
    const img = new Image();
    img.src = `images/${part}${state[part]}.png`;
    await new Promise(resolve => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 512, 512);
        resolve();
      };
      img.onerror = resolve; 
    });
  }
}

draw();

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
