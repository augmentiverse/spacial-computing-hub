/* XR Experience Gallery — offline catalog validation. Run: node tests/gallery.mjs */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script,runInNewContext} from 'node:vm';
const base=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=n=>readFileSync(resolve(base,n),'utf8');
for(const name of ['experience-demos.js','experience-gallery.js'])new Script(load(name),{filename:name});
const context={window:{},document:{}};
runInNewContext(load('experience-demos.js'),context);
const entries=context.window.HUB_GALLERY_DATA;
assert(Array.isArray(entries)&&entries.length>=12,'Expected 12 curated experiences');
const ids=entries.map(x=>x.id);
assert.equal(new Set(ids).size,entries.length,'Duplicate gallery ID');
assert.equal(entries.filter(x=>x.mode==='offline').length,8,'Expected eight offline demos');
assert.equal(entries.filter(x=>x.mode==='online').length,3,'Expected three online demos');
assert.equal(entries.filter(x=>x.mode==='tool').length,1,'Expected one internal workflow');
const dataCtx={window:{}};
runInNewContext(load('data.js'),dataCtx);
const docIds=new Set(dataCtx.window.HUB_DATA.docs.map(d=>d.id));
for(const x of entries){
  assert(x.id&&x.name&&x.category&&x.tech&&x.mode&&x.level&&x.summary,'Missing experience metadata: '+x.id);
  assert(x.tips?.length>=2,'Expected experiment steps: '+x.id);
  assert(docIds.has(x.guide),'Unknown guide for '+x.id+': '+x.guide);
  assert(/^https:\/\//.test(x.source),'Missing official HTTPS source for '+x.id);
  assert(Number.isInteger(x.minutes)&&x.minutes>0,'Missing estimated reading time for '+x.id);
  if(x.mode==='tool'){
    assert.equal(x.route,'assetlab');
    assert(!x.code,'Internal workflow must not pretend to be a standalone demo');
  } else {
    assert(x.code.startsWith('<!doctype html>')&&x.code.includes('</html>'),'Experience code must be a complete standalone HTML document: '+x.id);
    assert(x.code.includes('<meta name="viewport"'),'Experience must support viewport sizing: '+x.id);
  }
  if(x.mode==='offline'){
    assert(!/https?:\/\//i.test(x.code),'Offline demo contains an external URL: '+x.id);
    const inline=x.code.match(/<script>([\s\S]*?)<\/script>/i);
    if(inline)new Script(inline[1],{filename:'gallery-demo-'+x.id+'.js'});
  }
  if(x.mode==='online'){
    assert(/https:\/\//.test(x.code),'Connected demo requires a pinned external library');
    assert(/(?:1\.8\.0|0\.187\.0|4\.4\.0)/.test(x.code),'Connected library should use an explicit version');
  }
}
runInNewContext(load('experience-gallery.js'),context);
const gallery=context.window.HUB_GALLERY;
assert(gallery&&typeof gallery.render==='function'&&typeof gallery.init==='function'&&typeof gallery.destroy==='function');
const home=gallery.render();
assert(home.includes('XR')&&home.includes('id="xg-query"')&&home.includes('id="xg-cards"'));
assert.equal((home.match(/class="xg-card"/g)||[]).length,entries.length);
for(const x of entries){
  const page=gallery.render(x.id);
  assert(page.includes(x.name)&&page.includes('Read the related guide'),'Detail must expose title and linked guide: '+x.id);
  assert(page.includes('data-route="learn/'+x.guide+'"'),'Guide route missing: '+x.id);
  if(x.mode!=='tool')assert(page.includes('id="xg-frame"')&&page.includes('sandbox="allow-scripts"')&&!page.includes('allow-same-origin'),'Demos must be in script-only, opaque-origin iframe: '+x.id);
  else assert(page.includes('data-route="assetlab"'),'Internal tool route must work');
}
assert(gallery.render('does-not-exist').includes('Experience not found'));
assert(load('app.js').includes("id:'gallery'"));
assert(load('app.js').includes('window.HUB_GALLERY.render(r.detail)'));
assert(load('app.js').includes('window.HUB_GALLERY.init(r.detail)'));
const shell=load('index.html');
for(const asset of ['experience-demos.js','experience-gallery.js','experience-gallery.css']){
  assert(shell.includes('"'+asset+'"'),'Missing gallery resource in HTML: '+asset);
}
console.log('XR Gallery tests PASS: 12 experiences, 8 offline scripts, 3 pinned runtimes, route links, and isolated previews.');