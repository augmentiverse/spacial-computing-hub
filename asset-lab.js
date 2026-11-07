/* Spatial Hub Asset Optimization Lab — analysis and optional local texture repacking.
   No network access, third-party JS or paid API. File never leaves the browser. */
(() => {
  'use strict';
  const C=window.HUB_ASSET_CORE;
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=bytes=>bytes>=1048576?(bytes/1048576).toFixed(2)+' MiB':bytes>=1024?(bytes/1024).toFixed(1)+' KiB':bytes+' B';
  const num=n=>Number(n||0).toLocaleString('en-US');
  let active=null;
  const STATUS=(message,error=false)=>{
    const el=$('#ao-status');if(!el)return;
    el.textContent=message;el.dataset.kind=error?'error':'info';
  };
  function metric(value,label){
    return '<div class="ao-metric"><strong>'+esc(value)+'</strong><span>'+esc(label)+'</span></div>';
  }
  function render(){
    return '<div class="ao-hero"><div class="page-eyebrow">ASSET OPTIMIZATION LAB · EXPERIMENT 03</div><h1>Understand every <em>megabyte.</em></h1><p>Inspect a binary glTF file, locate costly textures, estimate geometry complexity and build an optimized copy entirely in your browser. You keep the original asset.</p><div class="ao-links"><a href="#modelstudio">3D Model Studio ↗</a><a href="#formats">Format inspector ↗</a><a href="#learn/asset-performance">Asset optimization guide ↗</a></div></div>'+
      '<div class="ao-grid"><section class="ao-left"><div class="ao-panel ao-upload-panel"><div class="ao-section-top"><span class="ao-eyebrow">01 / IMPORT</span><span class="ao-private">● LOCAL / PRIVATE</span></div><h2>Analyze a GLB model</h2><label class="ao-file" id="ao-drop" for="ao-file"><span class="ao-upload-icon" aria-hidden="true">⇧</span><span><strong>Drop a .glb file or browse</strong><small>GLB 2.0 · max 120 MiB · analysis runs locally</small></span><input id="ao-file" type="file" accept=".glb,model/gltf-binary"></label><div id="ao-status" data-kind="info" role="status" aria-live="polite">Select a GLB to inspect its textures, geometry and layout.</div><div class="ao-actions"><button type="button" id="ao-reset" class="button-secondary" disabled>Clear file</button><button type="button" id="ao-export-report" class="button-secondary" disabled>Export JSON report ↓</button></div></div>'+
        '<div class="ao-panel"><div class="ao-section-top"><span class="ao-eyebrow">02 / METRICS</span><span id="ao-filename" class="ao-filename">NO FILE SELECTED</span></div><h2>Asset health snapshot</h2><div id="ao-metrics" class="ao-metrics">'+metric('—','Total file size')+metric('—','Embedded image bytes')+metric('—','Triangles (estimate)')+metric('—','Texture memory (estimate)')+'</div><div class="ao-breakdown"><div class="ao-bar" id="ao-bar" aria-label="File size breakdown"><span class="ao-bar-img" style="width:0%"></span><span class="ao-bar-other" style="width:100%"></span></div><div class="ao-legend"><span><i class="ao-dot yellow"></i> Embedded images</span><span><i class="ao-dot blue"></i> Other binary and structure</span></div></div><div class="ao-data-row" id="ao-stats">Meshes — · Accessors — · Materials — · Animations —</div></div>'+
        '<div class="ao-panel"><span class="ao-eyebrow">03 / TEXTURE INVENTORY</span><h2>Embedded & referenced images</h2><div id="ao-images"><p class="ao-placeholder">Open a GLB to see each texture’s encoded size, dimensions and estimated uncompressed RGBA footprint.</p></div></div>'+
        '</section><aside class="ao-right"><div class="ao-panel"><span class="ao-eyebrow">04 / READINESS</span><h2>Practical checks</h2><p class="ao-muted">Guidance for performance planning, not a certification or measured device benchmark.</p><div id="ao-warnings"><div class="ao-placeholder">The local analyzer checks structure, texture dimensions, external dependencies and extension support.</div></div><a class="ao-source" href="https://github.khronos.org/glTF-Validator/" target="_blank" rel="noopener noreferrer">Run official Khronos glTF Validator ↗</a></div>'+
        '<div class="ao-panel ao-compress"><span class="ao-eyebrow">05 / OPTIMIZE</span><h2>Make a smaller GLB</h2><p class="ao-muted">Repack ordinary glTF bufferViews. Optionally resize and re-encode embedded JPEG / PNG textures at their original MIME types. Geometry, animations and material references are preserved.</p><fieldset id="ao-opt-fields" disabled><legend class="ao-sr-only">Optimization options</legend>'+
        '<label class="ao-radio"><input type="radio" name="ao-mode" value="repack" checked><span><strong>Safe repack</strong><small>Keep resource bytes unchanged; remove unused binary gaps when possible.</small></span></label>'+
        '<label class="ao-radio"><input type="radio" name="ao-mode" value="images"><span><strong>Compress embedded images</strong><small>May reduce image fidelity and remove embedded metadata. PNG transparency is retained when supported by the browser.</small></span></label>'+
        '<label class="ao-select" for="ao-max"><span>Maximum texture dimension</span><select id="ao-max"><option value="0">Keep original</option><option value="2048" selected>2048 px</option><option value="1024">1024 px</option><option value="512">512 px</option></select></label>'+
        '<label class="ao-slider" for="ao-quality"><span>JPEG quality</span><output for="ao-quality" id="ao-quality-out">78%</output><input type="range" id="ao-quality" min="45" max="95" value="78" step="1"></label>'+
        '<button type="button" class="button-primary ao-start" id="ao-start">Analyze savings ↗</button></fieldset>'+
        '<p class="ao-hint">Repacking is disabled for GLBs with extensions, external resources, or unusual binary layouts. No geometry simplification, Draco, Meshopt or KTX2 conversion is performed.</p>'+
        '<div class="ao-progress" id="ao-progress" hidden><span id="ao-progress-label">Optimizing…</span><progress id="ao-progress-bar" max="100" value="0"></progress></div>'+
        '<div id="ao-comparison" class="ao-comparison"><p class="ao-placeholder">After optimization, see the measured file-size difference and export a smaller GLB when available.</p></div>'+
        '<button id="ao-download" class="button-primary ao-start" type="button" disabled>Download optimized GLB ↓</button></div>'+
        '<div class="ao-panel ao-guidance"><span class="ao-eyebrow">LEARN · VALIDATE · DEPLOY</span><h2>Complete the workflow</h2><a href="#modelstudio">Preview the asset in 3D Model Studio ↗</a><a href="#learn/asset-performance">Asset optimization guide ↗</a><a href="#learn/gltf-delivery">GLB delivery & validation ↗</a><p>Always visually compare the exported model and validate its structure before publishing, especially when textures were recompressed.</p></div></aside></div>';
  }
  function bar(pct){
    const track=$('#ao-bar');
    if(!track)return;
    const share=Math.max(0,Math.min(100,pct));
    $('.ao-bar-img',track).style.width=share.toFixed(2)+'%';
    $('.ao-bar-other',track).style.width=(100-share).toFixed(2)+'%';
    track.setAttribute('aria-label','Embedded images '+share.toFixed(0)+' percent of file size');
  }
  function clearOutput(){
    if(!active)return;
    active.optimized=null;active.optimizedName=null;
    $('#ao-download').disabled=true;
    $('#ao-comparison').innerHTML='<p class="ao-placeholder">Choose an optimization option and run the calculation.</p>';
    $('#ao-progress').hidden=true;
    $('#ao-progress-bar').value=0;
  }
  function setFileReady(model,name){
    const r=C.report(model);active.report=r;active.model=model;active.filename=name;
    $('#ao-filename').textContent=name;
    $('#ao-metrics').innerHTML=metric(fmt(r.fileBytes),'Original GLB')+metric(fmt(r.embeddedTextureBytes),'Embedded image payload')+metric(num(r.triangleEstimate),'Approx. triangles')+metric(r.rgbaTextureMiB.toFixed(1)+' MiB','RGBA texture memory (approx.)');
    bar(r.fileBytes?100*r.embeddedTextureBytes/r.fileBytes:0);
    $('#ao-stats').textContent=num(r.meshCount)+' mesh(es) · '+num(r.primitiveCount)+' primitive(s) · '+num(r.accessors)+' accessors · '+num(r.materials)+' materials · '+num(r.animationCount)+' animation(s)';
    if(!r.images.length){$('#ao-images').innerHTML='<p class="ao-placeholder">No images defined inside this GLB.</p>';}
    else{
      const sorted=[...r.images].sort((a,b)=>b.encodedBytes-a.encodedBytes);
      $('#ao-images').innerHTML='<div class="ao-image-list">'+sorted.map(img=>
        '<div class="ao-image-item"><div><strong>'+esc(img.name)+'</strong><small>'+esc(img.mime)+' · '+(img.width?img.width+' × '+img.height+' px':'Dimensions unavailable')+'</small></div><div><strong>'+fmt(img.encodedBytes)+'</strong><small>'+(!img.external&&img.rgbaMiB!==null?'RGBA ≈ '+img.rgbaMiB.toFixed(1)+' MiB':img.external?'External reference':'Embedded/unknown')+'</small></div></div>').join('')+'</div>';
    }
    const blockers=C.canRepack(model);
    const warnings=[...r.warnings,...blockers.map(x=>'Optimization blocked: '+x)];
    $('#ao-warnings').innerHTML=warnings.map(w=>'<div class="ao-warning">'+esc(w)+'</div>').join('');
    $('#ao-opt-fields').disabled=blockers.length>0;
    $('#ao-export-report').disabled=false;$('#ao-reset').disabled=false;
    clearOutput();
    STATUS(blockers.length?'Analysis complete. Optimization not available for this GLB, but the report can be exported.':'Analysis complete. This core GLB can be repacked locally.');
  }
  async function openFile(file){
    if(!active||!file)return;
    const session=active,token=++session.token;
    session.model=null;session.report=null;session.filename='';
    $('#ao-opt-fields').disabled=true;$('#ao-export-report').disabled=true;
    $('#ao-filename').textContent='ANALYZING FILE';
    $('#ao-metrics').innerHTML=metric('—','Total file size')+metric('—','Images')+metric('—','Triangles')+metric('—','Texture memory');
    $('#ao-images').innerHTML='<p class="ao-placeholder">Reading a new file…</p>';
    $('#ao-warnings').innerHTML='<p class="ao-placeholder">Checks will appear after analysis.</p>';
    $('#ao-stats').textContent='Meshes — · Accessors — · Materials — · Animations —';
    clearOutput();bar(0);
    if(!/\.glb$/i.test(file.name)){STATUS('Choose a binary .glb file. A .gltf JSON asset is not directly supported.',true);return;}
    if(file.size>C.MAX_FILE||file.size<20){STATUS('GLB must be between 20 bytes and 120 MiB.',true);return;}
    STATUS('Reading file and inspecting glTF binary structure…');
    $('#ao-opt-fields').disabled=true;$('#ao-export-report').disabled=true;$('#ao-reset').disabled=true;
    clearOutput();
    try{
      const bytes=await file.arrayBuffer();
      if(active!==session||token!==session.token)return;
      const result=C.parseGLB(bytes);
      setFileReady(result,file.name);
    }catch(e){
      if(active!==session||token!==session.token)return;
      session.model=null;session.report=null;
      $('#ao-filename').textContent='INVALID / UNSUPPORTED GLB';
      $('#ao-images').innerHTML='<p class="ao-placeholder">File analysis could not complete.</p>';
      STATUS(e.message||'Unable to analyze GLB.',true);
    }
  }
  const sleep=()=>new Promise(resolve=>setTimeout(resolve,0));
  const blobToBytes=async(blob)=>new Uint8Array(await blob.arrayBuffer());
  async function processImage(candidate,config){
    const raw=new Blob([candidate.bytes],{type:candidate.mime});
    let bitmap;
    try{bitmap=await createImageBitmap(raw);}catch{return null;}
    try{
      const factor=config.max&&Math.max(bitmap.width,bitmap.height)>config.max?config.max/Math.max(bitmap.width,bitmap.height):1;
      const width=Math.max(1,Math.round(bitmap.width*factor)),height=Math.max(1,Math.round(bitmap.height*factor));
      if(width*height>16e6)return null;
      const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
      const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return null;
      ctx.drawImage(bitmap,0,0,width,height);
      const optimized=await new Promise(resolve=>canvas.toBlob(resolve,candidate.mime,candidate.mime==='image/jpeg'?config.quality:undefined));
      canvas.width=0;canvas.height=0;
      if(!optimized||optimized.type!==candidate.mime)return null;
      const data=await blobToBytes(optimized);
      return data.length<candidate.bytes.length-Math.max(1024,candidate.bytes.length*.02)?data:null;
    }finally{bitmap.close?.();}
  }
  async function optimize(){
    const session=active;if(!session?.model)return;
    const token=++session.token,mode=$('input[name="ao-mode"]:checked')?.value||'repack';
    const config={max:Number($('#ao-max').value)||0,quality:Number($('#ao-quality').value)/100};
    clearOutput();
    $('#ao-start').disabled=true;
    $('#ao-progress').hidden=false;
    const progress=$('#ao-progress-bar'),label=$('#ao-progress-label');
    const replacements=new Map();
    let recompressed=0,skipped=0;
    try{
      if(mode==='images'){
        if(typeof createImageBitmap!=='function')throw Error('This browser does not support local image decoding needed for texture recompression.');
        const candidates=C.sourceImages(session.model);
        if(!candidates.length)throw Error('No compatible embedded PNG/JPEG textures found. Try Safe repack instead.');
        for(let i=0;i<candidates.length;i++){
          if(active!==session||session.token!==token)return;
          progress.value=Math.round(90*i/candidates.length);
          label.textContent='Re-encoding image '+(i+1)+' of '+candidates.length+'…';
          await sleep();
          const replacement=await processImage(candidates[i],config);
          if(replacement){replacements.set(candidates[i].viewIndex,replacement);recompressed++;}
          else skipped++;
        }
      }
      if(active!==session||session.token!==token)return;
      label.textContent='Repacking bufferViews and validating output…';progress.value=90;
      await sleep();
      const output=C.repack(session.model,replacements);
      if(active!==session||session.token!==token)return;
      progress.value=100;
      const original=session.model.fileSize, delta=original-output.byteLength;
      if(delta<=0){
        $('#ao-comparison').innerHTML='<p class="ao-placeholder">No smaller valid GLB was produced. The original is already at least as compact with these settings. Try different image settings or use an external optimizer for geometry and texture formats.</p>';
        STATUS('Optimization completed without reducing the file. Original retained.');
      }else{
        session.optimized=output;
        session.optimizedName=(session.filename.replace(/\.glb$/i,'').replace(/[^a-zA-Z0-9._-]+/g,'_').slice(0,75)||'model')+'-optimized.glb';
        $('#ao-comparison').innerHTML='<div class="ao-size-comparison">'+metric(fmt(original),'Before')+metric(fmt(output.byteLength),'After')+metric((100*delta/original).toFixed(1)+'%','Size reduction')+'</div><p class="ao-optimized-note">'+recompressed+' image(s) recompressed; '+skipped+' retained. '+(mode==='images'?'Images may have altered visual quality.':'Resource bytes preserved in repack mode.')+'</p>';
        $('#ao-download').disabled=false;STATUS('Smaller GLB generated locally. Export and validate before publishing.');
      }
    }catch(e){
      if(active===session&&session.token===token){STATUS(e.message||'Optimization failed.',true);$('#ao-comparison').innerHTML='<p class="ao-placeholder">No optimized file was produced.</p>';}
    }finally{
      if(active===session&&session.token===token){
        $('#ao-progress').hidden=true;$('#ao-start').disabled=false;
      }
    }
  }
  function download(blob,name){
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=name;document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function onClick(ev){
    const button=ev.target.closest('button');if(!button||!active)return;
    if(button.id==='ao-reset'){
      active.token++;active.model=null;active.report=null;active.optimized=null;
      $('#ao-file').value='';$('#ao-filename').textContent='NO FILE SELECTED';
      $('#ao-metrics').innerHTML=metric('—','Total file size')+metric('—','Images')+metric('—','Triangles')+metric('—','Texture memory');
      $('#ao-stats').textContent='Meshes — · Accessors — · Materials — · Animations —';
      $('#ao-images').innerHTML='<p class="ao-placeholder">Open a GLB to inspect its images.</p>';
      $('#ao-warnings').innerHTML='<p class="ao-placeholder">The local analyzer checks structure, textures and extensions.</p>';
      $('#ao-export-report').disabled=true;button.disabled=true;$('#ao-opt-fields').disabled=true;bar(0);clearOutput();STATUS('Ready for another GLB file.');
    } else if(button.id==='ao-export-report'&&active.report){
      const safe={...active.report,analyzedFile:active.filename,generatedAt:new Date().toISOString(),note:'Estimates only; use Khronos glTF Validator and actual-device tests.'};
      download(new Blob([JSON.stringify(safe,null,2)],{type:'application/json'}),'spatial-hub-asset-report.json');
    } else if(button.id==='ao-start')optimize();
    else if(button.id==='ao-download'&&active.optimized){
      download(new Blob([active.optimized],{type:'model/gltf-binary'}),active.optimizedName);
    }
  }
  function onChange(ev){
    if(ev.target.id==='ao-file')openFile(ev.target.files?.[0]);
    if(ev.target.name==='ao-mode'||ev.target.id==='ao-max')clearOutput();
  }
  function onInput(ev){
    if(ev.target.id==='ao-quality'){$('#ao-quality-out').textContent=ev.target.value+'%';clearOutput();}
  }
  function dragOver(ev){if(ev.dataTransfer?.types.includes('Files')){ev.preventDefault();$('#ao-drop')?.classList.add('dragging');}}
  function drop(ev){ev.preventDefault();$('#ao-drop')?.classList.remove('dragging');openFile(ev.dataTransfer?.files?.[0]);}
  function init(){
    destroy();
    const root=$('#main-content'),zone=$('#ao-drop');if(!root||!zone||!C){return;}
    active={root,model:null,report:null,optimized:null,token:0,listeners:[]};
    const listen=(el,event,handler)=>{el.addEventListener(event,handler);active.listeners.push([el,event,handler]);};
    listen(root,'click',onClick);listen(root,'change',onChange);listen(root,'input',onInput);
    listen(zone,'dragover',dragOver);listen(zone,'drop',drop);
    listen(zone,'dragleave',()=>zone.classList.remove('dragging'));
  }
  function destroy(){
    if(!active)return;
    active.token++;
    active.listeners.forEach(([el,evt,handler])=>el.removeEventListener(evt,handler));
    active=null;
  }
  window.HUB_ASSET_LAB={render,init,destroy};
})();