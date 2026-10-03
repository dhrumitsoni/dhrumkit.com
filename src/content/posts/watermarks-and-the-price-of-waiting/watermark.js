// Shared model for FIG. 01 — used at build time (initial render) and in the browser.
export function events(seed = 11) {
  let s = seed;
  const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const ev = [];
  for (let i = 0; i < 32; i++) {
    const et = i * 1.7 + r() * 1.2;
    let sk = 0.6 + r() * 3.6;
    if (i % 5 === 2) sk += 5 + r() * 10;
    if (et + sk <= 59.5) ev.push({ et, sk, pt: et + sk });
  }
  return ev;
}

const X = (t) => 40 + (t * 580) / 60;
const Y = (t) => 290 - t * 4.5;
const px = (x) => +((x / 640) * 100).toFixed(2);
const py = (y) => +((y / 320) * 100).toFixed(2);

export function model(d, ev) {
  const pts = ev.map((e) => ({ l: px(X(e.pt)), t: py(Y(e.et)), late: e.sk > d }));
  const wy2 = Y(60 - d);
  const fire = Math.min(30 + d, 60);
  return {
    pts,
    late: pts.filter((p) => p.late).length,
    total: pts.length,
    wx1: X(d),
    wy2,
    poly: `${X(d)},290 620,${wy2} 620,290`,
    fireX: X(fire),
    fireL: px(X(fire)),
    fireS: (30 + d).toFixed(1),
    labL: px(X(40) + 10),
    labT: py(Y(40 - d) + 8),
    dS: d.toFixed(1),
  };
}

export const pointsHTML = (m) =>
  m.pts.map((p) => `<i class="pt${p.late ? ' late' : ''}" style="left:${p.l}%;top:${p.t}%"></i>`).join('');
