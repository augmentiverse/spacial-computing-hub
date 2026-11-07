/* Spatial Computing Hub — educational XR Workbench, no paid API or external scripts */
(() => {
  'use strict';
  const defaults = { yaw:28, pitch:-18, roll:0, distance:4.5, fov:60 };
  const params = { ...defaults };
  const $ = (s, root=document) => root.querySelector(s);
  const safe = n => Number.isFinite(n) ? n : 0;
  let watcher = null;
  const num = (n, digits=1) => safe(n).toLocaleString('en-US',{maximumFractionDigits:digits});
  const range = (key,label,min,max,step,unit) => `<label class="wb-control" for="wb-${key}"><span>${label}</span><output id="wb-${key}-out" for="wb-${key}">${params[key]}${unit}</output><input id="wb-${key}" data-wb-cam="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${params[key]}" aria-label="${label}"></label>`;
  const inp = (id,label,value,min,max,step) => `<label class="wb-number"><span>${label}</span><input type="number" inputmode="decimal" data-wb-estimate id="${id}" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;
  const panel = (over,title,desc,body) => `<section class="wb-panel"><span class="wb-kicker">${over}</span><h2>${title}</h2><p class="wb-intro">${desc}</p>${body}</section>`;

  function render() {
    return `<div class="wb-intro-block"><span class="page-eyebrow">SPATIAL WORKBENCH · EXPERIMENT 01</span><h1>Explore spatial concepts <em>hands on.</em></h1><p>Three educational mini-labs make the mathematics and delivery trade-offs behind immersive experiences more tangible. All calculations run locally; nothing is uploaded.</p><div class="wb-quicklinks"><a href="#learn/coordinates-matrices">Coordinate systems ↗</a><a href="#learn/xr-frame-budget">Performance guide ↗</a><a href="#learn/ar-world-scale">AR scale guide ↗</a></div></div>
    <div class="wb-main-grid">
      ${panel('01 / INTERACTIVE 3D','Camera & orientation explorer','Rotate a 3D object, change its perspective and see how field of view and camera distance change what appears on screen.',`
        <div class="wb-canvas-frame"><canvas id="wb-scene" width="900" height="560" role="img" aria-label="Projected three-dimensional cube with blue X axis, yellow Y axis and red Z axis. Adjust the labeled sliders for orientation and perspective."></canvas><div class="wb-canvas-caption"><span><b style="color:#6bbdff">X</b> · <b style="color:#ffd85b">Y</b> · <b style="color:#ff7084">Z</b> axes</span><span>Perspective projection · 3D → 2D</span></div></div>
        <div class="wb-controls">${range('yaw','Yaw · Y axis',-180,180,1,'°')}${range('pitch','Pitch · X axis',-89,89,1,'°')}${range('roll','Roll · Z axis',-180,180,1,'°')}${range('distance','Camera distance',2.5,10,.1,' m')}${range('fov','Vertical field of view',25,110,1,'°')}</div>
        <div class="wb-controls-footer"><button id="wb-reset" class="button-secondary" type="button">↺ Reset view</button><span id="wb-projection-note" role="status" aria-live="polite"></span></div>
        <div class="wb-teaching-note"><strong>Learn:</strong> changing the camera FOV changes the angular portion of the scene, while object rotation changes its orientation in world space. The illustration uses a pinhole-style perspective model, not a headset lens calibration.</div>`)}
      ${panel('02 / PLANNING ESTIMATOR','XR frame budget calculator','Estimate stereo pixel throughput and the time available per frame. Results are planning arithmetic, <strong>not</strong> a GPU benchmark.',`
        <div class="wb-num-grid">
          ${inp('wb-width','Width per eye (px)',1832,320,8000,1)}
          ${inp('wb-height','Height per eye (px)',1920,320,8000,1)}
          <label class="wb-number"><span>Views rendered</span><select id="wb-eyes" data-wb-estimate><option value="2">2 · stereo</option><option value="1">1 · mono / inline</option></select></label>
          <label class="wb-number"><span>Target refresh (Hz)</span><select id="wb-fps" data-wb-estimate><option value="72">72 Hz</option><option value="90" selected>90 Hz</option><option value="120">120 Hz</option><option value="60">60 Hz</option></select></label>
          ${inp('wb-scale','Linear render scale',1,0.5,2,0.05)}
        </div><div class="wb-results" id="wb-frame-results" aria-live="polite"></div>
        <div class="wb-teaching-note"><strong>Interpretation:</strong> linear scale affects both width and height; doubling it quadruples pixel count. Eye textures, layers, shading, overdraw, depth, MSAA and compositor work make real rendering costs more complex. Device display refresh is not guaranteed application frame rate.</div>`)}
      ${panel('03 / WORLD-SCALE MATH','AR object scale planner','Use the source model’s approximate bounding-box dimensions to calculate a uniform scale factor for a target physical size.',`
        <div class="wb-num-grid">
          ${inp('wb-model-height','Source model height (m)',1.8,0.001,10000,0.01)}
          ${inp('wb-model-width','Source model width (m)',0.8,0,10000,0.01)}
          ${inp('wb-model-depth','Source model depth (m)',0.5,0,10000,0.01)}
          ${inp('wb-target','Target height (cm)',120,1,100000,1)}
        </div>
        <div class="wb-results" id="wb-scale-results" aria-live="polite"></div>
        <div class="wb-teaching-note"><strong>Important:</strong> glTF defines meters as its linear-distance unit, but exports may be authored with incorrect object scale or transform data. Verify an asset's actual bounds and transforms in a 3D editor before using these numbers. This calculator does not modify your model.</div>`)}
    </div>
    <section class="wb-endnote"><span class="wb-kicker">KEEP EXPLORING</span><h2>From concept to a real device</h2><div class="wb-next-grid"><a href="#playground"><strong>Code playground</strong><span>Build a live browser scene ↗</span></a><a href="#diagnostics"><strong>XR device checker</strong><span>Detect browser capabilities ↗</span></a><a href="#formats"><strong>Format & conversion lab</strong><span>Inspect and prepare assets ↗</span></a></div><p>For headset-specific AR/VR, test on actual hardware over HTTPS. A mathematical simulation cannot determine WebXR device compatibility.</p></section>`;
  }
  function getNumber(id,lo,hi) {
    const el=$('#'+id),v=Number(el?.value);
    if(!el || el.value.trim()==='' || !Number.isFinite(v) || v<lo || v>hi) return null;
    return v;
  }
  function rotate([x,y,z]) {
    const a=params.yaw*Math.PI/180,b=params.pitch*Math.PI/180,c=params.roll*Math.PI/180;
    let nx=x*Math.cos(a)+z*Math.sin(a), nz=-x*Math.sin(a)+z*Math.cos(a);
    let ny=y*Math.cos(b)-nz*Math.sin(b);nz=y*Math.sin(b)+nz*Math.cos(b);
    return [nx*Math.cos(c)-ny*Math.sin(c),nx*Math.sin(c)+ny*Math.cos(c),nz];
  }
  function draw() {
    const canvas=$('#wb-scene');if(!canvas)return;
    const parent=canvas.parentElement, width=Math.max(320,Math.round(parent.clientWidth||720)),height=Math.max(260,Math.round(width*.58));
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.style.width='100%';canvas.style.height=height+'px';
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    const ctx=canvas.getContext('2d');if(!ctx)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const grad=ctx.createLinearGradient(0,0,width,height);grad.addColorStop(0,'#0a1b38');grad.addColorStop(1,'#081225');ctx.fillStyle=grad;ctx.fillRect(0,0,width,height);
    const focal=(height*.5)/Math.tan(params.fov*Math.PI/360), center=[width*.5,height*.52];
    const project = p=>{const [x,y,z]=rotate(p),depth=params.distance-z;return [center[0]+focal*x/depth,center[1]-focal*y/depth,z]};
    const line=(a,b,color,thickness=1)=>{const x=project(a),y=project(b);ctx.beginPath();ctx.moveTo(x[0],x[1]);ctx.lineTo(y[0],y[1]);ctx.strokeStyle=color;ctx.lineWidth=thickness;ctx.stroke();};
    for(let i=-4;i<=4;i++){line([-4,-1.3,i],[4,-1.3,i],'#4775a03e');line([i,-1.3,-4],[i,-1.3,4],'#4775a03e');}
    const axes=[{p:[2.5,0,0],a:[0,0,0],c:'#65baff',label:'X'},{p:[0,2.1,0],a:[0,0,0],c:'#ffdc6e',label:'Y'},{p:[0,0,2.2],a:[0,0,0],c:'#ff6b81',label:'Z'}];
    axes.forEach(v=>{line(v.a,v.p,v.c,2.5);const at=project(v.p);ctx.font='bold 15px system-ui';ctx.fillStyle=v.c;ctx.fillText(v.label,at[0]+7,at[1]-5)});
    const points=[[-.75,-.75,-.75],[.75,-.75,-.75],[.75,.75,-.75],[-.75,.75,-.75],[-.75,-.75,.75],[.75,-.75,.75],[.75,.75,.75],[-.75,.75,.75]];
    const faces=[[0,1,2,3,'#265abd'],[4,5,6,7,'#388fe5'],[0,4,7,3,'#ff5268'],[1,5,6,2,'#6bbdff'],[3,2,6,7,'#ffc946'],[0,1,5,4,'#947033']];
    faces.map(([a,b,c,d,color])=>({ix:[a,b,c,d],color,depth:(rotate(points[a])[2]+rotate(points[b])[2]+rotate(points[c])[2]+rotate(points[d])[2])/4})).sort((a,b)=>a.depth-b.depth).forEach(face=>{
      const p=face.ix.map(i=>project(points[i]));ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(v=>ctx.lineTo(v[0],v[1]));ctx.closePath();ctx.fillStyle=face.color+'a6';ctx.fill();ctx.strokeStyle='#c5dcffbb';ctx.lineWidth=1.5;ctx.stroke();
    });
    ctx.beginPath();ctx.arc(center[0],center[1],3,0,2*Math.PI);ctx.fillStyle='#fff6c8';ctx.fill();
    const note=$('#wb-projection-note');if(note)note.textContent=`FOV ${params.fov}° · Camera ${params.distance.toFixed(1)} m`;
  }
  function result(container,items){const el=$('#'+container);if(el)el.innerHTML=items.map(([val,label])=>`<div class="wb-result"><strong>${val}</strong><span>${label}</span></div>`).join('');}
  function updateBudgets() {
    const w=getNumber('wb-width',320,8000),h=getNumber('wb-height',320,8000),eyes=getNumber('wb-eyes',1,2),hz=getNumber('wb-fps',1,240),scale=getNumber('wb-scale',.5,2);
    if([w,h,eyes,hz,scale].some(v=>v===null)){result('wb-frame-results',[['—','Enter valid values within the indicated ranges']]);return;}
    const pixels=w*h*eyes*scale*scale;
    result('wb-frame-results',[[num(1000/hz,2)+' ms','Time available per displayed frame'],[num(pixels/1e6,2)+' M','Estimated pixels per stereo frame'],[num(pixels*hz/1e6,1)+' M/s','Theoretical pixel throughput'],[num(pixels*4/1048576,1)+' MiB','One RGBA8 color surface, excluding overhead']]);
  }
  function updateScale() {
    const h=getNumber('wb-model-height',.001,10000),w=getNumber('wb-model-width',0,10000),d=getNumber('wb-model-depth',0,10000),target=getNumber('wb-target',1,100000);
    if([h,w,d,target].some(v=>v===null)){result('wb-scale-results',[['—','Enter valid positive model height and target dimensions']]);return;}
    const scale=target/100/h;
    result('wb-scale-results',[[num(scale,4)+' ×','Uniform scale multiplier'],[num(h*scale*100,1)+' cm','Resulting height'],[num(w*scale*100,1)+' cm','Resulting width'],[num(d*scale*100,1)+' cm','Resulting depth']]);
  }
  function init() {
    const root=$('#wb-scene');if(!root)return;
    if(watcher){watcher.disconnect();watcher=null;}
    const canvasRegion=root.parentElement;
    const onInput=(ev)=>{if(!root.isConnected)return;const key=ev.target.dataset.wbCam;
      if(key){params[key]=Number(ev.target.value);const out=$('#wb-'+key+'-out');if(out)out.textContent=ev.target.value+(key==='distance'?' m':'°');draw();}
      if(ev.target.dataset.wbEstimate!==undefined){updateBudgets();updateScale();}
    };
    const onClick=(ev)=>{if(ev.target.closest('#wb-reset')){Object.assign(params,defaults);Object.keys(params).forEach(k=>{const inp=$('#wb-'+k),out=$('#wb-'+k+'-out');if(inp)inp.value=params[k];if(out)out.textContent=params[k]+(k==='distance'?' m':'°');});draw();}};
    const parent=$('#main-content');parent.addEventListener('input',onInput);parent.addEventListener('change',onInput);parent.addEventListener('click',onClick);
    // Remove listeners when navigating away; avoid accumulating duplicate handlers.
    window.HUB_WORKBENCH.destroy=()=>{parent.removeEventListener('input',onInput);parent.removeEventListener('change',onInput);parent.removeEventListener('click',onClick);if(watcher)watcher.disconnect();watcher=null;};
    if('ResizeObserver' in window){watcher=new ResizeObserver(()=>{if(root.isConnected)draw();});watcher.observe(canvasRegion);}
    else window.addEventListener('resize',draw,{once:true});
    draw();updateBudgets();updateScale();
  }
  window.HUB_WORKBENCH={render,init,destroy:()=>{}};
})();