const canvas = document.getElementById('cv');
const ctx = canvas.getContext('2d');

const parts = {
  body: 6,
  head: 6,
  acc:  6
};

const state = {
  body: 0,
  head: 0,
  acc:  0
};

let isGacha = false;

/* ===== 画像ロード ===== */
const images = {};
Object.keys(parts).forEach(part=>{
  images[part] = [];
  for(let i=0;i<parts[part];i++){
    const img = new Image();
    img.src = `images/${part}${i}.png`;
    images[part].push(img);
  }
});

/* ===== 描画（完全レイヤー合成） ===== */
function draw(){
  ctx.clearRect(0,0,512,512);
  Object.keys(parts).forEach(part=>{
    const img = images[part][state[part]];
    if(img && img.complete){
      ctx.drawImage(img,0,0,512,512);
    }
  });
}

/* ===== UI構築 ===== */
const panel = document.getElementById('panel');

function buildUI(){
  Object.keys(parts).forEach(part=>{
    const group = document.createElement('div');
    group.className = 'group';

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = part.toUpperCase();

    const row = document.createElement('div');
    row.className = 'row';

    const left = document.createElement('div');
    left.className = 'arrow';
    left.textContent = '◀';

    const right = document.createElement('div');
    right.className = 'arrow';
    right.textContent = '▶';

    const track = document.createElement('div');
    track.className = 'track';
    track.dataset.part = part;

    for(let i=0;i<parts[part];i++){
      const item = document.createElement('div');
      item.className = 'item';
      item.textContent = (i+1).toString().padStart(2,'0');
      if(i===0) item.classList.add('active');

      item.onclick = ()=>{
        if(isGacha) return;
        state[part] = i;
        update(track,part);
        draw();
      };
      track.appendChild(item);
    }

    left.onclick = ()=>step(part,-1);
    right.onclick = ()=>step(part,1);

    row.append(left,track,right);
    group.append(label,row);
    panel.appendChild(group);
  });

  const rand = document.createElement('button');
  rand.textContent = 'RANDOM';
  rand.onclick = gacha;
  panel.appendChild(rand);

  const dl = document.createElement('button');
  dl.textContent = 'DOWNLOAD';
  dl.onclick = ()=>{
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'icon.png';
    a.click();
  };
  panel.appendChild(dl);
}

/* ===== 中央化 ===== */
function update(track,part){
  [...track.children].forEach((el,i)=>{
    el.classList.toggle('active',i===state[part]);
  });
  track.children[state[part]].scrollIntoView({
    behavior:'smooth',
    inline:'center'
  });
}

/* ===== 切替 ===== */
function step(part,dir){
  state[part]=(state[part]+dir+parts[part])%parts[part];
  const track=document.querySelector(`.track[data-part="${part}"]`);
  update(track,part);
  draw();
}

/* ===== ガチャ ===== */
async function gacha(){
  if(isGacha) return;
  isGacha = true;

  for(const part of Object.keys(parts)){
    const spins = 12 + Math.floor(Math.random()*8);
    for(let i=0;i<spins;i++){
      step(part,1);
      await new Promise(r=>setTimeout(r,30+i*4));
    }
  }

  isGacha = false;
}

/* ===== 起動 ===== */
buildUI();
draw();
