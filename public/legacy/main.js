/* ── NEURAL ELECTRONICS BACKGROUND ── */
(function(){
  const c = document.getElementById('hero-canvas');
  const ctx = c.getContext('2d');
  let W, H, nodes = [], edges = [], pulses = [];

  function resize(){
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
    buildNetwork();
  }

  function buildNetwork(){
    /* mobile: use coarser grid and fewer pulses */
    const isMobile = W < 769;
    nodes = []; edges = []; pulses = [];

    /* grid-based placement — ensures even spread across entire canvas */
    const cols = Math.floor(W / (isMobile ? 160 : 110));
    const rows = Math.floor(H / (isMobile ? 160 : 110));
    const cellW = W / cols;
    const cellH = H / rows;

    for(let col = 0; col < cols; col++){
      for(let row = 0; row < rows; row++){
        /* jitter within cell so it doesn't look like a rigid grid */
        const jx = cellW * 0.15 + Math.random() * cellW * 0.7;
        const jy = cellH * 0.15 + Math.random() * cellH * 0.7;
        const x = col * cellW + jx;
        const y = row * cellH + jy;
        const type = Math.random();
        nodes.push({
          x, y,
          r: type > 0.85 ? 5 : type > 0.6 ? 3 : 2,
          type: type > 0.85 ? 'ic' : type > 0.6 ? 'via' : 'junction',
          glow: 0,
          glowDecay: 0.025 + Math.random() * 0.025
        });
        /* occasionally add a second node in the cell for denser areas */
        if(Math.random() > 0.55){
          const x2 = col * cellW + cellW * 0.15 + Math.random() * cellW * 0.7;
          const y2 = row * cellH + cellH * 0.15 + Math.random() * cellH * 0.7;
          const type2 = Math.random();
          nodes.push({
            x: x2, y: y2,
            r: type2 > 0.85 ? 5 : type2 > 0.6 ? 3 : 2,
            type: type2 > 0.85 ? 'ic' : type2 > 0.6 ? 'via' : 'junction',
            glow: 0,
            glowDecay: 0.025 + Math.random() * 0.025
          });
        }
      }
    }

    /* connect nodes — shorter max distance keeps connections local & balanced */
    const maxDist = Math.min(cellW, cellH) * 2.8;
    for(let i = 0; i < nodes.length; i++){
      const connections = [];
      for(let j = i+1; j < nodes.length; j++){
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < maxDist) connections.push({j, dist});
      }
      connections.sort((a,b) => a.dist - b.dist);
      const maxConn = 2 + Math.floor(Math.random() * 3);
      connections.slice(0, maxConn).forEach(({j}) => {
        edges.push({from: i, to: j});
      });
    }

    /* seed initial pulses spread across canvas — one per grid region */
    const seedCount = Math.floor(cols * rows * (isMobile ? 0.25 : 0.35));
    for(let i = 0; i < seedCount; i++) spawnPulse();
  }

  function spawnPulse(){
    if(edges.length === 0) return;
    const edge = edges[Math.floor(Math.random() * edges.length)];
    pulses.push({
      edge,
      t: Math.random(),          /* 0-1 progress along edge */
      speed: 0.004 + Math.random() * 0.012,
      size: 2.5 + Math.random() * 2.5,
      brightness: 0.7 + Math.random() * 0.3,
      trail: []
    });
  }

  function lerp(a, b, t){ return a + (b - a) * t; }

  /* draw a PCB-style routed line (L-shaped, axis aligned) */
  function drawRoute(ctx, x1, y1, x2, y2, alpha, lineW){
    const mx = x1 + (x2 - x1) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    /* elbow routing — horizontal then vertical */
    if(Math.abs(x2-x1) > Math.abs(y2-y1)){
      ctx.lineTo(mx, y1);
      ctx.lineTo(mx, y2);
    } else {
      ctx.lineTo(x1, lerp(y1,y2,0.5));
      ctx.lineTo(x2, lerp(y1,y2,0.5));
    }
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(0,229,122,${alpha})`;
    ctx.lineWidth = lineW;
    ctx.stroke();
  }

  /* get position along a routed edge at t (0-1) */
  function routePos(n1, n2, t){
    const x1=n1.x, y1=n1.y, x2=n2.x, y2=n2.y;
    const mx = x1 + (x2-x1)*0.5;
    let pts;
    if(Math.abs(x2-x1) > Math.abs(y2-y1)){
      pts = [[x1,y1],[mx,y1],[mx,y2],[x2,y2]];
    } else {
      const my = y1+(y2-y1)*0.5;
      pts = [[x1,y1],[x1,my],[x2,my],[x2,y2]];
    }
    /* distribute t evenly across 3 segments */
    const seg = Math.min(Math.floor(t * 3), 2);
    const st  = (t * 3) - seg;
    const p1  = pts[seg], p2 = pts[seg+1];
    return [p1[0]+(p2[0]-p1[0])*st, p1[1]+(p2[1]-p1[1])*st];
  }

  function draw(){
    ctx.clearRect(0, 0, W, H);

    /* draw traces */
    edges.forEach(({from, to}) => {
      const n1 = nodes[from], n2 = nodes[to];
      drawRoute(ctx, n1.x, n1.y, n2.x, n2.y, 0.08, 0.8);
    });

    /* draw nodes */
    nodes.forEach(n => {
      const baseAlpha = n.type === 'ic' ? 0.5 : n.type === 'via' ? 0.4 : 0.25;
      const glowAlpha = baseAlpha + n.glow * 0.8;

      if(n.type === 'ic'){
        /* draw small IC rectangle */
        const s = 7;
        ctx.strokeStyle = `rgba(0,229,122,${glowAlpha})`;
        ctx.lineWidth = 0.9;
        ctx.strokeRect(n.x - s, n.y - s/2, s*2, s);
        /* pins */
        for(let p = 0; p < 3; p++){
          ctx.beginPath();
          ctx.moveTo(n.x - s + p*(s*2/2.5) + 2, n.y - s/2);
          ctx.lineTo(n.x - s + p*(s*2/2.5) + 2, n.y - s/2 - 4);
          ctx.strokeStyle = `rgba(0,229,122,${glowAlpha * 0.7})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      } else if(n.type === 'via'){
        /* via ring */
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 2, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(0,229,122,${glowAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r - 0.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,229,122,${glowAlpha * 0.6})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,229,122,${glowAlpha})`;
        ctx.fill();
      }

      /* glow halo when signal arrives */
      if(n.glow > 0.1){
        ctx.beginPath();
        ctx.arc(n.x, n.y, (n.r + 6) * (1 + n.glow * 0.5), 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,229,122,${n.glow * 0.12})`;
        ctx.fill();
        n.glow = Math.max(0, n.glow - n.glowDecay);
      }
    });

    /* draw pulses */
    pulses.forEach(p => {
      const n1 = nodes[p.edge.from], n2 = nodes[p.edge.to];
      const [px, py] = routePos(n1, n2, p.t);

      /* trail */
      const trailLen = 8;
      for(let i = 0; i < trailLen; i++){
        const tt = Math.max(0, p.t - i * 0.025);
        const [tx, ty] = routePos(n1, n2, tt);
        const alpha = p.brightness * (1 - i/trailLen) * 0.6;
        const size  = p.size * (1 - i/trailLen) * 0.7;
        ctx.beginPath();
        ctx.arc(tx, ty, size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,229,122,${alpha})`;
        ctx.fill();
      }

      /* head */
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(180,255,220,${p.brightness})`;
      ctx.fill();

      /* outer glow ring */
      ctx.beginPath();
      ctx.arc(px, py, p.size * 2.2, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,229,122,${p.brightness * 0.15})`;
      ctx.fill();
    });
  }

  function update(){
    /* advance pulses */
    for(let i = pulses.length - 1; i >= 0; i--){
      const p = pulses[i];
      p.t += p.speed;
      if(p.t >= 1){
        /* light up destination node */
        const destNode = nodes[p.edge.to];
        destNode.glow = 1.0;
        /* chain — spawn new pulse from destination */
        const outEdges = edges.filter(e => e.from === p.edge.to || e.to === p.edge.to);
        if(outEdges.length > 0 && Math.random() > 0.2){
          const next = outEdges[Math.floor(Math.random() * outEdges.length)];
          /* ensure direction is away from where we came */
          const newEdge = next.from === p.edge.to ? next : {from: next.to, to: next.from};
          pulses.push({
            edge: newEdge,
            t: 0,
            speed: 0.004 + Math.random() * 0.012,
            size: p.size * (0.8 + Math.random() * 0.4),
            brightness: p.brightness * (0.85 + Math.random() * 0.2),
            trail: []
          });
          /* sometimes fork into two signals */
          if(Math.random() > 0.5 && outEdges.length > 1){
            const next2 = outEdges[Math.floor(Math.random() * outEdges.length)];
            const newEdge2 = next2.from === p.edge.to ? next2 : {from: next2.to, to: next2.from};
            pulses.push({
              edge: newEdge2,
              t: 0,
              speed: 0.004 + Math.random() * 0.01,
              size: p.size * 0.7,
              brightness: p.brightness * 0.7,
              trail: []
            });
          }
        }
        pulses.splice(i, 1);
      }
    }
    /* keep pulse count healthy — higher count for fuller coverage */
    const minP = W < 769 ? 12 : 30;
    const maxP = W < 769 ? 50 : 140;
    while(pulses.length < minP) spawnPulse();
    while(pulses.length > maxP) pulses.splice(0, 1);
  }

  let animRunning = false;
  function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  loop();

  /* parallax */
  window.addEventListener('scroll', () => {
    c.style.transform = 'translateY(' + (window.scrollY * 0.12) + 'px)';
  }, {passive: true});
})();

/* ── THREE.JS helper: make renderer for a canvas ── */
function makeScene(canvasId){
  const canvas=document.getElementById(canvasId);
  if(!canvas)return null;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0x000000,0);
  const W=canvas.clientWidth||360,H=canvas.clientHeight||340;
  renderer.setSize(W,H,false);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  camera.position.set(0,0,5);
  scene.add(new THREE.AmbientLight(0x00e57a,0.4));
  const dl=new THREE.DirectionalLight(0x00e57a,1);dl.position.set(3,3,3);scene.add(dl);
  return{renderer,scene,camera,canvas};
}

const wMat=()=>new THREE.LineBasicMaterial({color:0x00e57a,transparent:true,opacity:0.75});

/* ── DRONE GLB LOADER ── */
(function(){
  const canvas = document.getElementById('drone-canvas');
  if(!canvas) return;

  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x111111, 1);
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2.2;

  function resize(){
    const W = canvas.clientWidth, H = canvas.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
  camera.position.set(0, 0.8, 5.5);
  camera.lookAt(0, 0, 0);

  /* lighting */
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(4, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xaaddff, 1.2);
  fill.position.set(-4, 2, -3);
  scene.add(fill);
  const bottom = new THREE.DirectionalLight(0xffffff, 0.6);
  bottom.position.set(0, -4, 0);
  scene.add(bottom);
  const rim = new THREE.PointLight(0x00e57a, 2.0, 10);
  rim.position.set(0, -1, 2.5);
  scene.add(rim);

  /* state */
  let isDragging = false;
  let prevX = 0, prevY = 0;
  let rotX = 0, rotY = 0;
  let velX = 0, velY = 0;
  let autoRot = true;
  let lastInteract = 0;
  const REALIGN_DELAY = 3000;

  function startDrag(x, y){ isDragging=true; prevX=x; prevY=y; autoRot=false; lastInteract=Date.now(); velX=0; velY=0; }
  function endDrag(){ isDragging=false; lastInteract=Date.now(); }
  function moveDrag(x, y){
    if(!isDragging) return;
    const dx = x - prevX, dy = y - prevY;
    velY = dx * 0.008; velX = dy * 0.006;
    rotY += velY; rotX += velX;
    rotX = Math.max(-1.0, Math.min(1.0, rotX));
    prevX=x; prevY=y;
  }

  canvas.addEventListener('mousedown', e=>startDrag(e.clientX, e.clientY));
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('mousemove', e=>moveDrag(e.clientX, e.clientY));
  canvas.addEventListener('touchstart', e=>startDrag(e.touches[0].clientX, e.touches[0].clientY), {passive:true});
  window.addEventListener('touchend', endDrag);
  window.addEventListener('touchmove', e=>moveDrag(e.touches[0].clientX, e.touches[0].clientY), {passive:true});

  let model = null, t = 0;

  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
  const loader = new THREE.GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load('./drone.glb',
    (gltf) => {
      model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const centre = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      /* centre geometry exactly */
      model.position.set(-centre.x * (1.6/maxDim), -centre.y * (1.6/maxDim), -centre.z * (1.6/maxDim));
      model.scale.setScalar(1.6 / maxDim);
      const pivot = new THREE.Group();
      pivot.add(model);
      scene.add(pivot);
      model = pivot;
      const loading = document.getElementById('drone-loading');
      if(loading) loading.style.display = 'none';
    },
    (xhr) => {
      if(xhr.total){
        const pct = Math.round(xhr.loaded/xhr.total*100);
        const el = document.querySelector('#drone-loading span');
        if(el) el.textContent = 'Loading model... ' + pct + '%';
      }
    },
    (err) => {
      console.warn('GLB error:', err);
      const loading = document.getElementById('drone-loading');
      if(loading) loading.style.display = 'none';
    }
  );

  resize();
  window.addEventListener('resize', resize);

  (function loop(){
    requestAnimationFrame(loop);
    t += 0.012;

    if(model){
      const now = Date.now();
      const timeSince = now - lastInteract;

      if(isDragging){
        /* while dragging — direct control */
        model.rotation.y = rotY;
        model.rotation.x = rotX;
      } else if(!autoRot && timeSince > REALIGN_DELAY){
        /* realign phase — smoothly return to front and resume oscillation */
        rotX += (0 - rotX) * 0.04;
        rotY += (0 - rotY) * 0.04;
        if(Math.abs(rotX) < 0.01 && Math.abs(rotY) < 0.01){
          rotX = 0; rotY = 0; autoRot = true;
        }
        model.rotation.x = rotX;
        model.rotation.y = rotY;
      } else if(autoRot){
        /* oscillate gently around front — ±30 degrees */
        rotY = Math.sin(t * 0.4) * 0.52;
        model.rotation.y = rotY;
        model.rotation.x = rotX;
      } else {
        /* momentum coast after release */
        velX *= 0.92; velY *= 0.92;
        rotX += velX; rotY += velY;
        rotX = Math.max(-1.0, Math.min(1.0, rotX));
        model.rotation.x = rotX;
        model.rotation.y = rotY;
      }

      /* gentle hover bob */
      model.position.y = Math.sin(t * 0.6) * 0.06;
      rim.position.x = Math.sin(t * 0.5) * 2;
    }

    renderer.render(scene, camera);
  })();
})();

/* ── ROBOT ARM ── */
(function(){
  const s=makeScene('robot-canvas');if(!s)return;
  const{renderer,scene,camera}=s;
  camera.position.set(2,2,5);
  const g=new THREE.Group();
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.55,0.65,0.18,12)),wMat()));
  const l1=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.28,1.1,0.28)),wMat());l1.position.set(0,0.64,0);g.add(l1);
  const j1=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.SphereGeometry(0.2,8,8)),wMat());j1.position.set(0,1.2,0);g.add(j1);
  const l2=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.22,0.9,0.22)),wMat());l2.position.set(0.35,1.65,0);l2.rotation.z=-0.5;g.add(l2);
  const j2=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.SphereGeometry(0.16,8,8)),wMat());j2.position.set(0.75,2.05,0);g.add(j2);
  const ef=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.35,0.1,0.28)),wMat());ef.position.set(0.98,2.18,0);g.add(ef);
  [[-0.12,0],[0.12,0]].forEach(([ex])=>{const fg=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.98+ex,2.18,0),new THREE.Vector3(0.98+ex,2.0,0)]);g.add(new THREE.Line(fg,wMat()));});
  scene.add(g);
  let t=0;
  (function loop(){requestAnimationFrame(loop);t+=0.01;g.rotation.y=t*0.5;j2.rotation.z=Math.sin(t*0.7)*0.3;renderer.render(scene,camera);})();
})();

/* ── CHIP ── */
(function(){
  const s=makeScene('chip-canvas');if(!s)return;
  const{renderer,scene,camera}=s;
  const g=new THREE.Group();
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2,2,0.28)),wMat()));
  for(let side=0;side<4;side++){const angle=side*Math.PI/2;for(let pin=-2;pin<=2;pin++){const px=Math.cos(angle)*1.18-Math.sin(angle)*(pin*0.28),py=Math.sin(angle)*1.18+Math.cos(angle)*(pin*0.28),px2=Math.cos(angle)*1.5-Math.sin(angle)*(pin*0.28),py2=Math.sin(angle)*1.5+Math.cos(angle)*(pin*0.28);const pg=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(px,py,0),new THREE.Vector3(px2,py2,0)]);g.add(new THREE.Line(pg,wMat()));}}
  for(let i=0;i<3;i++){for(let j=0;j<3;j++){const dot=new THREE.Mesh(new THREE.CircleGeometry(0.07,8),new THREE.MeshBasicMaterial({color:0x00e57a,transparent:true,opacity:0.45,side:THREE.DoubleSide}));dot.position.set(-0.5+i*0.5,-0.5+j*0.5,0.15);g.add(dot);}}
  scene.add(g);
  let t=0;
  (function loop(){requestAnimationFrame(loop);t+=0.01;g.rotation.y=t*0.55;g.rotation.x=Math.sin(t*0.35)*0.22;renderer.render(scene,camera);})();
})();

/* ── OSCILLOSCOPE ── */
(function(){
  const s=makeScene('oscope-canvas');if(!s)return;
  const{renderer,scene,camera}=s;
  camera.position.set(0,0,6);
  const g=new THREE.Group();
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3,2,0.18)),wMat()));
  const screenMat=new THREE.MeshBasicMaterial({color:0x001a0a,transparent:true,opacity:0.8,side:THREE.DoubleSide});
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(2.5,1.6),screenMat);screen.position.z=0.1;g.add(screen);
  const gridM=new THREE.LineBasicMaterial({color:0x00e57a,transparent:true,opacity:0.2});
  for(let i=-1;i<=1;i++){const h=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.1,i*0.5,0.12),new THREE.Vector3(1.1,i*0.5,0.12)]);g.add(new THREE.Line(h,gridM));const v=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i*0.7,-0.75,0.12),new THREE.Vector3(i*0.7,0.75,0.12)]);g.add(new THREE.Line(v,gridM));}
  let wavePhase=0;
  const wavePts=[];for(let x=-1.1;x<=1.1;x+=0.04)wavePts.push(new THREE.Vector3(x,0,0.13));
  const waveGeo=new THREE.BufferGeometry().setFromPoints(wavePts);
  const waveLine=new THREE.Line(waveGeo,new THREE.LineBasicMaterial({color:0x00e57a,transparent:true,opacity:0.95}));
  g.add(waveLine);
  [[- 0.9,-1.15],[0,-1.15],[0.9,-1.15]].forEach(([kx,ky])=>{const k=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.1,0.1,0.12,10)),wMat());k.position.set(kx,ky,0.1);k.rotation.x=Math.PI/2;g.add(k);});
  scene.add(g);
  let t=0;
  (function loop(){requestAnimationFrame(loop);t+=0.015;wavePhase+=0.08;
    const pos=waveGeo.attributes.position;
    for(let i=0;i<pos.count;i++){const x=pos.getX(i);pos.setY(i,Math.sin(x*3+wavePhase)*0.45+Math.sin(x*7+wavePhase*1.3)*0.1);}
    pos.needsUpdate=true;
    g.rotation.y=Math.sin(t*0.3)*0.25;
    renderer.render(scene,camera);})();
})();

/* ── PROGRESS BAR + NAV FILL (merged scroll) ── */
(function(){var prog=document.getElementById('prog'),nav=document.getElementById('nav');window.addEventListener('scroll',function(){var sy=window.scrollY;prog.style.width=Math.min(sy/(document.body.scrollHeight-window.innerHeight)*100,100)+'%';nav.classList.toggle('filled',sy>80);},{passive:true});})();

/* ── ACTIVE NAV ── */
/* Active nav + smooth scroll with nav offset */
document.querySelectorAll('section[id]').forEach(sec=>{
  new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));const m=document.querySelector('.nav-links a[href="#'+e.target.id+'"]');if(m)m.classList.add('active');}});},{threshold:0.2}).observe(sec);
});

/* Nav link click — close mobile menu */
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click', function(){
    document.getElementById('hamburger')?.classList.remove('open');
    document.getElementById('nav-links')?.classList.remove('open');
    document.body.style.overflow='';
  });
});

/* ── HERO ENTRANCE ── */
window.addEventListener('load',()=>{
  [['ey',0],['hn',200],['hs',400],['hb',600],['sc',850]].forEach(([id,d])=>{
    setTimeout(()=>{const el=document.getElementById(id);if(el){el.style.opacity='1';el.style.transform='translateY(0)';}},d);
  });
});

/* ── SCROLL REVEAL ── */
document.querySelectorAll('.rv,.rl,.rr').forEach(el=>{
  new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');});},{threshold:0.12}).observe(el);
});

/* ── INTERACTIONS: COUNT · GLOW · SPOTLIGHT · MAGNETIC ── */
(function(){
  /* count-up */
  function countUp(el){var n=+el.dataset.n,d=+el.dataset.d||0,suf=el.dataset.suffix||'',s=performance.now();(function f(now){var p=Math.min((now-s)/1867,1),e=1-Math.pow(1-p,3);el.textContent=(n*e).toFixed(d)+suf;if(p<1)requestAnimationFrame(f);})(s);}
  document.querySelectorAll('.stat-n[data-n]').forEach(function(el){var ok=false;new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!ok){ok=true;setTimeout(function(){countUp(el);},300);}});},{threshold:0.5}).observe(el.closest('.stat')||el);});
  /* section cursor glow */
  document.querySelectorAll('section[data-glow]').forEach(function(s){var g=document.createElement('div');g.className='cglow';s.insertBefore(g,s.firstChild);s.addEventListener('mousemove',function(ev){var r=s.getBoundingClientRect();g.style.transform='translate('+(ev.clientX-r.left)+'px,'+(ev.clientY-r.top)+'px)';g.style.opacity='1';},{passive:true});s.addEventListener('mouseleave',function(){g.style.opacity='0';});});
  /* card inner spotlight */
  document.querySelectorAll('.exp-item > div,.skill-card,.contact-link').forEach(function(el){el.classList.add('spot');el.addEventListener('mousemove',function(ev){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(ev.clientX-r.left)+'px');el.style.setProperty('--my',(ev.clientY-r.top)+'px');},{passive:true});});
  /* magnetic buttons */
  document.querySelectorAll('.btn-p,.btn-o').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translateY(-2px) translate('+((e.clientX-r.left-r.width/2)*0.28)+'px,'+((e.clientY-r.top-r.height/2)*0.28)+'px)';});b.addEventListener('mouseleave',function(){b.style.transform='';});});
})();

/* ── HAMBURGER MENU ── */
(function(){
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if(!btn || !links) return;

  function isMobile(){ return window.innerWidth <= 768; }

  function updateVisibility(){
    btn.style.display = isMobile() ? 'flex' : 'none';
    if(!isMobile()) links.classList.remove('open');
  }

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  /* close on link click — handled by nav override below */

  window.addEventListener('resize', updateVisibility);
  updateVisibility();
})();

/* ── MOBILE: reduce neural canvas intensity ── */
(function(){
  if(window.innerWidth > 768) return;
  /* patch pulse limits for mobile — already rendered, so intercept via override */
  window.__mobileOptimised = true;
})();

/* ══════════════════════════════════════
   ROBOT EASTER EGG v3 — slow walk, mischievous smile, sprint away, dramatic revival
══════════════════════════════════════ */
window.addEventListener('load', function(){
  var stage  = document.getElementById('robot-stage');
  var canvas = document.getElementById('robot-walk-canvas');
  if(!stage || !canvas) return;
  var ctx = canvas.getContext('2d');
  if(!ctx) return;

  var animating = false;
  var onHero = true;
  var timer = null;

  function resizeCanvas(){
    canvas.width  = stage.offsetWidth  || window.innerWidth;
    canvas.height = stage.offsetHeight || 120;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  window.addEventListener('scroll', function(){
    onHero = window.scrollY < window.innerHeight * 0.5;
    if(!onHero && timer){ clearTimeout(timer); timer = null; }
    if(onHero && !animating) resetTimer();
  }, {passive:true});

  ['mousemove','keydown','touchstart','click'].forEach(function(ev){
    window.addEventListener(ev, resetTimer, {passive:true});
  });

  function resetTimer(){
    if(animating) return;
    if(timer) clearTimeout(timer);
    timer = setTimeout(runEasterEgg, 15000);
  }
  resetTimer();

  /* ── DRAW ROBOT ── */
  function drawRobot(x, y, sc, dir, legP, armP, eyeOn, smile, smileW){
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc * dir, sc);
    ctx.strokeStyle = '#00e57a';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    /* body */
    ctx.strokeRect(-11,-30,22,20);

    /* head */
    ctx.strokeRect(-8,-47,16,15);

    /* eyes */
    if(smile){
      /* mischievous — squinted eyes (curved down) */
      ctx.beginPath();
      ctx.arc(-3,-39,3,Math.PI+0.4,Math.PI*2-0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(3,-39,3,Math.PI+0.4,Math.PI*2-0.4);
      ctx.stroke();
    } else {
      ctx.fillStyle = eyeOn ? '#00ff8c' : 'rgba(0,229,122,0.25)';
      ctx.beginPath(); ctx.arc(-3,-39,2.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(3,-39,2.5,0,Math.PI*2); ctx.fill();
    }

    /* smile mouth */
    if(smile){
      var sw = smileW || 0.5;
      ctx.beginPath();
      ctx.arc(0,-33, 5*sw, 0.1, Math.PI-0.1);
      ctx.stroke();
      /* evil eyebrows */
      ctx.beginPath();
      ctx.moveTo(-6,-43); ctx.lineTo(-2,-41);
      ctx.moveTo(6,-43);  ctx.lineTo(2,-41);
      ctx.stroke();
    }

    /* antenna */
    ctx.beginPath();
    ctx.moveTo(0,-47); ctx.lineTo(0,-54);
    ctx.moveTo(0,-54); ctx.lineTo(-3,-57);
    ctx.moveTo(0,-54); ctx.lineTo(3,-57);
    ctx.stroke();

    /* arms */
    var a = Math.sin(armP)*14;
    ctx.beginPath();
    ctx.moveTo(-11,-25); ctx.lineTo(-20,-25+a); ctx.lineTo(-24,-18+a);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(11,-25); ctx.lineTo(20,-25-a); ctx.lineTo(24,-18-a);
    ctx.stroke();

    /* legs */
    var l1=Math.sin(legP)*10, l2=Math.sin(legP+Math.PI)*10;
    ctx.beginPath();
    ctx.moveTo(-6,-10); ctx.lineTo(-6+l1,5); ctx.lineTo(-6+l1,14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6,-10); ctx.lineTo(6+l2,5); ctx.lineTo(6+l2,14);
    ctx.stroke();
    /* feet */
    ctx.beginPath();
    ctx.moveTo(-6+l1,14); ctx.lineTo(-12+l1,14);
    ctx.moveTo(6+l2,14);  ctx.lineTo(12+l2,14);
    ctx.stroke();

    ctx.restore();
  }

  /* ── DRAW CABLE ── */
  function drawCable(x, y, plugged, alpha){
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#00e57a';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.bezierCurveTo(x+20,y-12,x+32,y+8,x+48,y);
    ctx.stroke();
    ctx.strokeRect(x+48,y-5,12,10);
    ctx.beginPath();
    ctx.moveTo(x+60,y-3); ctx.lineTo(x+65,y-3);
    ctx.moveTo(x+60,y+3); ctx.lineTo(x+65,y+3);
    ctx.stroke();
    if(plugged){
      ctx.strokeRect(x+65,y-7,10,14);
      ctx.fillStyle='#00e57a';
      ctx.beginPath(); ctx.arc(x+70,y,2,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  /* ── KILL HERO ── */
  function killHero(){
    var c = document.querySelector('#home .hero-content');
    if(!c) return;
    c.style.transition = 'opacity 0.15s';
    c.style.opacity = '0';
    c.style.filter = 'brightness(0)';
    /* also dim the PCB canvas */
    var pcb = document.getElementById('hero-canvas');
    if(pcb){ pcb.style.transition='opacity 0.2s'; pcb.style.opacity='0'; }
  }

  /* ── DRAMATIC REVIVAL — part by part ── */
  function reviveHero(){
    var hero = document.querySelector('#home .hero-content');
    if(!hero) return;

    var eyebrow = document.getElementById('ey');
    var name    = document.getElementById('hn');
    var sub     = document.getElementById('hs');
    var btns    = document.getElementById('hb');
    var pcb     = document.getElementById('hero-canvas');

    /* First — make sure hero wrapper is visible with no filter */
    hero.style.transition = 'none';
    hero.style.filter = 'none';
    hero.style.opacity = '1';

    /* hide all children first */
    [eyebrow, name, sub, btns].forEach(function(el){
      if(el){ el.style.transition='none'; el.style.opacity='0'; el.style.filter='none'; }
    });

    /* PCB flickers back */
    setTimeout(function(){
      if(pcb){ pcb.style.transition='opacity 0.3s'; pcb.style.opacity='0.08'; }
    }, 100);
    setTimeout(function(){
      if(pcb){ pcb.style.opacity='0.02'; }
    }, 400);
    setTimeout(function(){
      if(pcb){ pcb.style.opacity='0.42'; }
    }, 650);

    /* eyebrow sparks on */
    setTimeout(function(){
      if(eyebrow){
        eyebrow.style.filter = 'brightness(4)';
        eyebrow.style.opacity = '1';
        setTimeout(function(){
          eyebrow.style.transition = 'filter 0.4s';
          eyebrow.style.filter = 'brightness(1)';
        }, 120);
      }
    }, 500);

    /* name glitches on */
    setTimeout(function(){
      if(name){
        name.style.filter = 'blur(6px) brightness(3)';
        name.style.opacity = '0.2';
        setTimeout(function(){ name.style.opacity='0.9'; name.style.filter='blur(2px) brightness(1.5)'; }, 80);
        setTimeout(function(){ name.style.opacity='0.4'; name.style.filter='blur(4px)'; }, 160);
        setTimeout(function(){ name.style.opacity='1'; name.style.filter='none'; name.style.transition='all 0.25s'; }, 260);
      }
    }, 750);

    /* tagline fades in */
    setTimeout(function(){
      if(sub){ sub.style.transition='opacity 0.5s'; sub.style.opacity='1'; }
    }, 1100);

    /* buttons fade in last */
    setTimeout(function(){
      if(btns){ btns.style.transition='opacity 0.5s'; btns.style.opacity='1'; }
    }, 1400);
  }

  /* ── MAIN SEQUENCE ── */
  function runEasterEgg(){
    if(animating || !onHero) return;
    animating = true;
    resizeCanvas();
    stage.style.display = 'block';

    var W = canvas.width;
    var groundY = canvas.height - 18;
    var robotX = -70;
    var stopX  = W * 0.48;
    var frame  = 0;
    var phase  = 'walk-in';
    var phaseF = 0;
    var smileAmt = 0;
    var plugAlpha = 0;
    var plugged = true;
    var speed  = 1.2; /* slow walk */

    function tick(){
      resizeCanvas();
      ctx.clearRect(0,0,canvas.width,canvas.height);
      var leg = frame * 0.12; /* slow leg swing */
      var arm = frame * 0.12;

      if(phase==='walk-in'){
        robotX += speed;
        drawRobot(robotX, groundY, 1.1, 1, leg, arm, true, false, 0);
        if(robotX >= stopX){ phase='look'; phaseF=0; }

      } else if(phase==='look'){
        /* robot stops, slowly turns to face us, smile grows */
        smileAmt = Math.min(1, phaseF / 40);
        var eyeFlicker = Math.sin(phaseF*0.3) > 0;
        drawRobot(robotX, groundY, 1.1, 1, 0, Math.sin(phaseF*0.05)*0.3, eyeFlicker, smileAmt > 0.3, smileAmt);
        phaseF++;
        if(phaseF > 80){ phase='grab'; phaseF=0; }

      } else if(phase==='grab'){
        /* reaches for plug */
        drawRobot(robotX, groundY, 1.1, 1, 0, phaseF*0.06, true, true, 1);
        plugAlpha = Math.min(1, phaseF/12);
        plugged = phaseF < 30;
        drawCable(robotX-35, groundY-42, plugged, plugAlpha);
        if(phaseF===30){
          killHero();
          /* screen dies — robot looks at us and grins wider */
        }
        phaseF++;
        if(phaseF > 50){ phase='gloat'; phaseF=0; }

      } else if(phase==='gloat'){
        /* robot faces us, big smile, bounces */
        var bounce = Math.abs(Math.sin(phaseF*0.25))*5;
        drawRobot(robotX, groundY-bounce, 1.2, 1, 0, Math.sin(phaseF*0.2)*0.5, true, true, 1);
        drawCable(robotX-35, groundY-42, false, Math.max(0,1-phaseF/20));
        phaseF++;
        if(phaseF > 55){ phase='sprint'; phaseF=0; speed=8; }

      } else if(phase==='sprint'){
        /* SPRINT off screen — legs going wild */
        robotX += speed;
        speed = Math.min(22, speed + 0.6);
        drawRobot(robotX, groundY, 1.1, 1, leg*3, arm*3, true, true, 0.8);
        if(robotX > W+100){
          /* robot gone — wait 2 seconds then revive */
          stage.style.display='none';
          ctx.clearRect(0,0,canvas.width,canvas.height);
          setTimeout(function(){
            reviveHero();
            setTimeout(function(){
              animating = false;
              resetTimer();
            }, 2500);
          }, 2000);
          return;
        }
      }

      frame++;
      requestAnimationFrame(tick);
    }
    tick();
  }
});


/* ── PROJECT FILTER ── */
function filterProjects(cat){
  /* update tab styles */
  document.querySelectorAll('.proj-tab').forEach(function(t){
    t.classList.toggle('active', t.dataset.cat === cat);
  });
  /* show/hide cards */
  document.querySelectorAll('.proj-card').forEach(function(c){
    if(cat === 'all' || c.dataset.cat === cat){
      c.classList.remove('hidden');
    } else {
      c.classList.add('hidden');
    }
  });
}


/* ── QUAD IAM3D 2024 GLB LOADER ── */
(function(){
  var canvas = document.getElementById('quad-canvas');
  if(!canvas) return;

  var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0x111111,1);
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2.2;

  function resize(){
    var W=canvas.clientWidth, H=canvas.clientHeight;
    renderer.setSize(W,H,false);
    camera.aspect=W/H;
    camera.updateProjectionMatrix();
  }

  var scene  = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  var camera = new THREE.PerspectiveCamera(42,1,0.01,100);
  camera.position.set(0,1.8,3.2);
  camera.lookAt(0,0,0);

  scene.add(new THREE.AmbientLight(0xffffff,2.5));
  var key=new THREE.DirectionalLight(0xffffff,4.5); key.position.set(4,5,4); scene.add(key);
  var fill=new THREE.DirectionalLight(0xffffff,2.5); fill.position.set(-4,2,-3); scene.add(fill);
  var top=new THREE.DirectionalLight(0xffffff,2.0); top.position.set(0,8,0); scene.add(top);
  var front=new THREE.DirectionalLight(0xffffff,2.0); front.position.set(0,0,6); scene.add(front);
  var rim=new THREE.PointLight(0x00e57a,1.0,10); rim.position.set(0,-1,2.5); scene.add(rim);

  var isDragging=false, prevX=0, prevY=0, rotX=0, rotY=0, velX=0, velY=0, autoRot=true, lastInteract=0;
  canvas.addEventListener('mousedown',function(e){isDragging=true;prevX=e.clientX;prevY=e.clientY;autoRot=false;lastInteract=Date.now();velX=0;velY=0;});
  window.addEventListener('mouseup',function(){isDragging=false;lastInteract=Date.now();});
  window.addEventListener('mousemove',function(e){if(!isDragging)return;var dx=e.clientX-prevX,dy=e.clientY-prevY;velY=dx*0.008;velX=dy*0.006;rotY+=velY;rotX+=velX;rotX=Math.max(-1,Math.min(1,rotX));prevX=e.clientX;prevY=e.clientY;});
  canvas.addEventListener('touchstart',function(e){isDragging=true;prevX=e.touches[0].clientX;prevY=e.touches[0].clientY;autoRot=false;lastInteract=Date.now();},{passive:true});
  window.addEventListener('touchend',function(){isDragging=false;lastInteract=Date.now();});
  window.addEventListener('touchmove',function(e){if(!isDragging)return;rotY+=(e.touches[0].clientX-prevX)*0.008;rotX+=(e.touches[0].clientY-prevY)*0.006;prevX=e.touches[0].clientX;prevY=e.touches[0].clientY;},{passive:true});

  var model=null, t=0;
  var dracoLoader=new THREE.DRACOLoader();
  dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
  var loader=new THREE.GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  /* Lazy load — only when card is visible */
  var quadLoaded = false;
  var quadObs = new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting && !quadLoaded){
      quadLoaded = true;
      quadObs.disconnect();
      loader.load('./quad_25.glb',
        function(gltf){
          model=gltf.scene;
          var box=new THREE.Box3().setFromObject(model);
          var centre=box.getCenter(new THREE.Vector3());
          var size=box.getSize(new THREE.Vector3());
          var maxDim=Math.max(size.x,size.y,size.z);
          model.position.set(-centre.x*(2.2/maxDim),-centre.y*(2.2/maxDim),-centre.z*(2.2/maxDim));
          model.scale.setScalar(2.2/maxDim);
          var pivot=new THREE.Group(); pivot.add(model); scene.add(pivot); model=pivot;
          var loading=document.getElementById('quad-loading');
          if(loading) loading.style.display='none';
        },
        function(xhr){ if(xhr.total){var el=document.querySelector('#quad-loading span');if(el)el.textContent='Loading... '+Math.round(xhr.loaded/xhr.total*100)+'%';}},
        function(err){ console.warn('quad GLB error:',err); var loading=document.getElementById('quad-loading'); if(loading)loading.style.display='none'; }
      );
    }
  },{threshold:0.1});
  quadObs.observe(canvas);

  resize();
  window.addEventListener('resize',resize);

  (function loop(){
    requestAnimationFrame(loop); t+=0.012;
    if(model){
      var now=Date.now(), timeSince=now-lastInteract;
      if(isDragging){ model.rotation.y=rotY; model.rotation.x=rotX; }
      else if(!autoRot && timeSince>3000){ rotX+=(-0.28-rotX)*0.04; rotY+=(0-rotY)*0.04; if(Math.abs(rotX+0.28)<0.01&&Math.abs(rotY)<0.01){rotX=-0.28;rotY=0;autoRot=true;} model.rotation.x=rotX; model.rotation.y=rotY; }
      else if(autoRot){ rotY=Math.sin(t*0.4)*0.52; model.rotation.y=rotY; model.rotation.x=-0.28; }
      else { velX*=0.92;velY*=0.92;rotX+=velX;rotY+=velY; rotX=Math.max(-1,Math.min(1,rotX)); model.rotation.x=rotX; model.rotation.y=rotY; }
      model.position.y=Math.sin(t*0.6)*0.06;
      rim.position.x=Math.sin(t*0.5)*2;
    }
    renderer.render(scene,camera);
  })();
})();


/* ── AGNI BOX WING GLB LOADER ── */
window.addEventListener('load', function(){
  var canvas = document.getElementById('agni-canvas');
  if(!canvas) return;
  var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0x0d1520,1);
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2.2;

  function resize(){ var W=canvas.clientWidth,H=canvas.clientHeight; renderer.setSize(W,H,false); camera.aspect=W/H; camera.updateProjectionMatrix(); }

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1520);
  var camera = new THREE.PerspectiveCamera(32,1,0.01,100);
  camera.position.set(0,1.2,2.8);
  camera.lookAt(0,0,0);

  scene.add(new THREE.AmbientLight(0xffffff,3.0));
  var key=new THREE.DirectionalLight(0xffffff,5.0); key.position.set(4,5,4); scene.add(key);
  var fill=new THREE.DirectionalLight(0xffffff,3.0); fill.position.set(-4,2,-3); scene.add(fill);
  var top=new THREE.DirectionalLight(0xffffff,2.5); top.position.set(0,8,0); scene.add(top);
  var front=new THREE.DirectionalLight(0xffffff,2.5); front.position.set(0,0,6); scene.add(front);
  var rim=new THREE.PointLight(0x00e57a,1.2,10); rim.position.set(0,-1,2.5); scene.add(rim);

  var isDragging=false,prevX=0,prevY=0,rotX=-0.25,rotY=0,velX=0,velY=0,autoRot=true,lastInteract=0,t=0,model=null;

  canvas.addEventListener('mousedown',function(e){isDragging=true;prevX=e.clientX;prevY=e.clientY;autoRot=false;lastInteract=Date.now();velX=0;velY=0;});
  window.addEventListener('mouseup',function(){isDragging=false;lastInteract=Date.now();});
  window.addEventListener('mousemove',function(e){if(!isDragging)return;var dx=e.clientX-prevX,dy=e.clientY-prevY;velY=dx*0.008;velX=dy*0.006;rotY+=velY;rotX+=velX;rotX=Math.max(-1,Math.min(1,rotX));prevX=e.clientX;prevY=e.clientY;});
  canvas.addEventListener('touchstart',function(e){isDragging=true;prevX=e.touches[0].clientX;prevY=e.touches[0].clientY;autoRot=false;lastInteract=Date.now();},{passive:true});
  window.addEventListener('touchend',function(){isDragging=false;lastInteract=Date.now();});
  window.addEventListener('touchmove',function(e){if(!isDragging)return;rotY+=(e.touches[0].clientX-prevX)*0.008;rotX+=(e.touches[0].clientY-prevY)*0.006;prevX=e.touches[0].clientX;prevY=e.touches[0].clientY;},{passive:true});

  var dracoLoader=new THREE.DRACOLoader();
  dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
  var loader=new THREE.GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  /* Lazy load — only when card is visible */
  var agniLoaded = false;
  var agniObs = new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting && !agniLoaded){
      agniLoaded = true;
      agniObs.disconnect();
      loader.load('./agni.glb',
        function(gltf){
          model=gltf.scene;
          var box=new THREE.Box3().setFromObject(model);
          var centre=box.getCenter(new THREE.Vector3());
          var size=box.getSize(new THREE.Vector3());
          var maxDim=Math.max(size.x,size.y,size.z);
          model.position.set(-centre.x*(2.8/maxDim),-centre.y*(2.8/maxDim),-centre.z*(2.8/maxDim));
          model.scale.setScalar(2.8/maxDim);
          var pivot=new THREE.Group(); pivot.add(model); scene.add(pivot); model=pivot;
          var loading=document.getElementById('agni-loading');
          if(loading) loading.style.display='none';
        },
        function(xhr){ if(xhr.total){var el=document.querySelector('#agni-loading span');if(el)el.textContent='Loading... '+Math.round(xhr.loaded/xhr.total*100)+'%';}},
        function(err){ console.warn('AGNI GLB error:',err); var l=document.getElementById('agni-loading'); if(l)l.style.display='none'; }
      );
    }
  },{threshold:0.1});
  agniObs.observe(canvas);

  resize();
  window.addEventListener('resize',resize);

  (function loop(){
    requestAnimationFrame(loop); t+=0.012;
    if(model){
      var now=Date.now(),timeSince=now-lastInteract;
      if(isDragging){ model.rotation.y=rotY; model.rotation.x=rotX; }
      else if(!autoRot && timeSince>3000){ rotX+=(-0.25-rotX)*0.04; rotY+=(0-rotY)*0.04; if(Math.abs(rotX+0.25)<0.01&&Math.abs(rotY)<0.01){rotX=-0.25;rotY=0;autoRot=true;} model.rotation.x=rotX; model.rotation.y=rotY; }
      else if(autoRot){ rotY=Math.sin(t*0.4)*0.52; model.rotation.y=rotY; model.rotation.x=rotX; }
      else { velX*=0.92;velY*=0.92;rotX+=velX;rotY+=velY; model.rotation.x=rotX; model.rotation.y=rotY; }
      model.position.y=Math.sin(t*0.5)*0.04;
    }
    renderer.render(scene,camera);
  })();
});


/* ── ROBOT PHOTO SLIDESHOW ── */
(function(){
  var slides = [
    {id:'rslide-0', label:'VX-01 · Standing'},
    {id:'rslide-1', label:'VX-01 · Internals'},
    {id:'rslide-2', label:'VX-01 · Presentation'},
    {id:'rslide-3', label:'RViz · Navigation'},
    {id:'rslide-4', label:'Custom PCB'},
    {id:'rslide-5', label:'Hexapod · Assembly'},
    {id:'rslide-6', label:'Leg · Servo Detail'}
  ];
  var current = 0;
  var label = document.getElementById('rs-caption');
  var dots = document.querySelectorAll('.rsdot');

  function goTo(i){
    document.getElementById(slides[current].id).style.opacity='0';
    dots[current].style.background='rgba(255,255,255,0.3)';
    current = i;
    document.getElementById(slides[current].id).style.opacity='1';
    dots[current].style.background='var(--g)';
    var cap=document.getElementById('rs-caption'); if(cap) cap.textContent = slides[current].label;
  }

  dots.forEach(function(dot){
    dot.addEventListener('click', function(){ goTo(parseInt(this.dataset.i)); clearInterval(timer); });
  });

  var timer = setInterval(function(){ goTo((current+1) % slides.length); }, 3500);
})();


/* ── LIGHTBOX ── */
(function(){
  var slides = [];
  var current = 0;
  var lb, lbImg, lbLabel, lbCounter, lbDots;

  window.addEventListener('load', function(){
    lb       = document.getElementById('lightbox');
    lbImg    = document.getElementById('lb-img');
    lbLabel  = document.getElementById('lb-label');
    lbCounter= document.getElementById('lb-counter');
    lbDots   = document.getElementById('lb-dots');
    if(!lb || !lbImg || !lbDots) return;

    /* collect all slide images */
    var imgs = document.querySelectorAll('[id^="rslide-"]');
    imgs.forEach(function(img){
      slides.push({src: img.src, label: img.alt});
    });
    buildDots();

    /* click backdrop to close */
    lb.addEventListener('click', function(e){
      if(e.target === lb) closeLightbox();
    });

    /* keyboard navigation */
    document.addEventListener('keydown', function(e){
      if(!lb || lb.style.display === 'none') return;
      if(e.key === 'ArrowRight') lbNav(1);
      if(e.key === 'ArrowLeft')  lbNav(-1);
      if(e.key === 'Escape')     closeLightbox();
    });
  });

  function buildDots(){
    lbDots.innerHTML = '';
    slides.forEach(function(_, i){
      var d = document.createElement('div');
      d.style.cssText = 'width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.3);cursor:pointer;transition:background 0.2s';
      d.onclick = function(){ showSlide(i); };
      lbDots.appendChild(d);
    });
  }

  function updateDots(){
    var dots = lbDots.children;
    for(var i=0;i<dots.length;i++){
      dots[i].style.background = i===current ? 'var(--g)' : 'rgba(255,255,255,0.3)';
    }
  }

  function showSlide(i){
    current = (i + slides.length) % slides.length;
    lbImg.src = slides[current].src;
    lbLabel.textContent = slides[current].label;
    lbCounter.textContent = (current+1) + ' / ' + slides.length;
    updateDots();
  }

  window.openLightbox = function(i){
    showSlide(i);
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function(){
    lb.style.display = 'none';
    document.body.style.overflow = '';
  };

  window.lbNav = function(dir){
    showSlide(current + dir);
  };


})();

