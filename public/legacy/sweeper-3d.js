/*
 * Sweeper robot (19 Oct 2026) — the home-page easter egg, as a lit 3D model.
 * Original design: a chip-bodied robot on one wheel, an LED-screen face with pixel
 * eyes, an antenna light, and a probe-card brush whose needles are the bristles.
 * Built from three.js primitives and drawn in screen pixels (orthographic camera), so
 * main.js can place it exactly like the old 2D robot. It only renders while the
 * easter egg is playing.
 *
 * window.makeSweeper3D(stage) -> { render(x, groundY, scale, pose), resize(), clear() }
 * pose: { wheel, eyes:'open'|'blink'|'happy', look:-1..1, broom, bob, led:0..1, turn }
 */
window.makeSweeper3D = function (stage) {
  if (!window.THREE) return null;
  var T = THREE;
  var canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
  stage.appendChild(canvas);
  var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  var scene = new T.Scene();
  var camera = new T.OrthographicCamera(0, 1, 0, -1, -2000, 2000);

  scene.add(new T.HemisphereLight(0xffffff, 0x062014, 0.75));
  var key = new T.DirectionalLight(0xffffff, 1.1); key.position.set(-1, 2, 3); scene.add(key);
  var rim = new T.DirectionalLight(0x00e57a, 1.3); rim.position.set(2, 0.5, -1.5); scene.add(rim);

  var GREEN = 0x00e57a;
  var dark = new T.MeshStandardMaterial({ color: 0x0b0e0d, roughness: 0.55, metalness: 0.2 });
  var metal = new T.MeshStandardMaterial({ color: 0xa9b2ae, roughness: 0.3, metalness: 0.7 });
  var greenM = new T.MeshStandardMaterial({ color: GREEN, emissive: GREEN, emissiveIntensity: 0.35, roughness: 0.4 });
  var edgeM = new T.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.85 });
  function edged(geo, mat) {
    var m = new T.Mesh(geo, mat);
    m.add(new T.LineSegments(new T.EdgesGeometry(geo), edgeM));
    return m;
  }
  // a rod between two points (in the robot's own units)
  function rod(a, b, r, mat) {
    var d = new T.Vector3().subVectors(b, a), len = d.length();
    var m = new T.Mesh(new T.CylinderGeometry(r, r, len, 10), mat);
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
    return m;
  }

  var bot = new T.Group(); scene.add(bot);       // placed in screen pixels
  var body = new T.Group(); bot.add(body);       // bobs

  // wheel
  var wheel = new T.Group(); wheel.position.y = 9; bot.add(wheel);
  wheel.add(new T.Mesh(new T.TorusGeometry(8, 1.9, 12, 32), new T.MeshStandardMaterial({ color: 0x26302c, roughness: 0.7 })));
  wheel.add(new T.Mesh(new T.TorusGeometry(8, 0.6, 6, 32), greenM)).position.z = 1.9;
  var spokes = new T.Group(); wheel.add(spokes);
  for (var i = 0; i < 3; i++) {
    var sp = new T.Mesh(new T.BoxGeometry(1.4, 7, 1.4), greenM);
    sp.position.y = 3.5; var g = new T.Group(); g.rotation.z = i * 2.094; g.add(sp); spokes.add(g);
  }
  var hub = new T.Mesh(new T.CylinderGeometry(2.2, 2.2, 5, 16), metal); hub.rotation.x = Math.PI / 2; wheel.add(hub);
  // fork
  [-3.4, 3.4].forEach(function (z) { body.add(rod(new T.Vector3(0, 9, z), new T.Vector3(0, 23, z * 1.3), 0.9, metal)); });

  // chip body with pins
  var B = 28, D = 18;
  var shell = edged(new T.BoxGeometry(B, B, D), dark); shell.position.y = 36; body.add(shell);
  var pinG = new T.BoxGeometry(4, 1.6, 2.2);
  [-1, 1].forEach(function (side) {
    for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) {
      var p = new T.Mesh(pinG, metal);
      p.position.set(side * (B / 2 + 2), 25.5 + r * 7, -5 + c * 5); body.add(p);
    }
  });
  var dot = new T.Mesh(new T.CircleGeometry(1.4, 16), greenM); dot.position.set(-9, 26, D / 2 + 0.05); body.add(dot);

  // LED-screen face (texture redrawn only when the expression changes)
  var fc = document.createElement("canvas"); fc.width = 120; fc.height = 78;
  var faceTex = new T.CanvasTexture(fc);
  var face = new T.Mesh(new T.PlaneGeometry(20, 13), new T.MeshBasicMaterial({ map: faceTex }));
  face.position.set(0, 42.5, D / 2 + 0.06); body.add(face);
  var bezel = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(21, 14)), edgeM);
  bezel.position.copy(face.position); bezel.position.z += 0.02; body.add(bezel);
  var faceKey = "";
  function drawFace(eyes, look) {
    var k = eyes + ":" + Math.round(look * 4);
    if (k === faceKey) return; faceKey = k;
    var g = fc.getContext("2d"); g.fillStyle = "#031a0e"; g.fillRect(0, 0, 120, 78);
    g.fillStyle = "#3dffa0"; g.shadowColor = "#00e57a"; g.shadowBlur = 8;
    var u = 6, lx = look * 12;
    function px(x, y) { g.fillRect(x - u / 2, y - u / 2, u, u); }
    [-27, 27].forEach(function (ex) {
      var cx = 60 + ex;
      if (eyes === "happy") { px(cx - 12, 42); px(cx - 6, 36); px(cx, 30); px(cx + 6, 36); px(cx + 12, 42); }
      else if (eyes === "blink") { for (var i = -2; i <= 2; i++) px(cx + i * u + lx, 40); }
      else { for (var a = 0; a < 2; a++) for (var b = 0; b < 2; b++) px(cx - 3 + a * u + lx, 32 + b * u); }
    });
    faceTex.needsUpdate = true;
  }

  // antenna + light
  body.add(rod(new T.Vector3(6, 50, 0), new T.Vector3(8, 58, 0), 0.8, metal));
  var ledM = new T.MeshStandardMaterial({ color: 0x7dffbf, emissive: GREEN, emissiveIntensity: 1.2 });
  var led = new T.Mesh(new T.SphereGeometry(2.6, 16, 12), ledM); led.position.set(8.4, 60, 0); body.add(led);

  // arm + probe-card brush, pivoting at the right shoulder
  var arm = new T.Group(); arm.position.set(B / 2 + 1, 36, 4); body.add(arm);
  arm.add(new T.Mesh(new T.SphereGeometry(2.2, 12, 10), metal));
  arm.add(rod(new T.Vector3(0, 0, 0), new T.Vector3(10, -14, 0), 1.1, metal));
  arm.add(rod(new T.Vector3(10, -14, 0), new T.Vector3(12, -30, 0), 1.1, metal));
  var card = edged(new T.BoxGeometry(17, 4, 9), dark); card.position.set(12, -32, 0); arm.add(card);
  var needleG = new T.CylinderGeometry(0.35, 0.35, 6, 6);
  for (var n = 0; n < 6; n++) for (var m = 0; m < 2; m++) {
    var nd = new T.Mesh(needleG, metal); nd.position.set(5.5 + n * 2.8, -37, -2.2 + m * 4.4); nd.rotation.z = -0.25; arm.add(nd);
  }

  var W = 1, H = 1;
  function resize() {
    W = stage.offsetWidth || window.innerWidth; H = stage.offsetHeight || 180;
    renderer.setSize(W, H, false);
    camera.left = 0; camera.right = W; camera.top = 0; camera.bottom = -H; camera.updateProjectionMatrix();
  }
  resize();

  return {
    resize: resize,
    clear: function () { renderer.clear(); },
    render: function (x, groundY, sc, p) {
      if (canvas.width !== Math.round(W * renderer.getPixelRatio())) resize();
      bot.position.set(x, -groundY, 0);
      bot.scale.setScalar(sc);
      bot.rotation.set(0.18, 0.42 + (p.turn || 0), 0);     // three-quarter view, slightly from above
      body.position.y = p.bob || 0;
      spokes.rotation.z = -(p.wheel || 0);
      arm.rotation.z = -(p.broom || 0);
      var l = p.led == null ? 1 : p.led;
      ledM.emissiveIntensity = 0.25 + 1.2 * l;
      drawFace(p.eyes || "open", p.look || 0);
      renderer.render(scene, camera);
    }
  };
};
