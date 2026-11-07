/* Spatial Hub Asset Core v1 — offline GLB 2.0 inspection and guarded repack.
   Specification: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html */
(() => {
  'use strict';
  const MAX_FILE=120*1024*1024,MAX_JSON=16*1024*1024, MAGIC=0x46546c67,JSON_CHUNK=0x4e4f534a,BIN_CHUNK=0x004e4942;
  const align=n=>(n+3)&~3;
  const checked=(ok,text)=>{if(!ok)throw new Error(text);};
  function parseGLB(source){
    const bytes=source instanceof Uint8Array?source:new Uint8Array(source);
    checked(bytes.length>=20&&bytes.length<=MAX_FILE,'File must be a GLB between 20 bytes and 120 MiB.');
    const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    checked(dv.getUint32(0,true)===MAGIC&&dv.getUint32(4,true)===2,'Invalid GLB signature or version (requires GLB v2).');
    checked(dv.getUint32(8,true)===bytes.length,'GLB header length does not match file size.');
    let pos=12, json=null, bin=null, chunks=0;
    while(pos<bytes.length){
      checked(pos+8<=bytes.length,'Truncated GLB chunk header.');
      const length=dv.getUint32(pos,true),type=dv.getUint32(pos+4,true);
      pos+=8;checked(length%4===0&&length<=bytes.length-pos,'Invalid chunk alignment or length.');
      if(chunks===0){
        checked(type===JSON_CHUNK,'First chunk must contain JSON.');
        checked(length<=MAX_JSON,'JSON chunk exceeds 16 MiB safety limit.');
        try{json=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(pos,pos+length)));}catch{throw new Error('GLB JSON cannot be decoded.');}
      } else if(chunks===1&&type===BIN_CHUNK){bin=bytes.subarray(pos,pos+length);}
      else if(type===BIN_CHUNK)throw new Error('Unexpected additional BIN chunk.');
      chunks++;pos+=length;
    }
    checked(chunks>0&&pos===bytes.length&&json&&typeof json==='object','Incomplete GLB structure.');
    checked(/^2\./.test(json.asset?.version||''),'Expected glTF asset version 2.x.');
    const buffers=json.buffers||[],views=json.bufferViews||[];
    if(bin){
      checked(buffers[0]&&!buffers[0].uri,'GLB BIN chunk must be referenced by buffer 0.');
      checked(Number.isSafeInteger(buffers[0].byteLength)&&buffers[0].byteLength>=0&&buffers[0].byteLength<=bin.length&&bin.length-buffers[0].byteLength<=3,'Declared GLB buffer byteLength is invalid.');
    }
    views.forEach((v,i)=>{
      checked(Number.isSafeInteger(v.buffer)&&v.buffer>=0&&v.buffer<buffers.length,'Invalid buffer index in bufferView '+i+'.');
      checked(Number.isSafeInteger(v.byteLength)&&v.byteLength>0,'Invalid length in bufferView '+i+'.');
      const start=v.byteOffset??0;
      checked(Number.isSafeInteger(start)&&start>=0,'Invalid offset in bufferView '+i+'.');
      checked(start+v.byteLength<=buffers[v.buffer].byteLength,'BufferView '+i+' lies outside declared buffer.');
      if(v.buffer===0&&bin)checked(start+v.byteLength<=bin.length,'BufferView '+i+' lies outside BIN chunk.');
    });
    return {json,bin,bytes,chunks,fileSize:bytes.length};
  }
  function jpegSize(bytes){
    if(bytes[0]!==255||bytes[1]!==216)return null;
    let p=2;
    while(p+9<bytes.length){
      if(bytes[p]!==255){p++;continue;}
      let marker=bytes[++p];p++;
      if(marker===255||marker===0||marker===216||marker===217)continue;
      if(p+2>bytes.length)break;
      const len=(bytes[p]<<8)|bytes[p+1];
      if(len<2||p+len>bytes.length)break;
      if([192,193,194,195,198,199,201,202,203,205,206,207].includes(marker)){
        if(len>=7)return {width:(bytes[p+5]<<8)|bytes[p+6],height:(bytes[p+3]<<8)|bytes[p+4]};
      }
      p+=len;
    }
    return null;
  }
  function imageDimensions(bytes,mime){
    if(mime==='image/png'&&bytes.length>24&&bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71){
      const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
      return {width:dv.getUint32(16,false),height:dv.getUint32(20,false)};
    }
    if(mime==='image/jpeg')return jpegSize(bytes);
    return null;
  }
  function report(model){
    const {json,bin,fileSize}=model;
    const meshes=json.meshes||[],images=json.images||[],views=json.bufferViews||[],textures=json.textures||[];
    const primitives=meshes.reduce((n,m)=>n+(m.primitives?.length||0),0);
    let triangleCount=0,vertexReferences=0;
    meshes.forEach(mesh=>(mesh.primitives||[]).forEach(p=>{
      const index=p.indices===undefined?null:json.accessors?.[p.indices];
      const attr=json.accessors?.[p.attributes?.POSITION];
      const n=index?.count??attr?.count??0;
      vertexReferences+=attr?.count||0;
      if((p.mode??4)===4)triangleCount+=Math.floor(n/3);
      else if([5,6].includes(p.mode))triangleCount+=Math.max(0,n-2);
    }));
    const entries=images.map((img,i)=>{
      let encodedBytes=0,dimensions=null,external=false,data=null;
      const v=views[img.bufferView];
      if(v&&v.buffer===0&&bin){
        data=bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength);
        encodedBytes=data.byteLength;dimensions=imageDimensions(data,img.mimeType);
      }else if(img.uri){external=!img.uri.startsWith('data:');}
      return {index:i,name:img.name||('Image '+(i+1)),mime:img.mimeType||(img.uri?.split('.').pop()||'unknown'),encodedBytes,
        width:dimensions?.width||null,height:dimensions?.height||null,bufferView:img.bufferView??null,external,
        rgbaMiB:dimensions?(dimensions.width*dimensions.height*4/1048576):null};
    });
    const totalTextures=entries.reduce((n,e)=>n+e.encodedBytes,0);
    const totalBytes=views.reduce((n,v)=>n+(v.buffer===0?v.byteLength:0),0);
    const bigTextures=entries.filter(x=>x.width>2048||x.height>2048);
    const warnings=[];
    if(!bin)warnings.push('No internal BIN chunk: use a standalone GLB export to enable optimization.');
    if(fileSize>25*1048576)warnings.push('Asset exceeds 25 MiB; consider evaluating download latency on target devices (not a universal limit).');
    if(bigTextures.length)warnings.push(bigTextures.length+' texture(s) exceed 2048 px; examine their necessity on mobile XR targets.');
    if(entries.some(x=>x.external))warnings.push('External texture references found: the asset may not be self-contained.');
    if((json.extensionsUsed||[]).length)warnings.push('glTF extensions present. Automatic repacking is restricted to core glTF without extensions.');
    if(entries.some(x=>x.bufferView!==null&&!x.width))warnings.push('Some embedded textures have unrecognised pixel dimensions; memory estimates will be incomplete.');
    if(!warnings.length)warnings.push('No immediate structural warnings detected. Visual testing and Khronos validation are still recommended.');
    return {fileBytes:fileSize,binBytes:bin?.byteLength||0,jsonBytes:fileSize-(bin?.byteLength||0)-28,meshCount:meshes.length,primitiveCount:primitives,
      triangleEstimate:triangleCount,vertexReferences,materials:(json.materials||[]).length,accessors:(json.accessors||[]).length,
      animationCount:(json.animations||[]).length,textureCount:textures.length,imageCount:images.length,
      images:entries,embeddedTextureBytes:totalTextures,referencedViewBytes:totalBytes,
      rgbaTextureMiB:entries.reduce((n,x)=>n+(x.rgbaMiB||0),0),warnings,extensions:json.extensionsUsed||[]};
  }
  function canRepack(model){
    const {json,bin,chunks}=model,views=json.bufferViews||[],buffers=json.buffers||[];
    const reasons=[];
    if(!bin||chunks!==2)reasons.push('Requires exactly a JSON chunk and one BIN chunk.');
    if((json.extensionsUsed||[]).length||Object.keys(json.extensions||{}).length)reasons.push('Extension-bearing assets are analysis-only to avoid changing extension-specific binary layouts.');
    if(buffers.length!==1||buffers[0]?.uri)reasons.push('Requires one internal GLB buffer without external resources.');
    if(!views.length)reasons.push('No bufferViews are available for repacking.');
    if(views.some(v=>v.buffer!==0))reasons.push('All bufferViews must reference internal buffer zero.');
    if((json.images||[]).some(i=>i.uri&&!(i.uri.startsWith('data:'))))reasons.push('Assets referencing external images cannot be repacked here.');
    if(!Array.isArray(json.images)||!json.images.some(i=>i.bufferView!==undefined))reasons.push('No embedded images found for local texture optimisation.');
    return reasons;
  }
  function repack(model,replacements=new Map()){
    const reasons=canRepack(model);
    checked(!reasons.length,'Repacking unavailable: '+reasons.join(' '));
    const src=model.json, original=model.bin,doc=JSON.parse(JSON.stringify(src)),views=doc.bufferViews;
    const outputPieces=[];
    let cursor=0;
    views.forEach((view,i)=>{
      const old=src.bufferViews[i],content=replacements.get(i)||original.subarray(old.byteOffset||0,(old.byteOffset||0)+old.byteLength);
      checked(content instanceof Uint8Array&&content.byteLength>0,'Missing binary contents for bufferView '+i);
      checked(content.byteLength<=MAX_FILE,'Replacement exceeds safe size limit.');
      view.byteOffset=cursor;view.byteLength=content.byteLength;
      outputPieces.push({offset:cursor,data:content});
      cursor+=align(content.byteLength);
    });
    doc.buffers[0].byteLength=cursor;
    const jsonData=new TextEncoder().encode(JSON.stringify(doc)),jsonLength=align(jsonData.length),binLength=cursor;
    const total=12+8+jsonLength+8+binLength;
    checked(total<=MAX_FILE&&total<=0xffffffff,'Optimized GLB exceeds 120 MiB.');
    const target=new Uint8Array(total);target.fill(32,20,20+jsonLength);
    const dv=new DataView(target.buffer);
    dv.setUint32(0,MAGIC,true);dv.setUint32(4,2,true);dv.setUint32(8,total,true);
    dv.setUint32(12,jsonLength,true);dv.setUint32(16,JSON_CHUNK,true);
    target.set(jsonData,20);
    const binHeader=20+jsonLength;
    dv.setUint32(binHeader,binLength,true);dv.setUint32(binHeader+4,BIN_CHUNK,true);
    for(const part of outputPieces)target.set(part.data,binHeader+8+part.offset);
    // Parse generated bytes immediately so malformed outputs are never offered for download.
    parseGLB(target);
    return target;
  }
  function sourceImages(model){
    const imgs=model.json.images||[],views=model.json.bufferViews||[];
    const referencedByAccessors=new Set();
    (model.json.accessors||[]).forEach(a=>{
      if(a.bufferView!==undefined)referencedByAccessors.add(a.bufferView);
      if(a.sparse?.indices?.bufferView!==undefined)referencedByAccessors.add(a.sparse.indices.bufferView);
      if(a.sparse?.values?.bufferView!==undefined)referencedByAccessors.add(a.sparse.values.bufferView);
    });
    const collected=new Set();
    return imgs.flatMap((img,i)=>{
      const view=views[img.bufferView];
      if(!view||view.buffer!==0||!model.bin||!['image/jpeg','image/png'].includes(img.mimeType)||referencedByAccessors.has(img.bufferView)||collected.has(img.bufferView))return [];
      collected.add(img.bufferView);
      const data=model.bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
      const size=imageDimensions(data,img.mimeType);
      if(!size||!size.width||!size.height||size.width>8192||size.height>8192||data.length>32*1048576)return [];
      return [{index:i,viewIndex:img.bufferView,mime:img.mimeType,bytes:data,width:size.width,height:size.height}];
    });
  }
  window.HUB_ASSET_CORE={parseGLB,report,canRepack,repack,sourceImages,MAX_FILE,align};
})();