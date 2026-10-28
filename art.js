/* Fruit Builder — original SVG line art.
   Every step drawing lives in a 342 × 360 frame. */
(function () {
  const INK = "#17181C";
  const BAN = "#FFD84D", RED = "#F25C4C", FLESH = "#FFF8E7", GREEN = "#2FB07A";
  const BLUE = "#7FD6E6", ORANGE = "#FF8A3D", BERRY = "#5B4BD6", RIND = "#C98A1B";
  const ln = (w = 4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  const frame = (inner, label) =>
    `<svg viewBox="0 0 342 360" role="img" aria-label="${label}">${inner}</svg>`;

  // ---------- shared parts ----------
  // Kid-safe knife, blade pointing down. Tip lands at (x+18, y+104).
  const knife = (x, y, rot = 0, s = 1) => `
    <g transform="translate(${x} ${y}) rotate(${rot} 18 104) scale(${s})">
      <rect x="6" y="0" width="24" height="46" rx="10" fill="${ORANGE}" ${ln()}/>
      <path d="M10 46 L10 96 C10 105 26 105 26 96 L26 46 Z" fill="${BLUE}" ${ln()}/>
      <path d="M10 56 h-6 M10 66 h-6 M10 76 h-6 M10 86 h-6" ${ln(3)}/>
    </g>`;
  const cut = (d, c = RED) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="8 7" stroke-linecap="round"/>`;
  const arrow = (d, head) => `<path d="${d}" fill="none" ${ln()}/><path d="${head}" fill="none" ${ln()}/>`;
  const ground = y => `<path d="M30 ${y} H312" stroke="#D9DAD4" stroke-width="4" stroke-linecap="round"/>`;
  const inset = (cx, cy, r, inner, from) => `
    ${from ? `<path d="M${from[0]} ${from[1]} L${cx - r * 0.8} ${cy - r * 0.3}" stroke="${INK}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>` : ""}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" ${ln()}/>${inner}`;
  const sparkle = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -14 V-5 M0 5 V14 M-14 0 H-5 M5 0 H14" ${ln(3.5)}/>`;
  const confetti = `
    <rect x="34" y="40" width="16" height="16" rx="3" transform="rotate(20 42 48)" fill="${RED}"/>
    <circle cx="296" cy="46" r="10" fill="${BAN}" ${ln(3)}/>
    <path d="M284 140 l14 -8 l2 16 z" fill="${GREEN}" ${ln(3)}/>
    <circle cx="44" cy="170" r="7" fill="${BERRY}"/>
    <rect x="300" y="230" width="14" height="14" rx="3" transform="rotate(-15 307 237)" fill="${ORANGE}"/>
    <path d="M70 96 l6 12 l12 2 l-9 8 l2 12 l-11 -6 l-11 6 l2 -12 l-9 -8 l12 -2 z" fill="${BAN}" ${ln(3)}/>`;

  // ---------- banana ----------
  const bananaLying = `<path d="M18 170 C60 205 150 200 172 100 C178 72 176 46 168 26 L176 14 L160 10 L156 30 C150 110 100 150 26 146 C14 146 6 160 18 170 Z" fill="${BAN}" ${ln()}/>
    <path d="M40 160 C100 168 150 140 162 70" fill="none" ${ln(2.5)} opacity="0.35"/>`;
  const bananaStanding = `<path d="M110 400 C96 320 108 230 160 170 C176 152 192 140 204 138 L212 120 L232 124 L222 144 C200 166 176 220 172 300 C170 340 172 375 178 400 Z" fill="${BAN}" ${ln()}/>`;
  const stand = inner => `<g transform="translate(20 -60)">${inner}</g>`;

  const dolphin = (eyes = true, berry = true, fin = true) => `
    <g ${ln(4.5)}>
      <path d="M110 420 C92 330 112 230 178 168 C196 152 214 142 228 141 L254 122 L250 148 L266 156 L238 160 C214 186 184 246 176 330 C172 370 176 400 184 420 Z" fill="${BAN}"/>
      ${fin ? `<path d="M168 248 L134 222 L148 268" fill="${BAN}"/>` : ""}
    </g>
    ${eyes ? `<circle cx="212" cy="168" r="6" fill="${INK}"/>` : ""}
    ${berry ? `<circle cx="252" cy="141" r="11" fill="${BERRY}" ${ln(3.5)}/>` : ""}
    <path d="M0 430 C40 405 80 430 120 412 C160 394 200 430 240 412 C280 394 310 420 342 408 L342 470 L0 470 Z" fill="${BLUE}" ${ln(4.5)}/>`;

  const bananaSteps = [
    frame(`<g transform="translate(70 90)">${bananaLying}</g>
      ${cut("M116 222 L108 290")}
      ${knife(94, 112)}
      ${arrow("M84 300 C70 312 58 314 46 310", "M56 300 L44 310 L58 318")}`, "Cut a thin slice off the round end of the banana"),
    frame(`${ground(340)}${stand(bananaStanding)}
      ${arrow("M80 300 C56 230 70 150 118 108", "M100 108 L120 106 L118 126")}`, "Stand the banana up on its flat end"),
    frame(`<g transform="translate(24 4) scale(0.86)">
      ${bananaStanding}
      <path d="M222 108 L208 156" stroke="${RED}" stroke-width="4" stroke-dasharray="8 7" stroke-linecap="round"/>
      ${knife(204, 18, 18)}
      ${arrow("M150 40 C150 70 170 92 196 104", "M184 92 L198 106 L178 112")}
      ${inset(268, 310, 62, `<g ${ln(3.5)}><path d="M236 352 C240 322 252 300 270 288 L286 270 L292 290 L304 286 L292 304 C282 312 274 330 272 352 Z" fill="${BAN}"/></g><circle cx="270" cy="296" r="3.5" fill="${INK}"/>`, [205, 250])}
    </g>`, "Split the banana stem down the middle to make a mouth"),
    frame(`${ground(340)}${stand(bananaStanding)}
      ${cut("M130 226 L104 248 L130 262")}
      ${knife(86, 122, -60)}
      ${inset(268, 270, 56, `<path d="M226 320 C230 290 246 262 270 244" fill="none" ${ln()}/><path d="M244 280 L214 252 L236 300" fill="${BAN}" ${ln()}/>`, [150, 250])}`, "Cut a small V in the peel on the back and fold it up as a fin"),
    frame(`${ground(340)}${stand(bananaStanding)}
      <path d="M298 34 L222 92" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
      <path d="M298 34 L222 92" stroke="#E2B57A" stroke-width="4" stroke-linecap="round"/>
      <circle cx="214" cy="98" r="5" fill="${INK}"/>
      ${sparkle(178, 70, 0.8)}`, "Poke two eyes with a toothpick"),
    frame(`${ground(340)}${stand(bananaStanding)}
      <path d="M232 64 L252 56 L244 78 Z" fill="#F4F5F1" ${ln(3)}/>
      <circle cx="300" cy="150" r="14" fill="${BERRY}" ${ln(3.5)}/>
      ${arrow("M290 132 C290 100 280 84 262 74", "M262 90 L258 72 L276 70")}`, "Tuck a blueberry into the dolphin’s mouth")
  ];
  const bananaDone = `<g transform="translate(0 -104)">${dolphin()}</g>`;

  // ---------- apple ----------
  const appleWhole = `<path d="M171 110 C140 90 70 96 64 170 C58 240 110 310 171 300 C232 310 284 240 278 170 C272 96 202 90 171 110 Z" fill="${RED}" ${ln()}/>
    <path d="M171 110 C170 90 174 76 182 66" fill="none" ${ln()}/>
    <path d="M178 82 C196 64 220 66 228 74 C214 90 194 92 178 82 Z" fill="${GREEN}" ${ln()}/>
    <path d="M96 150 C102 132 114 122 128 118" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`;
  const dome = (dx = 0) => `<path transform="translate(${dx} 0)" d="M60 280 C60 190 120 150 171 150 C222 150 282 190 282 280 Z" fill="${RED}" ${ln()}/>`;
  const chevrons = cx => [[14, 18], [26, 30], [38, 42]].map(([w, h]) =>
    `<path d="M${cx - w * 1.9} ${222 + h * 0.4} L${cx} ${214 - h * 0.6} L${cx + w * 1.9} ${222 + h * 0.4}" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="8 7" stroke-linecap="round"/>`).join("");
  const chevronsSolid = (cx, dx = 0) => [0, 1, 2].map(i => {
    const w = 18 + i * 14, top = 196 - i * 12, o = i * dx;
    const d = `M${cx - w + o} ${236 - i * 4} L${cx + o} ${top} L${cx + w + o} ${236 - i * 4}`;
    return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${FLESH}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`;
  }).reverse().join("");
  const neck = (x = 0, y = 0) => `<g transform="translate(${x} ${y})">
      <path d="M78 246 C62 200 64 130 88 116 C104 108 114 124 104 136" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M78 246 C62 200 64 130 88 116 C104 108 114 124 104 136" fill="none" stroke="${FLESH}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M104 134 L122 140 L104 146 Z" fill="${ORANGE}" ${ln(3)}/></g>`;
  const swan = (eyes = true) => `${ground(290)}${dome()}${chevronsSolid(128, -6)}${chevronsSolid(214, 6)}${neck(-6, 0)}
    ${eyes ? `<circle cx="90" cy="124" r="4" fill="${INK}"/>` : ""}`;

  const appleSteps = [
    frame(`${appleWhole}${cut("M240 104 L240 306", "#FFFFFF")}${knife(222, -18)}`, "A grown-up slices one side off the apple"),
    frame(`${ground(284)}${dome(-28)}
      <path d="M272 284 C272 246 292 226 318 222 L318 284 Z" fill="${FLESH}" ${ln()}/>
      <path d="M318 222 C292 226 272 246 272 284" fill="none" stroke="${RED}" stroke-width="7"/>
      ${arrow("M110 110 C140 80 190 80 220 110", "M204 104 L222 112 L222 92")}`, "Lay the apple flat on its cut side"),
    frame(`${ground(284)}${dome()}${cut("M106 236 L132 206 L158 236", "#FFFFFF")}${knife(114, 94)}`, "Cut a small upside-down V wedge on the left side"),
    frame(`${ground(284)}${dome()}${chevrons(132)}${knife(140, 70, 10)}`, "Cut bigger V wedges around the first one"),
    frame(`${ground(284)}${dome()}${chevronsSolid(128)}${chevrons(212)}${knife(188, 70, -10)}`, "Cut the same wedges on the right side"),
    frame(`${ground(290)}${dome()}${chevronsSolid(128, -8)}${chevronsSolid(214, 8)}
      ${arrow("M86 150 H40", "M54 138 L38 150 L54 162")}${arrow("M256 150 H302", "M288 138 L304 150 L288 162")}`, "Slide the wedges back to fan out the wings"),
    frame(`<path d="M110 50 C200 50 262 130 262 190 C262 260 200 330 110 330 Z" fill="${FLESH}" ${ln()}/>
      <path d="M110 50 C200 50 262 130 262 190 C262 260 200 330 110 330" fill="none" stroke="${RED}" stroke-width="9"/>
      <path d="M110 50 C200 50 262 130 262 190 C262 260 200 330 110 330" fill="none" ${ln(3)}/>
      ${cut("M150 312 C132 250 142 168 176 132 C196 112 222 124 210 146")}
      ${knife(270, 10, 30)}`, "A grown-up cuts an S-shaped neck from the saved piece"),
    frame(`${ground(290)}${dome()}${chevronsSolid(128, -6)}${chevronsSolid(214, 6)}
      ${cut("M64 226 L96 238 L66 252", "#FFFFFF")}${knife(46, 122, -60)}`, "Cut a small notch at the front of the body"),
    frame(`${ground(290)}${dome()}${chevronsSolid(128, -6)}${chevronsSolid(214, 6)}${neck(-40, -70)}
      ${arrow("M140 72 C150 110 120 150 96 176", "M94 158 L94 178 L112 178")}`, "Slide the neck into the notch"),
    frame(`${swan(false)}
      <path d="M150 40 L96 116" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
      <path d="M150 40 L96 116" stroke="#E2B57A" stroke-width="4" stroke-linecap="round"/>
      <circle cx="90" cy="124" r="4" fill="${INK}"/>${sparkle(60, 96, 0.8)}`, "Add tiny eyes with a toothpick")
  ];
  const appleDone = `<g transform="translate(0 20)">${swan()}</g>
    <path d="M0 330 C40 316 80 340 120 326 C160 312 200 338 240 324 C280 310 310 330 342 322" fill="none" stroke="${BLUE}" stroke-width="8" stroke-linecap="round"/>`;

  // ---------- pineapple ----------
  const pineWhole = `
    <defs><clipPath id="pclip"><ellipse cx="171" cy="226" rx="82" ry="108"/></clipPath></defs>
    <path d="M171 120 L140 40 L162 84 L171 22 L180 84 L202 40 Z" fill="${GREEN}" ${ln()}/>
    <path d="M171 120 L118 70 L150 112 Z M171 120 L224 70 L192 112 Z" fill="${GREEN}" ${ln()}/>
    <ellipse cx="171" cy="226" rx="82" ry="108" fill="#F2B33D" ${ln()}/>
    <g clip-path="url(#pclip)" stroke="${INK}" stroke-width="2.5" opacity="0.45">
      ${[-160, -120, -80, -40, 0, 40, 80, 120, 160].map(o => `<path d="M${o + 50} 110 L${o + 290} 350 M${o + 290} 110 L${o + 50} 350"/>`).join("")}
    </g>`;
  const round = (cx, cy, r, core = "hole") => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${BAN}" stroke="${RIND}" stroke-width="12"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 6}" fill="none" ${ln(3.5)}/>
    ${[0, 45, 90, 135].map(a => `<path transform="rotate(${a} ${cx} ${cy})" d="M${cx} ${cy - r + 16} V${cy + r - 16}" stroke="#E2B12E" stroke-width="3"/>`).join("")}
    ${core === "hole" ? `<circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="#F4F5F1" ${ln(3.5)}/>` :
      core === "cut" ? `<circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="#F2DC8A"/><circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="none" stroke="${RED}" stroke-width="4" stroke-dasharray="7 6"/>` : ""}`;
  // A half-round wing; side = "L" (flat edge left) or "R"
  const wing = (fx, cy, r, side) => {
    const sweep = side === "L" ? 1 : 0;
    const arc = `M${fx} ${cy - r} A${r} ${r} 0 0 ${sweep} ${fx} ${cy + r}`;
    const rays = [-60, -30, 0, 30, 60].map(a => {
      const rad = a * Math.PI / 180, dir = side === "L" ? 1 : -1;
      return `<path d="M${fx} ${cy} L${fx + dir * Math.cos(rad) * (r - 14)} ${cy + Math.sin(rad) * (r - 14)}" stroke="#E2B12E" stroke-width="3"/>`;
    }).join("");
    const notch = `M${fx} ${cy - r * 0.22} A${r * 0.22} ${r * 0.22} 0 0 ${sweep} ${fx} ${cy + r * 0.22}`;
    return `<path d="${arc} Z" fill="${BAN}"/>${rays}
      <path d="${arc}" fill="none" stroke="${RIND}" stroke-width="12"/>
      <path d="${arc} Z" fill="none" ${ln(3.5)}/>
      <path d="${notch} Z" fill="#F4F5F1" ${ln(3)}/>`;
  };
  const wings = (gap = 0) => `${wing(70 - gap, 190, 92, "L")}${wing(272 + gap, 190, 92, "R")}`;
  const body = `<rect x="161" y="104" width="20" height="176" rx="10" fill="#FFE68A" ${ln(3.5)}/>`;
  const antennae = `<path d="M166 108 C156 80 140 64 122 58 M176 108 C186 80 202 64 220 58" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
    <path d="M166 108 C156 80 140 64 122 58 M176 108 C186 80 202 64 220 58" fill="none" stroke="#C4874A" stroke-width="5" stroke-linecap="round"/>`;

  const pineSteps = [
    frame(`${pineWhole}${cut("M70 124 H272")}${cut("M70 318 H272")}${knife(258, 20, -30)}`, "A grown-up cuts the top and bottom off the pineapple"),
    frame(`${round(198, 166, 82, "none")}${round(144, 196, 82, "cut")}${knife(250, 20, 30)}`, "A grown-up slices rounds and cuts out the hard center"),
    frame(`${round(171, 200, 110)}${cut("M171 74 V326")}${knife(153, -14)}`, "Cut a pineapple round in half"),
    frame(`${wings(8)}
      ${arrow("M40 70 C70 40 110 44 130 70", "M114 68 L132 72 L130 54")}
      ${arrow("M302 70 C272 40 232 44 212 70", "M228 68 L210 72 L212 54")}`, "Turn the halves so the skin sides touch in the middle"),
    frame(`<path d="M72 270 A100 100 0 0 1 272 270 Z" fill="${BAN}"/>
      <path d="M72 270 A100 100 0 0 1 272 270" fill="none" stroke="${RIND}" stroke-width="12"/>
      <path d="M72 270 A100 100 0 0 1 272 270 Z" fill="none" ${ln(3.5)}/>
      ${cut("M86 244 H258")}${knife(154, 120)}`, "Cut a thin strip for the body"),
    frame(`${wings()}<g transform="translate(0 -40)">${body}</g>
      ${arrow("M171 34 V56", "M159 44 L171 58 L183 44")}`, "Lay the strip down the middle as the body"),
    frame(`${wings()}${body}${antennae}${sparkle(260, 60, 0.8)}`, "Add two antennae at the top")
  ];
  const pineDone = `${wings()}${body}${antennae}`;

  // ---------- small fruit icons ----------
  const icons = {
    banana: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 30 C16 36 30 32 32 14 L34 8 L30 7 L29 12 C27 24 18 28 9 26 C6 26 5 28 8 30 Z" fill="${BAN}" ${ln(2.2)}/></svg>`,
    apple: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 12 C14 8 6 10 6 20 C6 30 13 35 20 34 C27 35 34 30 34 20 C34 10 26 8 20 12 Z" fill="${RED}" ${ln(2.2)}/><path d="M20 12 C20 9 21 7 23 5" fill="none" ${ln(2.2)}/></svg>`,
    pineapple: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 14 L15 4 L19 9 L20 2 L21 9 L25 4 Z" fill="${GREEN}" ${ln(2)}/><ellipse cx="20" cy="25" rx="10" ry="12" fill="#F2B33D" ${ln(2.2)}/></svg>`
  };

  window.ART = {
    steps: { banana: bananaSteps, apple: appleSteps, pineapple: pineSteps },
    done: {
      banana: frame(bananaDone, "Finished banana dolphin"),
      apple: frame(appleDone, "Finished apple swan"),
      pineapple: frame(pineDone, "Finished pineapple butterfly")
    },
    celebrate: {
      banana: frame(`${confetti}${bananaDone}`, "Finished banana dolphin with confetti"),
      apple: frame(`${confetti}${appleDone}`, "Finished apple swan with confetti"),
      pineapple: frame(`${confetti}${pineDone}`, "Finished pineapple butterfly with confetti")
    },
    icons
  };
})();
