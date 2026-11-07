/* Self-contained synthetic GLB tests — run node tests/asset-core.mjs */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const code=readFileSync(resolve(root,'asset-core.js'),'utf8');
const win={};
runInNewContext(code,{window:win,TextEncoder,TextDecoder});
const C=win.HUB_ASSET_CORE;
assert(C,'Asset core is initialized');

const align=n=>(n+3)&~3;
const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==','base64'));
const geom=new Uint8Array(36);
new DataView(geom.buffer).setFloat32(0,1,true);
const bin=new Uint8Array(align(geom.length)+align(png.length));
bin.set(geom);bin.set(png,align(geom.length));
const json={asset:{version:'2.0'},buffers:[{byteLength:bin.length}],
  bufferViews:[{buffer:0,byteOffset:0,byteLength:geom.length,target:34962},{buffer:0,byteOffset:align(geom.length),byteLength:png.length}],
  accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3'}],
  meshes:[{primitives:[{attributes:{POSITION:0},mode:4}]}],
  images:[{bufferView:1,mimeType:'image/png',name:'tiny.png'}],textures:[{source:0}],materials:[{}]};
function makeGLB(doc,binary){
  const jd=new TextEncoder().encode(JSON.stringify(doc)),jl=align(jd.length),bl=align(binary.length);
  const bytes=new Uint8Array(12+8+jl+8+bl),view=new DataView(bytes.buffer);
  view.setUint32(0,0x46546c67,true);view.setUint32(4,2,true);view.setUint32(8,bytes.length,true);
  view.setUint32(12,jl,true);view.setUint32(16,0x4e4f534a,true);
  bytes.fill(32,20,20+jl);bytes.set(jd,20);
  const off=20+jl;view.setUint32(off,bl,true);view.setUint32(off+4,0x004e4942,true);
  bytes.set(binary,off+8);return bytes;
}
const src=makeGLB(json,bin),parsed=C.parseGLB(src),report=C.report(parsed);
assert.equal(report.meshCount,1);
assert.equal(report.triangleEstimate,1);
assert.equal(report.imageCount,1);
assert.equal(report.images[0].width,1);
assert.equal(report.images[0].height,1);
assert.equal(report.jsonBytes,new DataView(src.buffer).getUint32(12,true));
assert.equal(C.sourceImages(parsed).length,1);
assert.equal(C.canRepack(parsed).length,0);
const out=C.repack(parsed),reparsed=C.parseGLB(out);
assert.equal(reparsed.json.meshes[0].primitives[0].attributes.POSITION,0);
assert.equal(reparsed.json.buffers[0].byteLength,reparsed.bin.byteLength);
assert.equal(reparsed.json.bufferViews.length,2);
for(let i=0;i<2;i++){
  const before=json.bufferViews[i],after=reparsed.json.bufferViews[i];
  const bytesA=parsed.bin.subarray(before.byteOffset,before.byteOffset+before.byteLength);
  const bytesB=reparsed.bin.subarray(after.byteOffset,after.byteOffset+after.byteLength);
  assert.deepEqual([...bytesA],[...bytesB],'Repacking must preserve raw view data');
}
const replacement=Uint8Array.from(png.slice(0,40));
const imageReplace=C.repack(parsed,new Map([[1,replacement]]));
assert.equal(C.parseGLB(imageReplace).json.bufferViews[1].byteLength,40);
const broken=src.slice();new DataView(broken.buffer).setUint32(8,src.byteLength+7,true);
assert.throws(()=>C.parseGLB(broken),/length/);
const outOfBounds=structuredClone(json);
outOfBounds.bufferViews[0].byteLength=bin.length+100;
assert.throws(()=>C.parseGLB(makeGLB(outOfBounds,bin)),/outside/);
const extended=structuredClone(json);extended.extensionsUsed=['EXT_meshopt_compression'];
assert(C.canRepack(C.parseGLB(makeGLB(extended,bin))).length>0);
assert.throws(()=>C.repack(C.parseGLB(makeGLB(extended,bin))),/Repacking unavailable/);
const external=structuredClone(json);external.images[0]={uri:'https://example.org/texture.png'};
assert(C.canRepack(C.parseGLB(makeGLB(external,bin))).length>0);
console.log('Asset-core tests PASS — GLB header, bounds, PNG metrics, triangle count, lossless repack and extension safeguards.');