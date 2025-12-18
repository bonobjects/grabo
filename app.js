const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const parts = {
  body: 2,
  head: 0,
  face: 2,
  accessory: 3
};

const order = ["body", "head", "face", "accessory"];

const state = {
  body: 0,
  head: 0,
  face: 0,
  accessory: 0
};

function draw() {
  ctx.clearRect(0, 0, 512, 512);

  order.forEach(part => {
    const img = new Image();
    img.src = `images/${part}${state[part]}.png`;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 512, 512);
    };
  });
}

draw();

/* スワイプ（クリック簡易版） */
document.querySelectorAll(".swipe").forEach(el => {
  el.addEventListener("click", () => {
    const part = el.dataset.part;
    state[part] = (state[part] + 1) % parts[part];
    draw();
  });
});

/* ランダム */
document.getElementById("randomBtn").addEventListener("click", () => {
  Object.keys(parts).forEach(part => {
    state[part] = Math.floor(Math.random() * parts[part]);
  });
  draw();
});

/* ダウンロード */
document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "icon.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

