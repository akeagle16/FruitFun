/* Fruit Builder — app shell, camera scan and step-by-step builder. */
(function () {
  "use strict";
  const $app = document.getElementById("app");
  const F = window.FRUITS, ART = window.ART;
  const ORDER = ["banana", "apple", "pineapple"];

  // ---------------- icons ----------------
  const I = {
    back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    next: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    out: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>`,
    help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/></svg>`,
    scan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/></svg>`,
    camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
    play: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#FFFFFF"/></svg>`,
    knife: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 22 L21 6 C24 4 27 6 25 9 L12 25 Z" fill="#7FD6E6" stroke="#17181C" stroke-width="2.6" stroke-linejoin="round"/><rect x="4" y="22" width="6" height="10" rx="2.5" transform="rotate(-45 7 27)" fill="#17181C"/></svg>`,
    grownup: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="13" cy="9" r="5" fill="#FFFFFF" stroke="#17181C" stroke-width="2.4"/><path d="M4 29 C4 19 22 19 22 29" fill="#FFFFFF" stroke="#17181C" stroke-width="2.4" stroke-linejoin="round"/><circle cx="25" cy="15" r="3.5" fill="#FFD84D" stroke="#17181C" stroke-width="2.2"/><path d="M19 29 C19 23 31 23 31 29" fill="#FFD84D" stroke="#17181C" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    logo: `<svg viewBox="0 0 34 34" aria-hidden="true"><rect x="2" y="2" width="30" height="30" rx="10" fill="#17181C"/><circle cx="12" cy="13" r="4" fill="#FFD84D"/><circle cx="22" cy="13" r="4" fill="#F25C4C"/><circle cx="17" cy="22" r="4" fill="#2FB07A"/></svg>`
  };
  const BADGES = {
    knife: { cls: "knife", icon: I.knife, label: "Knife step" },
    grownup: { cls: "grownup", icon: I.grownup, label: "Grown-up step" }
  };
  const badge = (k, lg) => k ? `<span class="badge ${BADGES[k].cls}${lg ? " badge-lg" : ""}"><span class="disc">${BADGES[k].icon}</span>${BADGES[k].label}</span>` : "";

  // ---------------- router ----------------
  function parse() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const [view, fruit, n] = parts;
    if (fruit && !F[fruit]) return { view: "scan" };
    return { view: view || "scan", fruit, n: Math.max(1, parseInt(n || "1", 10) || 1) };
  }
  const go = h => { location.hash = h; };

  function render() {
    const r = parse();
    if (r.view !== "scan") stopCamera();
    const views = { scan: viewScan, pick: viewPick, fruit: viewFruit, gear: viewGear, step: viewStep, done: viewDone };
    (views[r.view] || viewScan)(r);
    window.scrollTo(0, 0);
    const h = $app.querySelector("h1, h2");
    if (h) document.title = "Fruit Builder · " + h.textContent;
  }
  window.addEventListener("hashchange", render);

  // ---------------- scan ----------------
  let stream = null, timer = null, model = null, modelPromise = null, history = [], help = false;

  function viewScan() {
    help = false;
    $app.innerHTML = `
      <section class="screen">
        <div class="row" style="justify-content: space-between">
          <div class="brand">${I.logo}Fruit Builder</div>
          <button class="icon-btn" id="helpBtn" aria-label="Help">${I.help}</button>
        </div>
        <div>
          <h1 class="h1">Point at<br>a fruit.</h1>
          <p class="sub">Banana, apple or pineapple.</p>
        </div>
        <div class="viewfinder idle-state" id="vf">
          <div class="idle">${ART.icons.banana.replace('viewBox="0 0 40 40"', 'viewBox="0 0 40 40" style="opacity:.18"')}</div>
          <video id="video" playsinline muted autoplay></video>
          <div class="reticle"><span></span><span></span><span></span><span></span></div>
          <div class="status"><span class="chip dark" id="chip"><span class="dot pulse"></span><span id="chipTxt">Starting camera…</span></span></div>
          <div class="msg" id="msg" hidden></div>
        </div>
        <div class="row">
          <button class="btn grow" id="scanBtn">${I.scan}<span id="scanTxt">Scan</span></button>
          <a class="btn ghost" href="#/pick">Pick instead</a>
        </div>
      </section>`;
    document.getElementById("scanBtn").onclick = startScan;
    document.getElementById("helpBtn").onclick = () => {
      help = !help;
      showMsg(help ? "Hold one fruit inside the frame in good light. Green apples are easiest to spot — if it can’t tell, tap <b>Pick instead</b>." : "");
    };
    const demo = new URLSearchParams(location.search).get("demo");
    if (demo && F[demo]) { setChip(`Demo: ${F[demo].name}`, false); setTimeout(() => found(demo), 1500); return; }
    startScan();
  }

  const el = id => document.getElementById(id);
  function setChip(text, pulsing) {
    const t = el("chipTxt"); if (!t) return;
    t.textContent = text;
    el("chip").querySelector(".dot").classList.toggle("pulse", !!pulsing);
  }
  function showMsg(html) { const m = el("msg"); if (!m) return; m.hidden = !html; m.innerHTML = html; }
  function setBtn(text, disabled) { const b = el("scanBtn"); if (!b) return; el("scanTxt").textContent = text; b.disabled = !!disabled; }

  async function startScan() {
    if (stream) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setChip("No camera", false); setBtn("Scan", true);
      showMsg("This browser can’t use the camera here. Open the app over <b>https</b> (GitHub Pages works), or tap <b>Pick instead</b>.");
      return;
    }
    setBtn("Starting…", true); setChip("Starting camera…", true);
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 640 } }, audio: false });
    } catch (e) {
      stream = null;
      setChip("Camera blocked", false); setBtn("Try again", false);
      showMsg("Camera permission was blocked. Allow camera access for this site, then tap <b>Try again</b> — or <b>Pick instead</b>.");
      return;
    }
    const v = el("video");
    if (!v) { stopCamera(); return; }
    v.srcObject = stream;
    try { await v.play(); } catch (e) { /* iOS may need the tap; button stays available */ }
    el("vf").classList.remove("idle-state");
    setChip("Loading fruit brain…", true); setBtn("Scanning…", true);
    try {
      model = await loadModel();
    } catch (e) {
      setChip("Offline", false); setBtn("Try again", false); stopCamera(true);
      showMsg("Couldn’t load the fruit-spotting model (needs internet the first time). Tap <b>Pick instead</b> to keep going.");
      return;
    }
    if (!stream) return;
    history = [];
    setChip("Looking…", true);
    timer = setInterval(classifyFrame, 450);
  }

  function stopCamera(keepView) {
    clearInterval(timer); timer = null;
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null;
    if (keepView) { const v = el("video"); if (v) v.srcObject = null; }
  }

  function addScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.async = true; s.onload = res; s.onerror = () => rej(new Error("load " + src));
      document.head.appendChild(s);
    });
  }
  function loadModel() {
    if (model) return Promise.resolve(model);
    if (!modelPromise) {
      modelPromise = addScript("vendor/tf.min.js")
        .then(() => addScript("vendor/mobilenet.min.js"))
        .then(() => window.mobilenet.load({ version: 2, alpha: 1.0 }))
        .catch(e => { modelPromise = null; throw e; });
    }
    return modelPromise;
  }

  // ImageNet labels → our three fruits. Only green apples have their own label,
  // so red apples get partial credit from look-alike labels.
  const LABELS = [
    ["banana", "banana", 1],
    ["pineapple", "pineapple", 1],
    ["granny smith", "apple", 1],
    ["pomegranate", "apple", 0.7],
    ["fig", "apple", 0.4]
  ];
  function score(preds) {
    const s = { banana: 0, apple: 0, pineapple: 0 };
    preds.forEach(p => {
      const name = p.className.toLowerCase();
      LABELS.forEach(([key, fruit, w]) => { if (name.includes(key)) s[fruit] += p.probability * w; });
    });
    const best = ORDER.reduce((a, b) => (s[b] > s[a] ? b : a));
    return s[best] >= 0.25 ? best : null;
  }

  let busy = false;
  async function classifyFrame() {
    const v = el("video");
    if (busy || !model || !v || v.readyState < 2) return;
    busy = true;
    try {
      const preds = await model.classify(v, 5);
      const f = score(preds);
      history.push(f); if (history.length > 4) history.shift();
      const hits = f ? history.filter(x => x === f).length : 0;
      if (f && hits >= 3) found(f);
      else setChip(f ? `Is that a ${F[f].name.toLowerCase()}?` : "Looking…", true);
    } catch (e) { /* skip frame */ }
    busy = false;
  }

  function found(f) {
    stopCamera();
    setChip(`${F[f].name} spotted`, false);
    if (navigator.vibrate) navigator.vibrate(60);
    setTimeout(() => go(`#/fruit/${f}`), 450);
  }

  // ---------------- fruit spotted ----------------
  function viewFruit({ fruit }) {
    const f = F[fruit], c = f.creation;
    $app.innerHTML = `
      <section class="screen">
        <div class="hero" style="background:${f.tint}">
          <div class="top">
            <a class="icon-btn" href="#/" aria-label="Back to scan">${I.back}</a>
            <span class="chip dark">${f.name}</span>
          </div>
          ${ART.done[fruit]}
        </div>
        <div>
          <p class="eyebrow" style="color:${f.deep}">${f.name} spotted</p>
          <h1 class="h1" style="margin-top:8px">Want to make something creative?</h1>
        </div>
        <div class="creation-card">
          <div class="ic" style="background:${f.tint}">${ART.icons[fruit]}</div>
          <div>
            <div class="t">${c.title}</div>
            <div class="pills"><span class="pill">${c.steps.length} steps</span><span class="pill">${c.level}</span></div>
          </div>
        </div>
        <a class="video-link" href="${c.video.url}" target="_blank" rel="noopener">
          <span class="play">${I.play}</span>
          <span>Watch a video first<small>${c.video.label} · YouTube</small></span>
          <span class="spacer"></span>${I.out}
        </a>
        <div class="spacer"></div>
        <div style="display:flex; flex-direction:column; gap:8px">
          <a class="btn" href="#/gear/${fruit}">Let’s make it ${I.next}</a>
          <a class="btn quiet" href="#/">Not now — scan again</a>
        </div>
      </section>`;
  }

  // ---------------- gear ----------------
  function viewGear({ fruit }) {
    const c = F[fruit].creation;
    const ok = sessionStorage.getItem("fb-ok") === "1";
    const hasGrownup = c.steps.some(s => s.badge === "grownup");
    $app.innerHTML = `
      <section class="screen">
        <div class="row">
          <a class="icon-btn" href="#/fruit/${fruit}" aria-label="Back">${I.back}</a>
          <span style="font-size:15px; font-weight:700; color:var(--muted)">${c.title}</span>
        </div>
        <h1 class="h1">Grab your gear.</h1>
        <div class="gear-grid">
          <div class="gear hot"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 40 L40 12 C46 8 52 12 48 18 L22 46 Z" fill="#7FD6E6" stroke="#17181C" stroke-width="3" stroke-linejoin="round"/><path d="M12 38 l3 3 M17 33 l3 3 M22 28 l3 3 M27 23 l3 3 M32 18 l3 3" stroke="#17181C" stroke-width="2" stroke-linecap="round"/><rect x="10" y="42" width="10" height="20" rx="4" transform="rotate(-45 15 52)" fill="#FF8A3D" stroke="#17181C" stroke-width="3"/></svg>Kid-safe knife</div>
          <div class="gear"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="16" width="46" height="36" rx="8" fill="#E9C99A" stroke="#17181C" stroke-width="3"/><circle cx="56" cy="34" r="5" fill="#FFFFFF" stroke="#17181C" stroke-width="3"/></svg>Cutting board</div>
          <div class="gear"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="24" cy="20" r="9" fill="#FFFFFF" stroke="#17181C" stroke-width="3"/><path d="M8 56 C8 40 40 40 40 56" fill="#FFFFFF" stroke="#17181C" stroke-width="3" stroke-linejoin="round"/><circle cx="46" cy="30" r="6" fill="#FFD84D" stroke="#17181C" stroke-width="3"/><path d="M36 56 C36 46 56 46 56 56" fill="#FFD84D" stroke="#17181C" stroke-width="3" stroke-linejoin="round"/></svg>Grown-up nearby</div>
        </div>
        <a class="buy" href="${window.KNIFE_URL}" target="_blank" rel="noopener">
          <span class="spacer"><b>Need a kid-safe knife?</b><small>Nylon, serrated, blunt tip · Walmart</small></span>${I.out}
        </a>
        <div class="badge-card">
          <div class="r">${badge("knife", true)}</div>
          <p><b>Knife step.</b> Use your kid-safe knife, cut away from your fingers, and go slow.</p>
          ${hasGrownup ? `<div class="r">${badge("grownup", true)}</div><p><b>Grown-up step.</b> Tough cuts — let a grown-up do these with a real knife.</p>` : ""}
        </div>
        <div class="spacer"></div>
        <label class="ok"><input type="checkbox" id="ok" ${ok ? "checked" : ""}> A grown-up said OK</label>
        <a class="btn" id="ready" href="#/step/${fruit}/1" aria-disabled="${!ok}">I’m ready</a>
      </section>`;
    el("ok").onchange = e => {
      sessionStorage.setItem("fb-ok", e.target.checked ? "1" : "0");
      el("ready").setAttribute("aria-disabled", String(!e.target.checked));
    };
  }

  // ---------------- step ----------------
  function viewStep({ fruit, n }) {
    const c = F[fruit].creation, total = c.steps.length;
    if (n > total) return go(`#/done/${fruit}`);
    const s = c.steps[n - 1];
    const bars = c.steps.map((_, i) => `<i class="${i < n - 1 ? "done" : i === n - 1 ? "now" : ""}"></i>`).join("");
    const prev = n === 1 ? `#/gear/${fruit}` : `#/step/${fruit}/${n - 1}`;
    const next = n === total ? `#/done/${fruit}` : `#/step/${fruit}/${n + 1}`;
    $app.innerHTML = `
      <section class="screen">
        <div class="row">
          <a class="icon-btn" href="#/fruit/${fruit}" aria-label="Close instructions">${I.close}</a>
          <div class="progress" style="grid-template-columns: repeat(${total}, minmax(0, 1fr))" role="img" aria-label="Step ${n} of ${total}">${bars}</div>
        </div>
        <div class="row" style="justify-content:space-between; align-items:flex-end">
          <div class="stepnum" aria-hidden="true">${n}</div>
          ${badge(s.badge)}
        </div>
        <div class="stage" id="stage">
          ${ART.steps[fruit][n - 1]}
          ${s.count ? `<span class="count">${s.count}</span>` : ""}
          <a class="icon-btn vid-mini" href="${c.video.url}" target="_blank" rel="noopener" aria-label="Watch the video on YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#17181C"/></svg></a>
        </div>
        <div>
          <h2 class="h2"><span class="sr">Step ${n} of ${total}: </span>${s.title}</h2>
          <p class="sub" style="margin-top:6px">${s.hint}</p>
        </div>
        <div class="row">
          <a class="icon-btn" style="width:60px; height:60px; border-radius:30px" href="${prev}" aria-label="Previous step">${I.back}</a>
          <a class="btn grow" href="${next}">${n === total ? "Finish" : "Done, next"} ${I.next}</a>
        </div>
      </section>`;
    // swipe left/right
    let x0 = null;
    const st = el("stage");
    st.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    st.addEventListener("touchend", e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (dx < -60) go(next); else if (dx > 60) go(prev);
    });
  }
  document.addEventListener("keydown", e => {
    const r = parse();
    if (r.view !== "step" || e.target.closest("input, textarea")) return;
    const total = F[r.fruit].creation.steps.length;
    if (e.key === "ArrowRight") go(r.n >= total ? `#/done/${r.fruit}` : `#/step/${r.fruit}/${r.n + 1}`);
    if (e.key === "ArrowLeft") go(r.n === 1 ? `#/gear/${r.fruit}` : `#/step/${r.fruit}/${r.n - 1}`);
  });

  // ---------------- done ----------------
  function viewDone({ fruit }) {
    const f = F[fruit], c = f.creation;
    $app.innerHTML = `
      <section class="screen">
        <div class="celebrate" style="background:${f.tint}" id="cel">${ART.celebrate[fruit]}</div>
        <div class="center">
          <p class="eyebrow" style="color:#1E6B4A">All ${c.steps.length} steps done</p>
          <h1 class="h1" style="margin-top:8px">${c.done}</h1>
        </div>
        <div class="spacer"></div>
        <div style="display:flex; flex-direction:column; gap:10px">
          <label class="btn" for="photo">${I.camera}<span id="photoTxt">Snap a photo</span></label>
          <input type="file" id="photo" accept="image/*" capture="environment" class="sr">
          <div class="row">
            <a class="btn ghost grow" href="#/step/${fruit}/1">Make it again</a>
            <a class="btn ghost grow" href="#/">New fruit</a>
          </div>
        </div>
      </section>`;
    el("photo").onchange = e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const img = new Image();
      img.alt = `Photo of your ${c.short.toLowerCase()}`;
      img.src = URL.createObjectURL(file);
      el("cel").innerHTML = ""; el("cel").appendChild(img);
      el("photoTxt").textContent = "Retake photo";
    };
  }

  // ---------------- picker ----------------
  function viewPick() {
    $app.innerHTML = `
      <section class="screen" style="gap:16px">
        <div class="row"><a class="icon-btn" href="#/" aria-label="Back to scan">${I.back}</a></div>
        <h1 class="h1">What are we making?</h1>
        ${ORDER.map(k => {
          const f = F[k], c = f.creation;
          return `<a class="tile" href="#/fruit/${k}" style="background:${f.tint}">
            <div class="txt">
              <div><p class="eyebrow" style="color:${f.deep}">${f.name}</p><div class="name">${c.short}</div></div>
              <div class="pills"><span class="pill">${c.steps.length} steps</span><span class="pill">${c.level}</span></div>
            </div>
            <div class="art">${ART.done[k]}</div>
          </a>`;
        }).join("")}
      </section>`;
  }

  render();
})();
