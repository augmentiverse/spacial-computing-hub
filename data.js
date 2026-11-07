/* English editorial catalog. Each external reference is an official or primary resource. */
window.HUB_DATA = (() => {
  const T = (id,name,category,level,summary,details,uses,source,tag='Core') => ({id,name,category,level,summary,details,uses,source,tag});
  const technologies = [
    T('spatial','Spatial computing','Foundations','Beginner','Digital content and computation that understand, respond to, or coexist with physical space.','Spatial computing combines 3D interfaces, tracking, sensors, perception, interaction and computation. It can work on phones, headsets, desktops and specialist devices.','Spatial interfaces · education · design review · industrial training','https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API'),
    T('ar','Augmented reality','Immersive reality','Beginner','Adds contextual digital content to a view of the real environment.','AR overlays virtual imagery and, when tracking allows, anchors it to surfaces or real-world positions. Not all AR requires head-worn hardware or full environment mapping.','Product try-on · site interpretation · guided maintenance','https://developers.google.com/ar'),
    T('vr','Virtual reality','Immersive reality','Beginner','Places the user within an interactive simulated environment.','Immersive VR relies on stereoscopic rendering, motion tracking and carefully designed interactions. Comfort, frame rate, locomotion and accessibility are crucial.','Training · simulation · storytelling · visualization','https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API'),
    T('mr','Mixed reality','Immersive reality','Intermediate','Blends tracked physical space with interactive virtual content.','MR commonly includes passthrough or optical see-through views, world understanding, occlusion, hand interaction and spatial anchors. The term may overlap with AR across vendors.','Co-located collaboration · spatial productivity','https://learn.microsoft.com/en-us/windows/mixed-reality/'),
    T('webxr','WebXR Device API','Web runtime','Intermediate','Browser APIs for immersive AR and VR sessions on compatible hardware.','WebXR uses XRSession, XRFrame, reference spaces and related feature modules. Support depends on browser, OS, runtime and device. HTTPS and user-initiated session requests are commonly required.','Browser VR · headset demos · browser-based MR','https://www.w3.org/TR/webxr/','Standard'),
    T('webar','WebAR','Web runtime','Intermediate','AR experiences delivered through links and web pages.','WebAR is a deployment approach, not one API. Implementations may use WebXR immersive-ar, face or image tracking, platform viewers, or camera-driven computer vision.','Campaigns · exhibitions · learning overlays','https://modelviewer.dev/','Approach'),
    T('webgl','WebGL','Rendering','Intermediate','Hardware-accelerated 2D and 3D rendering through the HTML canvas.','WebGL is widely used by Three.js, Babylon.js and A-Frame. It is a graphics API, not a complete XR runtime. WebGL 2 expands capabilities but needs fallback testing.','3D web scenes · data visualization','https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API','Standard'),
    T('webgpu','WebGPU','Rendering','Advanced','Modern web API for graphics and compute workloads on GPUs.','WebGPU provides explicit pipelines and compute capabilities. Availability varies by platform; feature detection and a WebGL fallback remain important for broad access.','High-performance 3D · compute effects','https://www.w3.org/TR/webgpu/','Standard'),
    T('gltf','glTF / GLB','3D assets','Beginner','Open, efficient delivery format for 3D assets and scenes.','glTF 2.0 describes meshes, materials, textures and animations. GLB packages the asset into a binary container. It is typically the preferred shipping format for real-time 3D on the web.','Web assets · model viewers · AR previews','https://www.khronos.org/gltf/','Format'),
    T('usd','OpenUSD / USDZ','3D assets','Intermediate','Scene-description ecosystem for complex 3D composition and interchange.','OpenUSD describes large scenes, layers and variants; USDZ packages assets and is commonly used in Apple AR Quick Look workflows. Conversion quality requires checking materials, animation and coordinate units.','Scene interchange · iOS AR · content pipelines','https://openusd.org/','Format'),
    T('pbr','Physically based rendering','Rendering','Intermediate','Material workflows that approximate real-world light and surfaces.','Metallic-roughness PBR workflows combine base color, normals, roughness, metalness, emissive and environment light. The glTF material model is a useful interoperable baseline.','Realistic materials · consistent asset appearance','https://www.khronos.org/gltf/','Technique'),
    T('tracking','Visual tracking / SLAM','Perception','Advanced','Estimates camera movement and scene structure from sensor observations.','SLAM combines localization and mapping; camera tracking quality depends on lighting, motion, texture, sensors and algorithm choice. Licensing and platform access vary.','World-tracked AR · navigation · mapping','https://developers.google.com/ar/develop/fundamentals','Technique'),
    T('anchors','Spatial anchors / hit testing','Interaction','Advanced','Connect virtual content to surfaces or persistent spatial locations.','Hit testing finds intersections with detected real-world geometry. Anchors stabilize content relative to a tracked environment; persistence and sharing are platform-dependent.','Object placement · persistent scenes','https://immersive-web.github.io/hit-test/','API'),
    T('hands','Hand and controller input','Interaction','Intermediate','Gestures, tracked hands, rays and controller interactions in XR.','Spatial input uses input sources, rays, select/squeeze events and sometimes tracked joints. Design discoverable gestures, accessible alternatives and clear affordances.','Grab · point · manipulate · draw','https://immersive-web.github.io/webxr-hand-input/','Interaction'),
    T('spatial-audio','Spatial audio','Interaction','Intermediate','Sound positioned in 3D to reinforce presence and orientation.','Spatialization uses distance, panning, listener pose and room context. The Web Audio API supports spatial panning; headset delivery benefits from careful gain and comfort design.','Soundscapes · navigational cues · games','https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API','Technique'),
    T('photogrammetry','Photogrammetry','3D capture','Intermediate','Reconstructs surfaces from overlapping photographs.','Capture consistent, well-exposed, overlapping images around a subject. Reconstruction produces meshes and textures that usually need retopology, cleanup and optimization for real-time deployment.','Heritage scanning · products · terrain','https://alicevision.org/','Workflow'),
    T('splats','Gaussian splatting','3D capture','Advanced','Real-time rendering technique using a collection of learned 3D Gaussian primitives.','Splats can present photoreal captured scenes but require specialized pipelines and formats. Compare device memory, draw cost, transparency and collision limitations with triangle meshes.','Captured environments · virtual tours','https://github.com/graphdeco-inria/gaussian-splatting','Technique'),
    T('tiles','3D Tiles / geospatial XR','3D assets','Advanced','Streams large geospatial 3D datasets by spatial hierarchy and level of detail.','3D Tiles organizes massive content including photogrammetry and city-scale geometry. Combine with map coordinate systems and geolocation only when the user value justifies complexity.','Digital twins · city models · terrain','https://www.ogc.org/standard/3dtiles/','Standard'),
    T('access','Accessible immersive design','Foundations','Beginner','Interaction and presentation patterns that include a wider range of abilities.','Provide alternatives to motion-only controls; reduce simulated locomotion, offer captions and contrast, protect from flashing and expose 2D routes alongside immersive ones.','Education · public exhibitions · applications','https://www.w3.org/WAI/','Practice')
  ];
  const F = (id,name,group,pricing,summary,url,tags,featured=false,note='') => ({id,name,group,pricing,summary,url,tags,featured,note});
  const tools = [
    F('three','Three.js','3D engines','Open source','Flexible JavaScript library for rendering interactive 3D scenes.','https://threejs.org/',['3D','WebGL','WebXR'],true),
    F('babylon','Babylon.js','3D engines','Open source','Complete real-time 3D engine with physics, editor ecosystem and WebXR.','https://www.babylonjs.com/',['3D','WebGPU','WebXR'],true),
    F('aframe','A-Frame','WebXR frameworks','Open source','Entity/component framework that makes immersive scenes accessible through HTML.','https://aframe.io/',['HTML','WebXR','VR'],true),
    F('r3f','React Three Fiber','WebXR frameworks','Open source','Declarative React renderer for Three.js scenes and components.','https://r3f.docs.pmnd.rs/',['React','3D','Three.js']),
    F('xrpm','React Three XR','WebXR frameworks','Open source','Immersive session helpers for React Three Fiber.','https://pmndrs.github.io/xr/',['React','WebXR']),
    F('mindar','MindAR','WebAR frameworks','Open source','In-browser image and face tracking with A-Frame / Three.js integrations.','https://hiukim.github.io/mind-ar-js-doc/',['WebAR','Tracking','Free'],true),
    F('8thwall','8th Wall (2026 toolset)','WebAR frameworks','Free / mixed licenses','Self-hostable XR utilities and runtime; hosted cloud editor retired in 2026.','https://8thwall.org/',['WebAR','Tracking','XR'],false,'The distributed SLAM binary is not open source; check its license. No hosted editor service.'),
    F('modelviewer','<model-viewer>','WebAR frameworks','Open source','Accessible web component for GLB viewing and supported AR launch modes.','https://modelviewer.dev/',['WebAR','GLB','Quick Look'],true),
    F('playcanvas','PlayCanvas','3D engines','Open source engine / hosted plans','Web-first 3D engine, visual editor and collaboration ecosystem.','https://playcanvas.com/',['WebGL','WebGPU','Editor']),
    F('wonderland','Wonderland Engine','3D engines','Free tier / commercial','Performance-oriented browser XR engine and authoring workflow.','https://wonderlandengine.com/',['WebXR','Editor','3D']),
    F('unity','Unity','Authoring & capture','Commercial / tiered','Widely used real-time development engine with AR Foundation and XR packages.','https://unity.com/',['AR','VR','Engine']),
    F('unreal','Unreal Engine','Authoring & capture','Commercial / tiered','High-fidelity real-time engine with professional virtual production workflows.','https://www.unrealengine.com/',['VR','Real-time','Engine']),
    F('godot','Godot','3D engines','Open source','General-purpose game engine with XR ecosystem and OpenXR support.','https://godotengine.org/',['OpenXR','Engine','3D']),
    F('blender','Blender','Authoring & capture','Open source','Full 3D suite for modeling, sculpting, animation, UVs, rendering and export.','https://www.blender.org/',['3D','Conversion','Modeling'],true),
    F('meshroom','Meshroom / AliceVision','Authoring & capture','Open source','Photogrammetry pipeline for reconstructing 3D from photographs.','https://alicevision.org/#meshroom',['Scan','Photogrammetry']),
    F('realityscan','RealityScan / RealityCapture','Authoring & capture','Check licensing','Photogrammetry capture and reconstruction from photo sets.','https://www.realityscan.com/',['Scan','Photogrammetry']),
    F('meshlab','MeshLab','Authoring & capture','Open source','Tools to process, edit, clean and inspect 3D triangle meshes.','https://www.meshlab.net/',['Mesh','Cleanup']),
    F('blockbench','Blockbench','Authoring & capture','Open source','Low-poly editor and animation tool, useful for simple lightweight assets.','https://www.blockbench.net/',['Modeling','Low poly']),
    F('spline','Spline','Authoring & capture','Freemium','Browser-based 3D design and interactive scene creation.','https://spline.design/',['Editor','3D']),
    F('gltftransform','glTF Transform','Asset converters','Open source','CLI and SDK for glTF inspection, optimization, transforms and compression.','https://gltf-transform.dev/',['GLB','Optimize','CLI'],true),
    F('gltfpack','gltfpack (meshoptimizer)','Asset converters','Open source','Compact glTF / GLB asset packaging and optimization.','https://github.com/zeux/meshoptimizer',['GLB','Compression','CLI']),
    F('draco','Draco','Asset converters','Open source','Compresses and decompresses triangle meshes and point clouds.','https://github.com/google/draco',['Compression','Mesh']),
    F('ktx','Khronos KTX-Software','Asset converters','Open source','Texture container tooling, including GPU-friendly KTX2 workflows.','https://github.com/KhronosGroup/KTX-Software',['KTX2','Texture','CLI']),
    F('basis','Basis Universal','Asset converters','Open source','Supercompressed GPU texture data and encoding tools.','https://github.com/BinomialLLC/basis_universal',['Texture','Compression']),
    F('ffmpeg','FFmpeg','Asset converters','Open source','Swiss-army knife for transcoding 360 video, audio and texture footage.','https://ffmpeg.org/',['Video','Audio','CLI']),
    F('usdz','USD tools / usdzip','Asset converters','Open source tooling','OpenUSD utilities for inspecting and packaging USD-based assets.','https://openusd.org/release/toolset.html',['USD','USDZ','CLI']),
    F('obj2gltf','obj2gltf','Asset converters','Open source','Converts OBJ meshes to glTF assets for web runtimes.','https://github.com/CesiumGS/obj2gltf',['OBJ','glTF','CLI']),
    F('gltfvalidator','glTF Validator','Asset validators','Open source','Khronos reference validation of glTF structure and extensions.','https://github.com/KhronosGroup/glTF-Validator',['GLB','Validation']),
    F('gltfviewer','Khronos glTF Sample Viewer','Asset validators','Open source','Reference sample viewer for comparing PBR model appearance.','https://github.khronos.org/glTF-Sample-Viewer-Release/',['GLB','PBR','Viewer']),
    F('spector','Spector.js','Debug & test','Open source','Captures and inspects WebGL frames, draw calls and rendering state.','https://spector.babylonjs.com/',['WebGL','Debug']),
    F('webxr-samples','Immersive Web Samples','Debug & test','Open source','Reference sample experiences for sessions, hit tests, anchors and more.','https://immersive-web.github.io/webxr-samples/',['WebXR','Samples']),
    F('chrome','Chrome DevTools','Debug & test','Free','Profiling, source debugging, device emulation and graphics troubleshooting.','https://developer.chrome.com/docs/devtools/',['Browser','Debug']),
    F('inspector','Three.js Editor','Authoring & capture','Open source','Scene editing and examples for experimenting with Three.js objects.','https://threejs.org/editor/',['3D','Editor']),
    F('meta-iwsdk','Meta Immersive Web SDK','WebXR frameworks','Open source SDK','Toolkit and development workflow for immersive Meta browser experiences.','https://developers.meta.com/vr/documentation/web/webxr-overview/',['WebXR','Quest']),
    F('iwer','IWER / WebXR emulator','Debug & test','Open source tooling','Emulated browser XR workflows for development without wearing a headset.','https://github.com/meta-quest/immersive-web-emulation-runtime',['WebXR','Emulation']),
    F('cesium','CesiumJS','3D engines','Open source','Globe and geospatial 3D application framework with 3D Tiles.','https://cesium.com/platform/cesiumjs/',['Geospatial','3D Tiles']),
    F('arcgis','ArcGIS Maps SDK for JavaScript','3D engines','Commercial / tiered','2D and 3D geospatial web scenes and data visualization.','https://developers.arcgis.com/javascript/latest/',['Maps','3D']),
    F('web-audio','Web Audio API','Debug & test','Open web standard','Browser-native audio graph and 3D positional audio primitives.','https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',['Audio','Spatial']),
    F('excalidraw','Excalidraw','Authoring & capture','Open source','Rapid sketching and collaborative visual planning for immersive interactions.','https://excalidraw.com/',['Planning','UX'])
  ];
  // Additional verified tools and platform-specific workflows.
  tools.push(
    F('arjs','AR.js','WebAR frameworks','Open source','Browser marker, image and location-based AR examples; compare maintained components.','https://github.com/AR-js-org/AR.js',['WebAR','Markers','Tracking']),
    F('locar','LocAR.js','WebAR frameworks','Open source','Location-based AR library spun out of AR.js, intended for Three.js applications.','https://github.com/AR-js-org/locar.js',['Location','WebAR','GPS']),
    F('zapworks','Zappar / Zapworks','WebAR frameworks','Commercial / tiered','WebAR distribution and SDK ecosystem with image and world-tracking workflows.','https://zap.works/',['WebAR','Tracking','Authoring']),
    F('artoolkitx','artoolkitX','WebAR frameworks','Open source','Cross-platform AR tracking toolkit carrying the ARToolKit legacy.','https://www.artoolkitx.org/',['AR','Tracking','Markers']),
    F('realitykit','Apple RealityKit','3D engines','Platform SDK','Apple spatial rendering and interaction framework for visionOS and iOS applications.','https://developer.apple.com/augmented-reality/realitykit/',['visionOS','AR','Native']),
    F('arkit','Apple ARKit','WebAR frameworks','Platform SDK','Apple native AR tracking, image anchoring and environment understanding APIs.','https://developer.apple.com/augmented-reality/arkit/',['iOS','AR','Tracking']),
    F('arcore','Google ARCore','WebAR frameworks','Platform SDK','Android AR platform APIs and environment understanding services.','https://developers.google.com/ar',['Android','AR','Tracking']),
    F('sceneviewer','Google Scene Viewer','Asset validators','Free platform viewer','Launches supported Android AR model viewing workflows from the browser.','https://developers.google.com/ar/develop/scene-viewer',['Android','AR','GLB']),
    F('quicklook','Apple AR Quick Look','Asset validators','Free platform viewer','Native preview and placement of USDZ or Reality files on supported Apple devices.','https://developer.apple.com/documentation/arkit/previewing-a-model-with-ar-quick-look',['iOS','AR','USDZ']),
    F('lensstudio','Snap Lens Studio','Authoring & capture','Free / platform terms','Authoring environment for interactive camera-based AR Lenses.','https://ar.snap.com/lens-studio',['AR','Face','Editor']),
    F('sketchfab','Sketchfab','Authoring & capture','Freemium','3D model publishing and interactive embedded model viewing.','https://sketchfab.com/',['3D','Assets','Viewer']),
    F('polyhaven','Poly Haven','Authoring & capture','Free / CC0 assets','Public-domain HDR environments, textures and models for practice and production.','https://polyhaven.com/',['Textures','HDRI','Assets']),
    F('openbrush','Open Brush','Authoring & capture','Open source','Immersive 3D painting and spatial illustration toolkit.','https://openbrush.app/',['VR','Painting','Creative']),
    F('gltfassetgen','glTF Asset Generator','Asset validators','Open source','Khronos test assets for validating glTF implementation edge cases.','https://github.com/KhronosGroup/glTF-Asset-Generator',['glTF','Testing','Assets']),
    F('webxrprofiles','WebXR Input Profiles','Debug & test','Open source','Device input profile assets and tooling for consistent controller representation.','https://github.com/immersive-web/webxr-input-profiles',['WebXR','Input','Controllers'])
  );
  const S=(name,org,topic,summary,url,level='Primary specification')=>({name,org,topic,summary,url,level});
  const standards=[
    S('XR Accessibility User Requirements','W3C WAI','Accessibility','Research-based user needs for multimodal accessible immersive XR.','https://www.w3.org/TR/xaur/','W3C Working Group Note'),
    S('WebXR Rendering Guide','Mozilla / MDN','WebXR','Frame callbacks, per-eye rendering and timing guidance.','https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Rendering','Developer reference'),
    S('model-viewer AR examples','Google / model-viewer project','WebAR','Comparison of WebXR, Scene Viewer and Quick Look AR entry points.','https://modelviewer.dev/examples/augmentedreality/','Official examples'),
    S('Three.js PerspectiveCamera','Three.js','Graphics','Vertical field of view and perspective-camera parameters.','https://threejs.org/docs/pages/PerspectiveCamera.html','Official API documentation'),
    S('WebXR Device API','W3C','WebXR','Immersive XR sessions, reference spaces, inputs and frame scheduling.','https://www.w3.org/TR/webxr/'),
    S('WebXR Augmented Reality Module','W3C / Immersive Web','WebXR','AR-specific immersive session definitions.','https://immersive-web.github.io/webxr-ar-module/','Editor draft'),
    S('WebXR Hit Test','W3C / Immersive Web','WebXR','Ray-based hit testing against real-world features.','https://immersive-web.github.io/hit-test/','Editor draft'),
    S('WebXR Hand Input','W3C / Immersive Web','WebXR','Hand joint pose data associated with XR input sources.','https://immersive-web.github.io/webxr-hand-input/','Editor draft'),
    S('WebXR Layers API','W3C / Immersive Web','WebXR','Optimized compositing layers for immersive XR rendering.','https://immersive-web.github.io/layers/','Editor draft'),
    S('OpenXR','Khronos Group','XR runtimes','Cross-platform native API for VR and AR runtimes and hardware.','https://www.khronos.org/openxr/'),
    S('glTF 2.0','Khronos Group','3D formats','Runtime asset exchange specification for scenes, meshes and materials.','https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html'),
    S('OpenUSD','Alliance for OpenUSD','3D formats','Extensible scene description, composition and interchange ecosystem.','https://openusd.org/release/index.html','Primary documentation'),
    S('WebGPU','W3C','Graphics','Modern web graphics/compute programming model.','https://www.w3.org/TR/webgpu/'),
    S('WebGL 2.0','Khronos Group','Graphics','Browser graphics API based on OpenGL ES 3.0.','https://registry.khronos.org/webgl/specs/latest/2.0/'),
    S('KTX 2.0','Khronos Group','3D formats','GPU texture container with compressed texture delivery workflows.','https://registry.khronos.org/KTX/specs/2.0/ktxspec.v2.html'),
    S('3D Tiles','Open Geospatial Consortium','Geospatial','Spatial streaming standard for very large 3D geospatial scenes.','https://www.ogc.org/standard/3dtiles/'),
    S('Web Audio API','W3C','Audio','Audio processing graph, spatial panner and listener interfaces.','https://www.w3.org/TR/webaudio/'),
    S('WCAG 2.2','W3C WAI','Accessibility','Web content accessibility success criteria used as a foundation for XR interfaces.','https://www.w3.org/TR/WCAG22/'),
    S('MDN WebXR Guide','Mozilla / MDN','WebXR','Practical overview and browser compatibility notes.','https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API','Developer reference'),
    S('WebXR Samples','Immersive Web Community','WebXR','Runnable API demos backed by source code.','https://immersive-web.github.io/webxr-samples/','Runnable examples'),
    S('WebXR tutorial (2026)','Meta','WebXR','Stepwise headset-ready introductory project.','https://developers.meta.com/vr/documentation/web/webxr-first-steps/','Developer tutorial')
  ];
  const C=(input,output,method,tools,detail,command='')=>({input,output,method,tools,detail,command});
  const conversions=[
    C('OBJ + textures','GLB / glTF','CLI or GUI','Blender · obj2gltf','Export geometry and textures; verify material and coordinate conversion.','npx obj2gltf -i scene.obj -o scene.gltf'),
    C('FBX','GLB / glTF','GUI','Blender','Import, check materials and bone animation, then export as glTF 2.0.'),
    C('GLB / glTF','Optimized GLB','CLI','glTF Transform · gltfpack','Optimize geometry and textures; validate appearance and target compatibility.','gltf-transform optimize input.glb output.glb --compress draco --texture-compress webp'),
    C('GLB / glTF','USDZ','GUI / tooling','Blender · OpenUSD tools','Use an export workflow with verified USDZ support; test on target Apple devices.'),
    C('USD / USDA / USDC','USDZ','CLI','OpenUSD usdzip','Package compatible USD assets and external dependencies into an archive.','usdzip scene.usdz scene.usd'),
    C('PNG / JPEG','WebP','In browser','Spatial Hub Image Lab','Convert images locally in this portal using the browser canvas encoder.'),
    C('PNG / JPEG / WebP','PNG or JPEG','In browser','Spatial Hub Image Lab','Choose output format and quality, then download without uploading.'),
    C('PNG / JPEG','KTX2','CLI','KTX-Software · Basis Universal','Use tokTX / texture compressors; benchmark on your rendering target.'),
    C('360° video','Web-friendly video','CLI','FFmpeg','Encode appropriate video tracks and profiles, then evaluate device performance.','ffmpeg -i input.mp4 -c:v libx264 -crf 24 -preset medium -c:a aac output.mp4'),
    C('Image sequence','Photogrammetry mesh','Desktop app','Meshroom · RealityScan','Capture photos with sufficient overlap, reconstruct and optimize the mesh.'),
    C('glTF JSON','Readable JSON','In browser','Spatial Hub JSON Lab','Validate, indent or minify a JSON document locally.'),
    C('GLB / glTF','Asset inspection','In browser','Spatial Hub GLB Inspector','Read geometry container metadata and scene counts without uploading. No geometry modification.')
  ];
  const D=(id,title,area,level,minutes,lead,why,steps,tips,source,code='')=>({id,title,area,level,minutes,lead,why,steps,tips,source,code});
  const docs=[
    D('intro','What is spatial computing?','Foundations','Beginner',8,'A mental model for spatial interfaces and their relationship with AR, VR and 3D.','Spatial computing is a field, while AR and VR are types of experiences, and WebXR is a browser interface for compatible immersive hardware.',[
      'Identify the physical space, digital objects, input modalities and output devices in an experience.',
      'Separate 3D content authoring from runtime interaction and headset/browser support.',
      'Design a usable non-immersive fallback where possible.'
    ],['3D does not automatically mean VR.','A headset is not required for every spatial-computing experience.'],'https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API'),
    D('choose','Choose the right delivery stack','Foundations','Beginner',10,'Compare WebGL, WebGPU, WebXR, native OpenXR and model viewers.','Choose the runtime based on the intended devices and interactions before selecting tools.',[
      'For interactive browser 3D, start with Three.js, Babylon.js or PlayCanvas.',
      'For immersive VR on supported browsers, use WebXR with feature detection.',
      'For simple object-in-room AR, evaluate <model-viewer> and device-native launch options.',
      'For specialized native apps, compare OpenXR and the target platform SDK.'
    ],['WebAR is a distribution method, not a universal browser capability.','Verify real devices instead of trusting a desktop emulator alone.'],'https://modelviewer.dev/'),
    D('first-scene','Your first 3D scene','Web 3D','Beginner',15,'A tiny scene teaches camera placement, lights, geometry and frame updates.','Every web 3D app combines a scene graph, camera, rendering canvas and an animation/update loop.',[
      'Create a page with a drawing surface or engine renderer.',
      'Add a cube or sphere, position a perspective camera and light the object.',
      'Animate rotation using elapsed time and inspect the scene on mobile.',
      'Move to the Playground to edit an example and observe the effect.'
    ],['Keep geometry small for beginner demos.','Use requestAnimationFrame for animation instead of blocking loops.'],'https://threejs.org/manual/#en/creating-a-scene',`// Three.js concept: scene + camera + renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
// See the runnable template in Playground.`),
    D('xr-lifecycle','WebXR session lifecycle','WebXR','Intermediate',16,'Discover runtime support and manage immersive sessions responsibly.','The WebXR Device API exposes XRSystem and XRSession. Session support differs from API existence.',[
      'Require HTTPS (or a trustworthy local origin) before attempting immersive requests.',
      'Check navigator.xr and call isSessionSupported for immersive-vr or immersive-ar.',
      'Create a session from a visible, user-initiated button and request only the features needed.',
      'Use XR reference spaces and XRFrame updates while the session is active.',
      'Handle session end and provide a normal-page alternative.'
    ],['Avoid user-agent sniffing.','An emulator is not a substitute for headset or phone testing.'],'https://www.w3.org/TR/webxr/',`if ('xr' in navigator) {
  const canVR = await navigator.xr.isSessionSupported('immersive-vr');
  console.log('Immersive VR available:', canVR);
}`),
    D('webar-guide','WebAR without an app','WebAR','Beginner',14,'A practical survey of tracked AR, image targets and 3D product viewers.','WebAR solutions vary between platform viewers, immersive browser AR and custom camera-based tracking.',[
      'For a single object, test a GLB using <model-viewer> first.',
      'For image-target overlays, compare MindAR or 8th Wall capabilities and licenses.',
      'Test camera permissions, tracking quality and target device compatibility.',
      'Give users a clear fallback if AR is unavailable.'
    ],['iOS Quick Look may need a USDZ workflow.','Be transparent about camera permissions.'],'https://modelviewer.dev/docs/index.html'),
    D('model-pipeline','Build a reliable 3D asset pipeline','3D assets','Intermediate',18,'From Blender or scanned content to dependable, lightweight GLB delivery.','Bottlenecks often come from large textures, too many draw calls or mismatched units rather than just polygon count.',[
      'Normalize model scale, pivot and coordinate orientation.',
      'Remove hidden geometry, fix normals and unwrap materials deliberately.',
      'Export glTF / GLB and validate with the Khronos glTF Validator.',
      'Inspect size, textures and material appearance in a reference viewer.',
      'Try optimization and compare visual quality after compression.'
    ],['Keep an editable source file as well as optimized web exports.','Compress without erasing surface detail needed for learning.'],'https://gltf-transform.dev/'),
    D('formats','GLB, glTF, OBJ, FBX and USDZ','3D assets','Beginner',12,'Learn what each common format carries and when to convert.','Choosing the right interchange or delivery format avoids unnecessary conversion cycles.',[
      'Use glTF / GLB to ship a real-time asset on the web.',
      'Use OBJ primarily for simple mesh geometry exchange; material exchange is limited.',
      'Treat FBX as a DCC interchange format with tool-specific behaviors.',
      'Use USD and USDZ for compatible composition and Apple AR pipelines.',
      'Check animation, textures, units and licensing after conversion.'
    ],['Not all material features survive conversion.','A file extension alone does not prove interoperability.'],'https://www.khronos.org/gltf/'),
    D('materials','PBR materials and textures','Rendering','Intermediate',14,'Understand roughness, metallic surfaces, normal maps and texture packing.','Material definitions must align with the target runtime and lighting environment.',[
      'Start with a base color texture and correct color-space treatment.',
      'Add normal, metallic-roughness and occlusion only when they improve the result.',
      'Use an HDR environment or deliberate light rig for realistic inspection.',
      'Prefer mobile-friendly texture resolutions and test KTX2 where supported.'
    ],['Use sRGB for color textures, and linear treatment for data maps where appropriate.','Check transparency ordering on real devices.'],'https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html'),
    D('performance','XR performance and comfort','Performance','Intermediate',15,'Build for consistent motion, readable text and comfortable movement.','Late frames and unnatural locomotion reduce immersion and can cause discomfort.',[
      'Profile frame time on the actual target headset or phone.',
      'Reduce draw calls, geometry complexity and texture memory.',
      'Minimize unnecessary work per XR frame and avoid background work on the main thread.',
      'Offer snap turning, teleportation, seated options and clear visual targets.'
    ],['Avoid promising one universal frame-rate target.','Measure device thermal behavior during longer sessions.'],'https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Performance'),
    D('accessibility','Accessible XR by design','Human factors','Beginner',12,'Build inclusive paths beyond head-tracked interactions.','Accessible immersive content is more than accessible HTML: spatial focus, movement, audio, contrast and alternatives matter.',[
      'Keep keyboard or pointer access for the non-immersive site.',
      'Use captions and text alternatives for meaningful sound.',
      'Offer low-motion and seated experiences wherever possible.',
      'Explain permissions and provide visible control labels.'
    ],['Never rely on color alone.','Test with assistive technology on the surrounding web UI.'],'https://www.w3.org/WAI/'),
    D('capture','Photogrammetry and Gaussian splats','Capture','Intermediate',17,'Explore two different representations of captured environments.','Photogrammetry generates mesh assets; Gaussian splatting reconstructs a view-dependent radiance representation.',[
      'Collect overlapping, sharp photos and avoid reflective/translucent surfaces when possible.',
      'Reconstruct, align and evaluate the capture before optimizing.',
      'Choose a mesh for interaction, physics and broad interchange.',
      'Consider splats for view quality but verify runtime size and device support.'
    ],['A photoreal scene is not necessarily a physically interactive scene.','Check privacy rights before scanning people or private spaces.'],'https://alicevision.org/'),
    D('deployment','Ship, measure and maintain','Production','Intermediate',13,'Release a static WebXR experience with clear fallbacks and versioned assets.','Good deployment combines secure hosting, feature detection, asset caching and on-device QA.',[
      'Serve the site over HTTPS and avoid mixed-content dependencies.',
      'Use versioned library URLs and license-compatible assets.',
      'Test unsupported browsers, missing cameras and denied permissions.',
      'Track regressions with a documented device compatibility matrix.',
      'Publish sources, credits and a visible last-reviewed date.'
    ],['Use a content security policy suited to your real dependencies.','Never collect camera frames or sensor data without explicit justification.'],'https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API')
  ];
  docs.push(
    D('image-targets','Image targets and marker tracking','WebAR','Intermediate',17,'Place contextual content over recognisable posters, artwork or printed pages.','Image tracking uses a visual target to estimate relative camera pose. It differs from marker tracking, which often recognizes a deliberately designed symbol.',[
      'Start with a high-contrast target with varied local features; avoid repetitive patterns and reflections.',
      'Choose a framework supporting your target mode: MindAR for image or face tracking; AR.js for markers; check 8th Wall licenses.',
      'Generate the tool-specific target data, then anchor a small 3D object to the detected reference.',
      'Evaluate tracking under changing light and camera angles on several devices.',
      'Keep a static explanatory fallback available when the camera or target tracking fails.'
    ],['Only ask for camera permission when the user deliberately opens the experience.','Do not reuse protected artworks or targets without reviewing relevant rights.'],'https://hiukim.github.io/mind-ar-js-doc/'),
    D('geospatial','Location-based AR and geospatial scenes','Geospatial','Intermediate',18,'Decide when map coordinates, device position and spatial tracking add real user value.','Location-based AR can use GPS, compass/orientation and georeferenced scenes, while persistent fine alignment may require additional platform capabilities.',[
      'Choose between a geolocated marker, a map-based 3D scene and a precisely anchored AR overlay.',
      'Understand that GPS accuracy varies with signal, buildings and device conditions.',
      'Use LocAR.js or established mapping engines for location-aware web prototypes.',
      'Request geolocation explicitly and explain how location is used.',
      'Provide map and text alternatives for visitors without compatible devices.'
    ],['Geolocation is not the same as visual positioning or centimeter-accurate tracking.','Avoid collecting precise location when a rough place is sufficient.'],'https://github.com/AR-js-org/locar.js'),
    D('immersive-media','360° images, video and spatial storytelling','Media','Beginner',15,'Use panoramic media deliberately: a 360 viewer is not necessarily interactive VR.','Equirectangular images and video can surround a viewer in all directions, but often lack six-degree-of-freedom positional exploration.',[
      'Choose a panoramic source with appropriate projection, resolution and usage rights.',
      'Optimize media dimensions and codec for target network and device decoding.',
      'Use a sphere/inverted skybox or a video texture in a compatible rendering engine.',
      'Add wayfinding hotspots, captions, non-immersive playback and accessible navigation.'
    ],['A 360 photo is usually a fixed viewpoint, not a navigable 3D reconstruction.','Autoplay, audio policies and video texture support vary by browser.'],'https://aframe.io/docs/1.7.0/primitives/a-videosphere.html'),
    D('graphics-apis','WebGL vs WebGPU: choosing a renderer','Rendering','Intermediate',16,'Know what a graphics API provides and what a 3D engine adds.','WebGL has broad maturity across rendering libraries. WebGPU introduces newer graphics and compute APIs but needs capability checks and suitable fallbacks.',[
      'Establish the audience devices, browser versions and minimum feature requirements.',
      'Use an engine for scene graphs, materials and runtime management unless writing a renderer is the actual goal.',
      'Test both API presence and usable renderer/adapter availability.',
      'Measure performance on target hardware rather than assuming newer APIs are always faster.'
    ],['WebGPU is not a replacement for the WebXR session lifecycle.','Fallbacks are product requirements, not failure cases.'],'https://www.w3.org/TR/webgpu/'),
    D('privacy','Privacy, permissions and security in XR','Human factors','Intermediate',15,'Protect visitor trust when using cameras, location, microphones and spatial sensors.','XR experiences may expose sensitive context about a user’s physical environment. Good security and privacy design starts by minimizing requested capabilities.',[
      'Run immersive experiences over HTTPS and version trusted dependencies.',
      'Request camera, microphone or location only in context and with a clear user benefit.',
      'Do not store raw imagery, voice or spatial maps unless truly necessary and disclosed.',
      'Keep experimental custom code isolated and never grant untrusted previews broad origin privileges.',
      'Explain permission-denied behavior and support deletion if information is stored.'
    ],['This portal does not upload files during its local format tools.','A sandbox iframe is a defense-in-depth layer, not a guarantee against every risk.'],'https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Permissions_and_security'),
    D('interaction-design','Designing usable spatial interactions','Human factors','Beginner',14,'Give users clear feedback for gazing, pointing, selecting, grabbing and moving.','Spatial interface patterns must balance natural interaction with discoverability, precision, comfort and device differences.',[
      'Define an input hierarchy for controllers, hands, mouse, touch and keyboard.',
      'Use stable targets, selection feedback and clear confirmation states.',
      'Keep important controls within a comfortable visual and physical range.',
      'Provide simple locomotion, undo and recenter options.',
      'Offer 2D equivalents and low-motion alternatives where feasible.'
    ],['Large hit targets and forgiving gestures matter more than flashy effects.','Validate with beginners, not just experienced headset users.'],'https://www.w3.org/WAI/')
  );
// Workbench companion guides — English edition, source-linked and device-aware.
  docs.push(
    D('coordinates-matrices','3D coordinates, rotations and camera projection','Web 3D','Beginner',14,'Make sense of X/Y/Z axes, local space, world space, orientation and perspective.','A scene graph tracks objects using nested transformations. A perspective camera transforms 3D coordinates into a 2D image, where apparent size depends on distance and field of view.',[
      'Identify the scene’s axis convention and its unit scale before editing meshes.',
      'Distinguish local coordinates from world coordinates: rotating a parent moves its descendants in world space.',
      'Use yaw, pitch and roll to describe orientation around axes, noting that the order of rotations matters.',
      'Adjust vertical field of view and camera distance in the Spatial Workbench and compare how the cube appears.',
      'Use a proper matrix/quaternion library for production transforms, especially with nested rotations.'
    ],['Perspective projection is not the same as physically calibrated headset optics.','Avoid mixing degrees and radians in custom math.','Keep meaningful numeric measurements and text alternatives alongside a visual 3D explanation.'],'https://threejs.org/docs/pages/PerspectiveCamera.html'),
    D('xr-frame-budget','Stereo rendering and practical XR frame budgets','Performance','Intermediate',16,'Estimate the scale of a stereo render workload before measuring on hardware.','A display with refresh rate R provides approximately 1000/R milliseconds per displayed frame. Stereo rendering may involve two eyes at substantial resolution, but pixel counts alone cannot predict GPU performance.',[
      'Choose a target headset, runtime and refresh rate instead of assuming one universal XR target.',
      'Record the render-target width and height per eye; do not confuse panel resolution with renderer allocation.',
      'Multiply width × height × number of views × linear scale² to estimate shaded output pixels.',
      'Compare several scale values in the Workbench; record the corresponding frame-time budget.',
      'Profile frame timings, GPU load, overheating, draw calls, material cost and interaction latency on the actual device.'
    ],['The calculations in this portal are estimates, not device benchmarks.','Refresh rate is a target, not proof that the application can sustain it.','Motion comfort and visual quality must be balanced using real-device tests.'],'https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Rendering'),
    D('ar-world-scale','Plan believable real-world scale for AR objects','WebAR','Beginner',13,'Convert a measured model dimension into a uniform real-world scale multiplier.','An AR preview is convincing only if object dimensions, axes, placement and user expectations agree. glTF uses meters for linear measurements; incorrect authoring scale or transform metadata can still produce surprising results.',[
      'Choose a known physical dimension, such as the height of an exhibit object in centimeters.',
      'Inspect the source asset’s axis-aligned bounding dimensions in Blender or a trusted viewer.',
      'Convert the target centimeters into meters, then divide target height by original model height.',
      'Apply a uniform multiplier and verify all resulting dimensions in the Workbench.',
      'Test with a floor or surface reference on the actual target platform; verify pivot, orientation and AR scaling controls.'
    ],['Uniform scaling preserves proportions only when the source geometry proportions are correct.','Check that a pivot centered in the wrong place is not causing floating or buried placement.','Some AR viewers allow visitors to resize an object; communicate the distinction between life-size and illustrative scale.'],'https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html'),
    D('webar-delivery-modes','WebAR launch paths: WebXR, Scene Viewer and Quick Look','WebAR','Intermediate',17,'Understand why one AR button can lead to different runtimes on different devices.','The <model-viewer> web component can prioritize in-browser WebXR and external Android or Apple viewers. These pathways have different UI customization, model-delivery and compatibility behavior.',[
      'Create a valid, web-optimized GLB model and an ordinary interactive 3D fallback.',
      'Test a <model-viewer> element with ar and camera-controls over HTTPS.',
      'Evaluate ar-modes choices such as webxr, scene-viewer and quick-look on supported hardware.',
      'For iOS Quick Look, test whether generated USDZ meets your content needs or an explicit file is required.',
      'Document when an experience remains inside the page and when a native viewer takes over.'
    ],['Do not promise universal AR support or camera tracking on every browser.','Confirm how the AR viewer handles animation, scaling and custom HTML overlays.','Provide an understandable failure message and link back to ordinary 3D viewing.'],'https://modelviewer.dev/examples/augmentedreality/'),
    D('inclusive-xr','Accessible XR: multimodal interaction and comfort','Human factors','Intermediate',15,'Turn accessibility requirements into concrete choices for interactive spatial experiences.','Inclusive XR requires more than WCAG-compliant surrounding webpages. Users may need motion-independent interaction, alternate navigation, captions, contrast controls and readable spatial landmarks.',[
      'Give every core action an accessible route that does not require one specific body gesture.',
      'Support mouse, touch or keyboard alternatives when the immersive capability is unavailable.',
      'Provide captions, text descriptions and alternatives for spatial audio cues.',
      'Avoid forced locomotion, uncontrolled flashing and excessive head movement; offer recenter or exit controls.',
      'Evaluate the experience with relevant assistive technologies and users; verify that critical information is not conveyed by color alone.'
    ],['A 2D fallback can be the best route to critical educational content.','Respect reduced-motion settings and make high-contrast labels readable against moving scenes.','Accessibility testing must include actual task completion, not only automated scans.'],'https://www.w3.org/TR/xaur/'),
    D('webxr-readiness','Launch readiness: secure origin, permissions and fallback','WebXR','Intermediate',12,'Build a practical go/no-go checklist for publishing immersive browser applications.','WebXR support depends on secure context, browser implementation, runtime, device and requested features. Permission and consent requirements also apply to potentially sensitive spatial data.',[
      'Deploy over HTTPS or use a trusted localhost development origin.',
      'Check navigator.xr and isSessionSupported for the requested immersive mode; handle failure without blocking core content.',
      'Request immersive sessions only after a clear user gesture and request minimal optional features.',
      'Provide a visible exit and a non-immersive alternative when spatial tracking is unavailable.',
      'Test device and runtime combinations, explain any sensitive permissions and revalidate after updates.'
    ],['Do not confuse detecting navigator.xr with proving immersive-ar support.','Camera permissions and world tracking require clear user trust boundaries.','Record your tested browser/runtime versions alongside publishing dates.'],'https://www.w3.org/TR/webxr/')
  );
    const P=(id,name,level,duration,summary,color,lessonIds,outcomes)=>({id,name,level,duration,summary,color,lessonIds,outcomes});
  const paths=[
    P('first','Foundations of the Spatial Web','Beginner','~45 min','Understand the landscape and create your first interactive scene.','cyan',['intro','choose','first-scene','formats'],['Know how AR, VR and WebXR differ','Run an editable 3D scene','Select an appropriate output format']),
    P('creator','WebAR Creator','Beginner to intermediate','~55 min','From a 3D object to a device-friendly web-based AR experience.','violet',['webar-guide','model-pipeline','formats','materials'],['Prepare a GLB asset','Understand supported AR launch modes','Validate a simple delivery pipeline']),
    P('engineer','WebXR Developer','Intermediate','~60 min','Investigate the immersive browser runtime and production constraints.','blue',['xr-lifecycle','first-scene','performance','deployment'],['Detect immersive support','Understand session lifecycle','Apply real-device performance checks']),
    P('spatial-lab','Spatial Workbench: Camera, Performance & Scale','Beginner to intermediate','~70 min','Connect camera projection, stereo rendering budgets and AR scale mathematics to hands-on browser simulations.','blue',['coordinates-matrices','xr-frame-budget','ar-world-scale','webar-delivery-modes','webxr-readiness'],['Experiment with camera orientation and field of view','Estimate stereo pixel cost','Compute a uniform AR scale factor','Plan realistic supported-device fallbacks']),
    P('heritage','3D Capture & Digital Heritage','Intermediate','~70 min','Create and optimize captured spaces for research, museums and education.','amber',['capture','model-pipeline','materials','accessibility'],['Select mesh or splat representation','Inspect asset size and structure','Plan accessible cultural experiences'])
  ];
  const G=(word,definition)=>({word,definition});
  const glossary=[
    G('Camera distance','Distance between the projection viewpoint and an object; influences its apparent size under perspective.'),
    G('Projection matrix','Transformation used to map camera-space geometry into normalized screen coordinates.'),
    G('Yaw / pitch / roll','Angular rotations used to describe orientation; conventions and rotation order matter.'),
    G('Stereo view','One of the separate viewpoints rendered for left-eye and right-eye immersive displays.'),
    G('Render scale','Linear scaling of target render dimensions; a scale of 2 makes the pixel area four times as large.'),
    G('World scale','The physical-size interpretation of a 3D asset placed in a tracked environment.'),
    G('6DoF','Six degrees of freedom: tracked position (x, y, z) and rotation (yaw, pitch, roll).'),
    G('Anchor','A tracked coordinate relationship used to keep virtual content stable relative to the world.'),
    G('AR','Augmented reality: digital content combined with a view of the real world.'),
    G('ARCore','Google’s platform services and SDKs for AR on supported devices.'),
    G('ARKit','Apple’s AR development framework for supported Apple devices.'),
    G('Asset pipeline','Steps from source creation through validation and optimized runtime delivery.'),
    G('Baked lighting','Lighting information precomputed into textures or vertex data to reduce runtime cost.'),
    G('Barycentric coordinates','Weights locating a point relative to a triangle’s vertices.'),
    G('Binocular disparity','The difference in the images seen by each eye, used as a depth cue.'),
    G('Culling','Skipping objects or surfaces that should not be drawn.'),
    G('Draw call','A request sent to the graphics API to draw geometry; excessive calls can hurt performance.'),
    G('Environment map','An image or texture used to simulate the surrounding lighting and reflections.'),
    G('Field of view (FOV)','Angular extent of the visible scene.'),
    G('Frame time','Time required to render one displayed frame; lower is generally better.'),
    G('glTF','Open transmission format for 3D models, scenes, materials and animations.'),
    G('GLB','Single-file binary form of a glTF asset.'),
    G('GPU','Graphics processing unit used for massively parallel rendering and compute.'),
    G('Hit test','Ray query to find intersections with real-world or virtual geometry.'),
    G('Immersive session','A WebXR XRSession that presents content through immersive hardware.'),
    G('KTX2','Texture container format used in efficient GPU delivery workflows.'),
    G('Level of detail (LOD)','Multiple model representations selected to balance visual quality and runtime cost.'),
    G('Mesh','Vertices and faces that define a polygonal 3D object.'),
    G('MR','Mixed reality: physical and virtual elements integrated in a spatial experience.'),
    G('Occlusion','A nearer surface hides a farther one, including virtual-real interactions.'),
    G('OpenXR','Khronos cross-platform API for native XR runtime access.'),
    G('OpenUSD','Open ecosystem for composing and interchanging complex 3D scenes.'),
    G('PBR','Physically based rendering: material workflows approximating light/surface interactions.'),
    G('Photogrammetry','Reconstructing 3D geometry using multiple photographs.'),
    G('Point cloud','A set of sampled 3D coordinates that represents surfaces or environments.'),
    G('Pose','Position and orientation of a tracked object or viewpoint.'),
    G('Reference space','Coordinate system used to interpret poses in a WebXR session.'),
    G('Retopology','Reworking a mesh’s polygon structure for better deformation and performance.'),
    G('SLAM','Simultaneous localization and mapping, often used for tracked AR.'),
    G('Spatial audio','Audio rendered with directional and positional cues.'),
    G('Stereoscopic rendering','Rendering separate viewpoints for the left and right eyes.'),
    G('Texture atlas','Multiple texture regions combined into a smaller number of texture images.'),
    G('USDZ','Packaged USD asset format often used in Apple AR Quick Look workflows.'),
    G('UV coordinates','2D coordinates used to map textures onto 3D geometry.'),
    G('VR','Virtual reality: an interactive simulated environment.'),
    G('WebAR','AR experiences delivered through the web with a range of underlying technologies.'),
    G('WebGL','Browser graphics API used by many real-time 3D libraries.'),
    G('WebGPU','Modern web graphics and GPU compute API.'),
    G('WebXR','W3C web API family supporting compatible immersive AR/VR hardware.'),
    G('World tracking','Estimating movement and pose in the physical environment.'),
    G('XR','Umbrella term for AR, VR, MR and related immersive experiences.')
  ];
  return {technologies,tools,standards,conversions,docs,paths,glossary,reviewed:'November 2026'};
})();
