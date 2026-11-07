/* XR Experience Gallery — filters, safe sandbox previews and source export.
   Fixed, curated samples only. No user-authored code executed on the parent origin. */
(() => {
  'use strict';
  const catalog=window.HUB_GALLERY_DATA||[];
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let active=null;
  const cats=['All',...new Set(catalog.map(x=>x.category))];
  const counts={all:catalog.length,offline:catalog.filter(x=>x.mode==='offline').length,online:catalog.filter(x=>x.mode==='online').length,tools:catalog.filter(x=>x.mode==='tool').length};
  const badge=x=>x.mode==='offline'?'<span class="xg-badge offline">NO NETWORK REQUIRED</span>':x.mode==='online'?'<span class="xg-badge online">ONLINE LIBRARY</span>':'<span class="xg-badge tool">HUB WORKFLOW</span>';
  const card=(x,i)=>'<article class="xg-card" data-xg-id="'+esc(x.id)+'" data-xg-category="'+esc(x.category)+'" data-xg-mode="'+esc(x.mode)+'" data-xg-query="'+esc((x.name+' '+x.tech+' '+x.summary+' '+x.category+' '+x.level).toLowerCase())+'"><div class="xg-card-cover cover-'+((i%5)+1)+'" aria-hidden="true"><span class="xg-cover-axis"></span><span class="xg-cover-symbol">'+(['◈','⬡','◎','⌁','◉','◇'][i%6])+'</span><small>'+esc(x.category.toUpperCase())+'</small></div><div class="xg-card-content"><div class="xg-card-badges">'+badge(x)+'<span class="xg-level">'+esc(x.level)+'</span></div><h3>'+esc(x.name)+'</h3><p>'+esc(x.summary)+'</p><div class="xg-card-meta"><span>'+esc(x.tech)+'</span><span>◷ '+x.minutes+' min</span></div><button type="button" class="button-secondary" data-route="gallery/'+esc(x.id)+'">'+(x.mode==='tool'?'Open workflow':'Explore demo')+' ↗</button></div></article>';
  const renderList=()=>'<section class="xg-hero"><span class="page-eyebrow">THE IMMERSIVE WEB, IN ACTION</span><h1>Experience the <em>spatial web.</em></h1><p>Learn by exploring authentic browser graphics, hands-on educational simulations, online 3D runtimes and our own local XR tools. Every experience links to its code and learning resources.</p><div class="xg-hero-stats"><span><strong>'+counts.all+'</strong> curated experiences</span><span><strong>'+counts.offline+'</strong> offline demos</span><span><strong>'+counts.online+'</strong> connected demos</span></div><div class="xg-orbit-art" aria-hidden="true"><span></span><span></span><span></span><i>XR</i></div></section>'+
    '<div class="xg-toolbar"><div class="xg-toolbar-title"><span class="xg-kicker">CURATED LIBRARY / EXPLORE</span><h2>Choose an experiment</h2></div><label class="xg-search" for="xg-query"><span aria-hidden="true">⌕</span><input id="xg-query" type="search" placeholder="Search experiences or technologies" autocomplete="off"></label></div>'+
    '<div class="xg-filters" role="group" aria-label="Filter experiments by category">'+cats.map((cat,i)=>'<button type="button" class="xg-filter'+(!i?' active':'')+'" data-xg-filter="'+esc(cat)+'" aria-pressed="'+(!i)+'">'+esc(cat)+'</button>').join('')+'</div>'+
    '<div class="xg-mode-row" role="group" aria-label="Filter by required resources"><label><input type="radio" name="xg-mode" value="all" checked> All experiences</label><label><input type="radio" name="xg-mode" value="offline"> Offline demos</label><label><input type="radio" name="xg-mode" value="online"> Online demos</label><label><input type="radio" name="xg-mode" value="tool"> Hub tools</label></div>'+
    '<p id="xg-count" class="xg-count" role="status" aria-live="polite">'+counts.all+' experiences shown</p>'+
    '<div id="xg-cards" class="xg-cards">'+catalog.map(card).join('')+'</div>'+
    '<div id="xg-none" class="xg-none" hidden>No experiences match those filters. Try another category or search.</div>'+
    '<section class="xg-bottom"><span class="xg-kicker">RUN SAFE · LEARN DEEPLY</span><h2>A transparent approach to XR demos</h2><div class="xg-bottom-grid"><div><strong>Learning over gimmicks</strong><p>We label 2D and CSS simulations as simulations, not immersive tracking.</p></div><div><strong>Preview only on demand</strong><p>Code executes in an isolated iframe after a click. No login or paid APIs are needed.</p></div><div><strong>Know your compatibility</strong><p>Connected demos download open-source runtimes; immersive AR/VR requires supported hardware and permissions.</p></div></div></section>';
  const tipRow=(x)=>'<li>'+esc(x)+'</li>';
  function renderDetail(id){
    const x=catalog.find(x=>x.id===id);
    if(!x)return '<section class="xg-missing"><h1>Experience not found</h1><p>This item is not in the current curated collection.</p><button type="button" data-route="gallery" class="button-primary">← Return to gallery</button></section>';
    return '<div class="xg-return"><button type="button" data-route="gallery" class="xg-back">← All experiences</button><span class="xg-breadcrumb">GALLERY / '+esc(x.category.toUpperCase())+'</span></div>'+
      '<section class="xg-detail-head"><div><span class="page-eyebrow">'+esc(x.tech.toUpperCase())+' · '+esc(x.level.toUpperCase())+'</span><h1>'+esc(x.name)+'</h1><p>'+esc(x.summary)+'</p><div class="xg-detail-pills">'+badge(x)+'<span class="xg-detail-time">◷ '+x.minutes+' MIN GUIDED EXPLORATION</span></div></div><div class="xg-detail-decoration" aria-hidden="true"><span>◈</span></div></section>'+
      '<div class="xg-detail-grid"><section class="xg-view-panel"><div class="xg-view-head"><strong>LIVE EXPERIMENT</strong><span class="xg-view-state" id="xg-state" role="status" aria-live="polite">NOT RUNNING</span></div>'+
       (x.mode!=='tool'?'<div class="xg-view" id="xg-view"><div id="xg-poster" class="xg-poster"><span class="xg-poster-mark" aria-hidden="true">◈</span><strong>Run this experiment</strong><p>'+(x.mode==='online'?'This demo will connect to its external open-source library and sample assets.':'This example is self-contained and works without additional downloads.')+'</p><button type="button" class="button-primary" data-xg-action="run">▶ Run demo</button></div><iframe id="xg-frame" hidden sandbox="allow-scripts" allow="fullscreen" referrerpolicy="no-referrer" title="'+esc(x.name)+' interactive isolated demonstration"></iframe></div><div class="xg-actions"><button type="button" class="button-primary" data-xg-action="run">▶ '+(x.mode==='online'?'Load online demo':'Run again')+'</button><button type="button" class="button-secondary" data-xg-action="stop" disabled id="xg-stop">■ Stop</button><button type="button" class="button-secondary" data-xg-action="copy">Copy HTML</button><button type="button" class="button-secondary" data-xg-action="download">Download HTML ↓</button></div>':
       '<div class="xg-tool-action"><span aria-hidden="true">⬡</span><h2>Work with your own assets</h2><p>Open the hub’s dedicated tool and inspect a trusted local GLB file.</p><button type="button" class="button-primary" data-route="'+esc(x.route)+'">Launch '+esc(x.name)+' ↗</button></div>')+
       '<div class="xg-preview-note">'+(x.mode==='online'?'Connected demo: external libraries and sample data are loaded only when you start. A sandboxed preview may prevent VR session entry. Test your exported HTML over HTTPS on supported hardware.':x.mode==='offline'?'This is a local educational demo: it does not access the camera, sensors or immersive hardware. Some demos require CSS 3D, Canvas or WebGL support.':'The asset tools process your files locally, with documented compatibility limits.')+'</div>'+
       (x.mode!=='tool'?'<div class="xg-code-head"><h2>Explore the source</h2><button type="button" class="xg-code-toggle" data-xg-action="code" aria-expanded="false">Show HTML source ⌄</button></div><div id="xg-code-wrap" hidden><textarea id="xg-code" readonly spellcheck="false" aria-label="Standalone example HTML source"></textarea><p class="xg-code-note">The downloaded HTML includes its own styles and script. Online examples also require their external open-source libraries.</p></div>':'')+
      '</section><aside class="xg-aside"><section class="xg-side-section"><span class="xg-kicker">PURPOSE / LEARNING</span><h2>What you will learn</h2><p>'+esc(x.objective)+'</p></section><section class="xg-side-section"><span class="xg-kicker">TRY THIS</span><h2>Experiment guide</h2><ol>'+x.tips.map(tipRow).join('')+'</ol></section><section class="xg-side-section"><span class="xg-kicker">GO FURTHER</span><h2>Sources & next steps</h2><button type="button" class="xg-side-link" data-route="learn/'+esc(x.guide)+'">Read the related guide ↗</button><a class="xg-side-link" href="'+esc(x.source)+'" target="_blank" rel="noopener noreferrer">Official technical reference ↗</a><button type="button" class="xg-side-link" data-route="workbench">Spatial Workbench ↗</button>'+(x.mode==='tool'?'<button type="button" class="xg-side-link" data-route="modelstudio">3D Model Studio ↗</button>':'')+'</section><section class="xg-side-section xg-compat"><span class="xg-kicker">COMPATIBILITY</span><h2>Runtime expectations</h2><dl><div><dt>Mode</dt><dd>'+esc(x.mode==='offline'?'Local browser only':x.mode==='online'?'Network + modern browser':'Internal portal workflow')+'</dd></div><div><dt>Core technology</dt><dd>'+esc(x.tech)+'</dd></div><div><dt>Hardware</dt><dd>'+esc(x.id==='aframe-room'?'Inline 3D on suitable browsers; VR only when supported':'Standard browser; specialized APIs depend on demo')+'</dd></div></dl></section></aside></div>';
  }
  function render(id=''){return id?renderDetail(id):renderList();}
  function updateFilters(){
    if(!active||active.detail)return;
    const query=($('#xg-query')?.value||'').trim().toLowerCase(),category=active.category,mode=$('input[name=xg-mode]:checked')?.value||'all';
    let visible=0;
    $$('.xg-card',active.root).forEach(el=>{
      const yes=(category==='All'||el.dataset.xgCategory===category)&&(mode==='all'||el.dataset.xgMode===mode)&&(!query||el.dataset.xgQuery.includes(query));
      el.hidden=!yes;if(yes)visible++;
    });
    $('#xg-count').textContent=visible+' of '+catalog.length+' experiences shown';
    $('#xg-none').hidden=visible!==0;
  }
  function onClick(e){
    if(!active)return;
    const filter=e.target.closest('[data-xg-filter]');
    if(filter){active.category=filter.dataset.xgFilter;$$('.xg-filter',active.root).forEach(b=>{const on=b===filter;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});updateFilters();return;}
    const action=e.target.closest('[data-xg-action]')?.dataset.xgAction;
    if(!action||!active.detail)return;
    const x=catalog.find(item=>item.id===active.detail);
    if(!x||x.mode==='tool')return;
    if(action==='run')start(x);
    else if(action==='stop')stop();
    else if(action==='code'){
      const wrap=$('#xg-code-wrap'),button=e.target.closest('button');
      const expanded=wrap.hidden;wrap.hidden=!expanded;button.setAttribute('aria-expanded',String(expanded));button.textContent=expanded?'Hide HTML source ⌃':'Show HTML source ⌄';
    }else if(action==='copy')copy(x.code);
    else if(action==='download')download(x);
  }
  async function copy(code){
    try{await navigator.clipboard.writeText(code);setStatus('HTML COPIED');}
    catch{const wrap=$('#xg-code-wrap');if(wrap){wrap.hidden=false;$('#xg-code').focus();$('#xg-code').select();setStatus('SELECT SOURCE TO COPY');}}
  }
  function download(x){
    const blob=new Blob([x.code],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='spatial-hub-'+x.id+'.html';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),10000);setStatus('HTML DOWNLOAD REQUESTED');
  }
  function setStatus(s){const el=$('#xg-state');if(el)el.textContent=s;}
  function start(x){
    if(!active||active.detail!==x.id)return;
    stop();
    const frame=$('#xg-frame');if(!frame)return;
    frame.hidden=false;$('#xg-poster').hidden=true;
    frame.srcdoc=x.code;$('#xg-stop').disabled=false;
    setStatus(x.mode==='online'?'LOADING · NETWORK REQUIRED':'PREVIEW RUNNING');
  }
  function stop(){
    const frame=$('#xg-frame');if(!frame)return;
    frame.removeAttribute('srcdoc');frame.src='about:blank';frame.hidden=true;
    const poster=$('#xg-poster');if(poster)poster.hidden=false;
    const stopButton=$('#xg-stop');if(stopButton)stopButton.disabled=true;
    setStatus('NOT RUNNING');
  }
  function onInput(e){if(e.target.id==='xg-query'||e.target.name==='xg-mode')updateFilters();}
  function destroy(){
    if(!active)return;
    const state=active;state.handlers.forEach(([el,name,fn])=>el.removeEventListener(name,fn));
    if(state.detail)stop();
    active=null;
  }
  function init(id=''){
    destroy();
    const root=$('#main-content');if(!root)return;
    active={root,detail:id,category:'All',handlers:[]};
    const listen=(el,name,fn)=>{el.addEventListener(name,fn);active.handlers.push([el,name,fn]);};
    listen(root,'click',onClick);listen(root,'input',onInput);listen(root,'change',onInput);
    if(id){
      const x=catalog.find(x=>x.id===id);
      if(x?.code&&$('#xg-code'))$('#xg-code').value=x.code;
    }else updateFilters();
  }
  window.HUB_GALLERY={render,init,destroy,entries:()=>catalog.map(x=>({id:x.id,category:x.category,mode:x.mode,guide:x.guide,hasCode:!!x.code}))};
})();