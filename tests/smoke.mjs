/* No external packages, network or paid APIs required. Run: node tests/smoke.mjs */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const here=dirname(fileURLToPath(import.meta.url));
const source=(name)=>readFileSync(resolve(here,'..',name),'utf8');
for(const file of ['app.js','data.js','workbench.js','model-studio.js','asset-core.js','asset-lab.js','experience-demos.js','experience-gallery.js']) new Script(source(file),{filename:file});
const html=source('index.html');
for(const path of ['styles.css','spectrum.css','workbench.css','model-studio.css','asset-lab.css','experience-gallery.css','data.js','workbench.js','model-studio.js','asset-core.js','asset-lab.js','experience-demos.js','experience-gallery.js','app.js']){
  assert(html.includes('href="'+path+'"')||html.includes('src="'+path+'"'), 'Missing resource: '+path);
}
const windowA={};
runInNewContext(source('data.js'),{window:windowA});
const data=windowA.HUB_DATA;
assert(data,'Catalog must load');
assert(data.docs.length>=30,'Expected expanded guide library');
assert(data.standards.length>=29,'Expected official-source expansion');
assert(data.paths.length>=8,'Expected spatial learning path');
for(const category of ['docs','technologies','tools']){
  const ids=data[category].map(entry=>entry.id);
  assert.equal(ids.length,new Set(ids).size,'Duplicate ids in '+category);
}
for(const p of data.paths)for(const id of p.lessonIds)assert(data.docs.some(d=>d.id===id),'Missing guide '+p.id+'/'+id);
for(const entry of [...data.docs.map(x=>({url:x.source})),...data.technologies.map(x=>({url:x.source})),...data.standards,...data.tools]){
  assert(/^https:\/\//.test(entry.url),'Primary resource must use HTTPS: '+entry.url);
}
const windowB={};
runInNewContext(source('workbench.js'),{window:windowB,document:{}});
const lab=windowB.HUB_WORKBENCH;
assert(lab&&typeof lab.render==='function'&&typeof lab.init==='function');
const page=lab.render();
for(const id of ['wb-scene','wb-frame-results','wb-scale-results','wb-reset','wb-fov','wb-target']){
  assert(page.includes('id="'+id+'"'),'Workbench missing '+id);
}
assert(source('app.js').includes("id:'workbench'"),'Route must be in navigation');
assert(source('app.js').includes('window.HUB_WORKBENCH.init()'),'Workbench route must initialize');
const studioWindow={};
runInNewContext(source('model-studio.js'),{window:studioWindow,document:{}});
const studio=studioWindow.HUB_MODEL_STUDIO;
assert(studio&&typeof studio.render==='function'&&typeof studio.init==='function'&&typeof studio.destroy==='function');
const studioMarkup=studio.render();
for(const id of ['ms-viewer','ms-file','ms-material','ms-exposure','ms-shadow','ms-color','ms-animation','ms-export']){
  assert(studioMarkup.includes('id="'+id+'"'),'Model studio missing '+id);
}
const goodHeader=Uint8Array.from([0x67,0x6c,0x54,0x46,2,0,0,0,20,0,0,0]).buffer;
assert(studio.validateHeader(goodHeader,20),'Expected correct GLB 2.0 signature and file length');
assert(!studio.validateHeader(goodHeader,40),'GLB header must match file length');
assert(!studio.validateHeader(new ArrayBuffer(12),20),'GLB header must reject invalid signature');
assert(source('app.js').includes("id:'modelstudio'"),'Studio must be in navigation');
assert(source('app.js').includes('window.HUB_MODEL_STUDIO.init()'),'Studio must initialize');
assert(data.docs.some(x=>x.id==='gltf-delivery'),'GLB delivery guide must exist');
assert(data.docs.some(x=>x.id==='pbr-live-editing'),'PBR editing guide must exist');
const assetWindow={};
runInNewContext(source('asset-core.js'),{window:assetWindow,TextDecoder,TextEncoder});
runInNewContext(source('asset-lab.js'),{window:assetWindow,document:{}});
const assetLab=assetWindow.HUB_ASSET_LAB;
assert(assetWindow.HUB_ASSET_CORE&&assetLab&&typeof assetLab.render==='function'&&typeof assetLab.init==='function');
const assetMarkup=assetLab.render();
for(const id of ['ao-file','ao-status','ao-metrics','ao-images','ao-warnings','ao-opt-fields','ao-start','ao-download']){
  assert(assetMarkup.includes('id="'+id+'"'),'Asset Lab missing '+id);
}
assert(source('app.js').includes("id:'assetlab'"),'Optimization lab must be in main navigation');
assert(source('app.js').includes('window.HUB_ASSET_LAB.init()'),'Optimization lab route must initialize');
assert(data.docs.some(x=>x.id==='asset-performance'),'Missing optimization guide');
assert(data.docs.some(x=>x.id==='texture-optimization'),'Missing texture guide');
assert(data.docs.some(x=>x.id==='xr-demo-testing'),'Missing XR testing guide');
assert(data.docs.some(x=>x.id==='interactive-demo-design'),'Missing demo design guide');
assert(data.paths.some(x=>x.id==='demo-explorer'),'Missing demo explorer learning path');
console.log('XR-SC-Hub smoke tests PASS — syntax, routes, catalogs, reference links and lab markup.');
