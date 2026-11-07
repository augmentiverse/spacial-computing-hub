/* Spatial 3D Model Studio — locally opened GLB files + optional official online demo.
   Uses the Apache-2.0 <model-viewer> component on demand; no paid API.
   See https://modelviewer.dev/docs/ and /examples/scenegraph/ */
(() => {
  'use strict';
  const VIEWER_MODULE = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.4.0/model-viewer.min.js';
  const OFFICIAL_DEMO = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
  const LIMIT = 80 * 1024 * 1024;
  const $ = (selector, root=document) => root.querySelector(selector);
  let loadPromise = null;
  let active = null;
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const msg = (value, error=false) => {
    const el=$('#ms-status');
    if(el){el.textContent=value;el.dataset.state=error?'error':'info';}
  };
  const control = (id,label,min,max,step,value) => '<label class="ms-range"><span>'+label+'</span><output id="'+id+'-out" for="'+id+'">'+value+'</output><input type="range" id="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+value+'"></label>';
  function render(){
    return '<div class="ms-intro"><span class="page-eyebrow">3D MODEL STUDIO · EXPERIMENT 02</span><h1>Bring your models <em>into focus.</em></h1><p>Open a self-contained GLB from your computer and explore camera framing, lighting, animation and physically based materials. Files are read locally; no asset upload or account is required.</p><div class="ms-shortcuts"><a href="#workbench">Spatial Workbench ↗</a><a href="#formats">Format inspector ↗</a><a href="#learn/gltf-delivery">glTF delivery guide ↗</a></div></div>'+
    '<div class="ms-layout"><section class="ms-stage-wrap"><div class="ms-head"><span><span class="ms-status-light"></span> LIVE 3D VIEWPORT</span><div class="ms-head-actions"><button type="button" data-ms-action="reset" class="ms-mini">Reset camera</button><button type="button" data-ms-action="autorotate" aria-pressed="false" class="ms-mini">Auto rotate: off</button></div></div>'+
      '<div class="ms-stage" id="ms-stage" data-background="space"><model-viewer id="ms-viewer" camera-controls touch-action="pan-y" interaction-prompt="auto" environment-image="neutral" shadow-intensity="0.8" exposure="1" alt="Interactive 3D preview of the selected model; drag to orbit and scroll or pinch to zoom."></model-viewer>'+
        '<div class="ms-empty" id="ms-empty"><div class="ms-empty-glyph" aria-hidden="true">⬡</div><strong>Your 3D workspace</strong><p>Choose a GLB file or load an example to start exploring.</p><button type="button" data-ms-action="demo" class="button-primary">Explore a sample ↗</button></div>'+
        '<div class="ms-stage-footer"><span>Drag to rotate · Scroll / pinch to zoom</span><span id="ms-object-name">NO MODEL LOADED</span></div></div>'+
      '<div class="ms-upload"><label for="ms-file" class="ms-drop" id="ms-drop"><span class="ms-upload-icon" aria-hidden="true">⇧</span><span><strong>Drop a .glb file here, or select one</strong><small>Self-contained GLB · up to 80 MiB · local processing only</small></span><input id="ms-file" type="file" accept=".glb,model/gltf-binary" aria-describedby="ms-status"></label><button type="button" class="button-secondary" data-ms-action="demo">Use demo model</button></div>'+
      '<p id="ms-status" role="status" aria-live="polite" data-state="info">3D engine will load only when you open this studio. An internet connection is required for its first use.</p>'+
      '<div class="ms-metrics" aria-live="polite"><div><strong id="ms-metric-size">—</strong><span>Asset size</span></div><div><strong id="ms-metric-bounds">—</strong><span>Bounds (m)</span></div><div><strong id="ms-metric-materials">—</strong><span>Materials</span></div><div><strong id="ms-metric-animations">—</strong><span>Animations</span></div></div>'+
    '</section>'+
    '<aside class="ms-sidebar">'+
      '<section class="ms-panel"><span class="ms-eyebrow">01 / APPEARANCE</span><h2>Light & environment</h2><p>Compare how lighting changes the same asset. These settings affect the viewer, not the underlying file.</p>'+
        control('ms-exposure','Exposure',0.2,2.5,0.1,'1.0')+
        control('ms-shadow','Shadow intensity',0,2,0.1,'0.8')+
        control('ms-softness','Shadow softness',0,1,0.1,'0.5')+
        '<label class="ms-select-label" for="ms-env">Environment lighting<select id="ms-env"><option value="neutral">Neutral studio</option><option value="legacy">Directional studio</option></select></label>'+
        '<div class="ms-color-choice" role="group" aria-label="Viewport background"><span>Background</span><div><button type="button" class="ms-swatch active" data-ms-bg="space" aria-label="Deep blue background" aria-pressed="true"></button><button type="button" class="ms-swatch" data-ms-bg="light" aria-label="Light blue background" aria-pressed="false"></button><button type="button" class="ms-swatch" data-ms-bg="sunset" aria-label="Warm red background" aria-pressed="false"></button></div></div></section>'+
      '<section class="ms-panel"><span class="ms-eyebrow">02 / PBR MATERIALS</span><h2>Surface editor</h2><p>Select a material, then alter its base color, metalness and roughness. Textures can influence the visible result.</p>'+
        '<label class="ms-select-label" for="ms-material">Material<select id="ms-material" disabled><option>No model loaded</option></select></label>'+
        '<label class="ms-color-row" for="ms-color"><span>Base-color factor</span><input type="color" id="ms-color" value="#ffcc48" disabled></label>'+
        control('ms-metal','Metalness',0,1,0.05,'0.5')+control('ms-rough','Roughness',0,1,0.05,'0.5')+
        '<div class="ms-panel-buttons"><button data-ms-action="reset-material" type="button" class="button-secondary" disabled id="ms-reset-material">Restore selected material</button><button data-ms-action="export" type="button" class="button-primary" disabled id="ms-export">Export edited GLB ↓</button></div>'+
        '<small class="ms-hint">Only glTF material factors are edited. Export availability depends on supported model-viewer features and asset extensions.</small></section>'+
      '<section class="ms-panel"><span class="ms-eyebrow">03 / ANIMATION</span><h2>Timeline</h2><label class="ms-select-label" for="ms-animation">Animation clip<select id="ms-animation" disabled><option>No animations available</option></select></label><div class="ms-panel-buttons"><button type="button" class="button-secondary" data-ms-action="play" id="ms-play" disabled>▶ Play</button><button type="button" class="button-secondary" data-ms-action="pause" id="ms-pause" disabled>Ⅱ Pause</button></div></section>'+
    '</aside></div>'+
    '<div class="ms-disclaimer"><span class="ms-eyebrow">LEARN BY DOING</span><h2>From a GLB file to a published experience</h2><div class="ms-cards"><a href="#formats"><strong>Inspect geometry</strong><span>Review source structure and asset optimization ↗</span></a><a href="#playground"><strong>Create a scene</strong><span>Take your model into an interactive code playground ↗</span></a><a href="https://modelviewer.dev/docs/" rel="noopener noreferrer" target="_blank"><strong>Official API</strong><span>Browse model-viewer documentation ↗</span></a></div><p><strong>Privacy & compatibility:</strong> local files remain in your browser. A small, free external JavaScript module and optional decoders load from the web. This is a 3D preview and material experiment, not a complete DCC editor or guaranteed device AR runtime. Unsupported models or extensions may fail.</p></div>';
  }
  const activate = () => {
    if(window.customElements?.get('model-viewer')) return Promise.resolve();
    if(!loadPromise) loadPromise=import(VIEWER_MODULE).catch(e=>{loadPromise=null;throw e;});
    return loadPromise.then(()=>window.customElements.whenDefined('model-viewer'));
  };
  function setMetric(id,text){const el=$('#'+id);if(el)el.textContent=text;}
  function setEnabled(enabled){
    ['ms-material','ms-color','ms-reset-material','ms-export'].forEach(id=>{const el=$('#'+id);if(el)el.disabled=!enabled;});
  }
  function getMaterial(){
    const selection=$('#ms-material');
    return active?.viewer?.model?.materials?.[Number(selection?.value)]||null;
  }
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,Number(v)||0));
  const toHex=(values)=>{
    const x=values?.slice?.(0,3)||[1,1,1];
    return '#'+x.map(n=>Math.round(clamp(n)**(1/2.2)*255).toString(16).padStart(2,'0')).join('');
  };
  function showMaterial() {
    const mat=getMaterial(), p=mat?.pbrMetallicRoughness;
    ['ms-color','ms-metal','ms-rough'].forEach(id=>{const el=$('#'+id);if(el)el.disabled=!p;});
    if(!p)return;
    $('#ms-color').value=toHex(p.baseColorFactor);
    for(const [key,value] of [['ms-metal',p.metallicFactor],['ms-rough',p.roughnessFactor]]){
      const e=$('#'+key);e.value=Number(value).toFixed(2);
      $('#'+key+'-out').textContent=Number(value).toFixed(2);
    }
  }
  function restoreMaterial() {
    const mat=getMaterial(),api=mat?.pbrMetallicRoughness;
    const gltf=active?.viewer?.originalGltfJson;
    const source=gltf?.materials?.[Number($('#ms-material').value)]?.pbrMetallicRoughness;
    if(!api||!source){msg('Cannot find the original material definition for this item.',true);return;}
    api.setBaseColorFactor(source.baseColorFactor||[1,1,1,1]);
    api.setMetallicFactor(source.metallicFactor??1);
    api.setRoughnessFactor(source.roughnessFactor??1);
    showMaterial();msg('Restored the selected material factors.');
  }
  function afterLoad(){
    if(!active)return;
    const {viewer}=active,materials=viewer.model?.materials||[],clips=viewer.availableAnimations||[];
    $('#ms-empty').hidden=true;
    setEnabled(materials.length>0);
    const matSelect=$('#ms-material');
    matSelect.replaceChildren();
    materials.forEach((material,index)=>{
      const option=document.createElement('option');
      option.value=String(index);option.textContent=material.name||('Material '+(index+1));matSelect.add(option);
    });
    if(!materials.length){matSelect.add(new Option('No materials available',''));}
    showMaterial();
    const animation=$('#ms-animation');animation.replaceChildren();
    clips.forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;animation.add(option);});
    if(!clips.length)animation.add(new Option('No animations in this model',''));
    animation.disabled=!clips.length;$('#ms-play').disabled=!clips.length;$('#ms-pause').disabled=!clips.length;
    const d=viewer.getDimensions?.();
    setMetric('ms-metric-bounds',d?[d.x,d.y,d.z].map(v=>Number(v).toFixed(2)).join(' × '):'—');
    setMetric('ms-metric-materials',String(materials.length));
    setMetric('ms-metric-animations',String(clips.length));
    msg('Model ready. Drag to orbit, then experiment with the controls.');
  }
  const closeLocalUrl=()=>{
    if(active?.objectUrl){URL.revokeObjectURL(active.objectUrl);active.objectUrl=null;}
  };
  async function setModel(fileOrUrl,name,size){
    const target=active;if(!target)return;
    const viewer=target.viewer;
    $('#ms-empty').hidden=true;
    setEnabled(false);
    viewer.removeAttribute('src');
    closeLocalUrl();
    const animation=$('#ms-animation');animation.disabled=true;
    $('#ms-play').disabled=true;$('#ms-pause').disabled=true;
    $('#ms-object-name').textContent=name;
    setMetric('ms-metric-size',size?Math.round(size/1048576*100)/100+' MiB':'online');
    setMetric('ms-metric-bounds','—');setMetric('ms-metric-materials','—');setMetric('ms-metric-animations','—');
    msg('Loading '+name+' …');
    try{
      await activate();
      if(active!==target)return;
      if(typeof fileOrUrl==='string')viewer.src=fileOrUrl;
      else{
        const url=URL.createObjectURL(fileOrUrl);
        target.objectUrl=url;viewer.src=url;
      }
    }catch(e){msg('Could not load the free 3D viewer. Check your connection or network policy.',true);$('#ms-empty').hidden=false;}
  }
  async function validateAndOpen(file){
    if(!file)return;
    if(!/\.glb$/i.test(file.name)){msg('Please choose a binary .glb file (not a .gltf + external texture bundle).',true);return;}
    if(file.size<20||file.size>LIMIT){msg('GLB must be between 20 bytes and 80 MiB.',true);return;}
    try{
      const header=await file.slice(0,12).arrayBuffer();
      const dv=new DataView(header),magic=dv.getUint32(0,true),version=dv.getUint32(4,true),length=dv.getUint32(8,true);
      if(magic!==0x46546c67||version!==2||length!==file.size)throw Error('Invalid GLB v2 header or byte-length.');
      await setModel(file,file.name,file.size);
    }catch(e){msg(e.message||'Unable to read file.',true);}
  }
  async function exportModel(){
    const viewer=active?.viewer;
    if(!viewer?.model||!viewer?.exportScene){msg('No editable model available for export.',true);return;}
    msg('Exporting the edited GLB …');
    try{
      const blob=await viewer.exportScene({binary:true});
      if(!(blob instanceof Blob))throw Error('The exporter did not return a file.');
      const url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');anchor.href=url;
      anchor.download=(($('#ms-object-name').textContent||'model').replace(/\.glb$/i,'').replace(/[^a-zA-Z0-9._-]+/g,'_').slice(0,80)||'model')+'-edited.glb';
      document.body.append(anchor);anchor.click();anchor.remove();
      setTimeout(()=>URL.revokeObjectURL(url),12000);
      msg('Edited GLB export requested. Verify materials and extensions after downloading.');
    }catch(e){msg('Export failed: '+(e.message||'unsupported asset feature'),true);}
  }
  const onInput = (event)=>{
    const target=event.target,viewer=active?.viewer;if(!viewer)return;
    if(target.id==='ms-exposure'||target.id==='ms-shadow'||target.id==='ms-softness'){
      const map={'ms-exposure':'exposure','ms-shadow':'shadowIntensity','ms-softness':'shadowSoftness'};
      viewer[map[target.id]]=Number(target.value);
      $('#'+target.id+'-out').textContent=Number(target.value).toFixed(1);
    }
    const mat=getMaterial(),p=mat?.pbrMetallicRoughness;
    if(!p)return;
    if(target.id==='ms-color')p.setBaseColorFactor(target.value);
    if(target.id==='ms-metal'||target.id==='ms-rough'){
      p[target.id==='ms-metal'?'setMetallicFactor':'setRoughnessFactor'](Number(target.value));
      $('#'+target.id+'-out').textContent=Number(target.value).toFixed(2);
    }
  };
  const onChange=(event)=>{
    if(event.target.id==='ms-file')validateAndOpen(event.target.files?.[0]);
    if(event.target.id==='ms-env'&&active)active.viewer.environmentImage=event.target.value;
    if(event.target.id==='ms-material')showMaterial();
    if(event.target.id==='ms-animation'&&active?.viewer)active.viewer.animationName=event.target.value;
  };
  const onClick=(event)=>{
    if(!active)return;
    const viewer=active.viewer;
    const bg=event.target.closest('[data-ms-bg]');
    if(bg){
      $('#ms-stage').dataset.background=bg.dataset.msBg;
      active.root.querySelectorAll('[data-ms-bg]').forEach(button=>{
        const isCurrent=button===bg;button.classList.toggle('active',isCurrent);button.setAttribute('aria-pressed',String(isCurrent));
      });return;
    }
    const action=event.target.closest('[data-ms-action]')?.dataset.msAction;
    if(!action)return;
    if(action==='demo')setModel(OFFICIAL_DEMO,'Astronaut · model-viewer sample',0);
    if(action==='reset'){viewer.cameraOrbit='0deg 75deg auto';viewer.cameraTarget='auto auto auto';viewer.fieldOfView='auto';viewer.jumpCameraToGoal?.();msg('Camera framing reset.');}
    if(action==='autorotate'){viewer.autoRotate=!viewer.autoRotate;const button=event.target.closest('button');button.textContent='Auto rotate: '+(viewer.autoRotate?'on':'off');button.setAttribute('aria-pressed',String(viewer.autoRotate));}
    if(action==='play'&&viewer.availableAnimations?.length){viewer.animationName=$('#ms-animation').value;viewer.play();}
    if(action==='pause')viewer.pause();
    if(action==='export')exportModel();
    if(action==='reset-material')restoreMaterial();
  };
  const onDragOver=(event)=>{if(event.dataTransfer?.types.includes('Files')){event.preventDefault();$('#ms-drop')?.classList.add('dragging');}};
  const onDrop=(event)=>{
    event.preventDefault();
    $('#ms-drop')?.classList.remove('dragging');
    if(event.dataTransfer?.files?.[0])validateAndOpen(event.dataTransfer.files[0]);
  };
  const onDragLeave=()=>$('#ms-drop')?.classList.remove('dragging');
  function init(){
    const root=$('#main-content'),viewer=$('#ms-viewer');
    if(!root||!viewer)return;
    destroy();
    active={root,viewer,objectUrl:null,listeners:[]};
    const register=(el,type,fn)=>{el.addEventListener(type,fn);active.listeners.push([el,type,fn]);};
    register(root,'click',onClick);register(root,'input',onInput);register(root,'change',onChange);
    const drop=$('#ms-drop');
    register(drop,'dragover',onDragOver);register(drop,'drop',onDrop);register(drop,'dragleave',onDragLeave);
    register(viewer,'load',afterLoad);
    register(viewer,'error',()=>{if(!active)return;msg('The model could not be rendered. Check that the GLB contains supported embedded resources.',true);$('#ms-empty').hidden=false;});
    activate().then(()=>{if(active?.viewer===viewer)msg('Viewer ready. Open a GLB or use the sample.');}).catch(()=>{if(active?.viewer===viewer)msg('3D library unavailable. Check internet access and any network restrictions.',true);});
  }
  function destroy(){
    if(!active)return;
    const state=active;state.listeners.forEach(([el,type,fn])=>el.removeEventListener(type,fn));
    state.viewer.removeAttribute('src');
    closeLocalUrl();
    active=null;
  }
  window.HUB_MODEL_STUDIO={render,init,destroy,validateHeader:(bytes,fileSize)=>{
    const v=new DataView(bytes);return bytes.byteLength>=12 && v.getUint32(0,true)===0x46546c67 && v.getUint32(4,true)===2 && v.getUint32(8,true)===fileSize;
  }};
})();