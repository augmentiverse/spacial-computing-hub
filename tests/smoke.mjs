/* No external packages, network or paid APIs required. Run: node tests/smoke.mjs */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const here=dirname(fileURLToPath(import.meta.url));
const source=(name)=>readFileSync(resolve(here,'..',name),'utf8');
for(const file of ['app.js','data.js','workbench.js']) new Script(source(file),{filename:file});
const html=source('index.html');
for(const path of ['styles.css','spectrum.css','workbench.css','data.js','workbench.js','app.js']){
  assert(html.includes('href="'+path+'"')||html.includes('src="'+path+'"'), 'Missing resource: '+path);
}
const windowA={};
runInNewContext(source('data.js'),{window:windowA});
const data=windowA.HUB_DATA;
assert(data,'Catalog must load');
assert(data.docs.length>=24,'Expected expanded guide library');
assert(data.standards.length>=21,'Expected official-source expansion');
assert(data.paths.length>=5,'Expected spatial learning path');
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
console.log('XR-SC-Hub smoke tests PASS — syntax, routes, catalogs, reference links and lab markup.');
