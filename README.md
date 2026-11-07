# Spatial Computing Hub — Edition 01

An independent, English-first portal for spatial computing, AR, VR, MR, WebXR, WebAR, real-time 3D and 3D delivery workflows.

## What's inside

- Overview dashboard and technology map
- Structured knowledge library (original explanations, examples, practical checkpoints, sources)
- Technology atlas with filters
- Searchable directory of frameworks, runtimes, authoring tools, engines and 3D utilities
- Format and conversion studio, including **actual local image conversion** (JPEG / PNG / WebP), **actual JSON formatting**, and **local GLB / glTF inspection**
- Official standards and primary references
- Guided learning paths
- Sandbox playground: editable templates rendered in a sandboxed iframe
- Browser/device capability diagnostic for WebGL, WebGPU and WebXR session availability
- Glossary, bookmarks (stored locally), global search, mobile navigation

No backend, API key, database, tracking SDK or paid API is required. External example libraries load from their official/CDN sources when online. User files remain on the device for the built-in inspection/conversion tools.

## Edition 02 — Spatial Workbench (preview)

The `#workbench` route adds three completely local, dependency-free interactive exercises:

1. **3D orientation and camera projection** — yaw, pitch, roll, camera distance and vertical field-of-view sliders drive a Canvas-based 3D cube and reference axes. This is a perspective teaching simulation, not an XR headset emulator.
2. **XR frame-budget estimator** — resolution per eye, view count, refresh target and linear render scale yield an approximate per-frame time and pixel workload. Results are illustrative; they do not benchmark the visitor's GPU.
3. **AR real-world scale calculator** — estimate a uniform scale multiplier and physical output dimensions from the source asset's measured bounding box and target height.

The knowledge library includes six companion articles, four additional primary references, a new five-lesson learning path and six glossary entries. These connect each calculation to the relevant source standards and warn about device compatibility and measurement limitations.

All three modules work without an API key, uploads, a build system or third-party JavaScript. Navigation, CSS and educational catalog additions are implemented through `workbench.js`, `workbench.css`, `app.js` and `data.js`; the original Spectrum theme remains loaded before the new styling.

### Checks

Run `node tests/smoke.mjs` to validate the JavaScript, catalog entries, hyperlinks, lesson-to-path relationships and workbench markup. GitHub Actions also runs these dependency-free checks on pull requests and on the main branch.

## Edition 03 — 3D Model Studio (preview)

The new `#modelstudio` route adds a working browser-based viewer for **self-contained GLB v2 files** (up to 80 MiB), built with the open-source [`<model-viewer>`](https://modelviewer.dev/) Web Component, version **4.4.0** (Apache-2.0). Its module is loaded only when a user visits the studio, using the official Google-hosted library.

- **Open locally:** select or drop a `.glb` file. The Hub checks the binary header signature, version and declared file length before previewing. The selected model is served to the viewer through a temporary `blob:` URL, not uploaded to the Hub.
- **Preview:** orbit, zoom, camera reset, optional auto-rotation, and estimated model dimensions in meters.
- **Lighting and environment:** neutral/legacy presets, exposure, shadow strength/softness and viewport background (viewer settings, not asset changes).
- **Materials:** choose glTF PBR material, edit base-color, metalness or roughness factors, restore original material factors where available.
- **Animation:** select and play/pause any included glTF animation clips.
- **Export:** attempt an edited GLB export via `model-viewer.exportScene({binary:true})` when supported; **revalidate every export** with Khronos glTF Validator and another viewer.
- **Optional sample:** use the official remote Astronaut model from `modelviewer.dev`; requires an internet connection and may have licensing requirements for redistribution.

### Limits and privacy

Files selected from the local device are not uploaded to our servers, and blob URLs are revoked after navigation. The 3D engine and optional Draco/other decoders are downloaded from their providers on demand, so the studio is **not offline by default**. A GLB referencing external resources might initiate separate network fetches; avoid untrusted assets, and do not interpret this as a secure environment for arbitrary 3D data. The studio does not provide a full Blender-like mesh editor, physically accurate calibration or guaranteed native AR functionality. Export may fail for some asset extensions.

### Credits

`<model-viewer>` by Google and contributors, Apache-2.0 license. Primary documentation: https://modelviewer.dev/docs/ ; materials and scene graph: https://modelviewer.dev/examples/scenegraph/ . glTF specification and validator by Khronos Group.

## Edition 04 — Asset Optimization Lab (preview)

The new `#assetlab` workspace is a **privacy-first, free, dependency-free browser analysis tool** for local glTF **.glb v2** files. It is implemented in `asset-core.js`, `asset-lab.js` and `asset-lab.css` and linked from the sidebar, homepage and global search.

**What it actually does:**

- Checks the GLB magic/version/byte length, JSON/BIN chunk layout and bufferView bounds (120 MiB file cap, 16 MiB JSON cap).
- Reports mesh/primitive counts, estimated triangles, accessors, materials, animations and encoded texture bytes.
- Reads width and height from embedded PNG/JPEG headers; estimates RGBA memory as `width × height × 4` bytes (not a real GPU measurement or mipmap estimate).
- Warns about external resources, large files and images, and potentially incompatible extension layouts.
- Exports an anonymized JSON report **locally**; the filename is recorded, but user files are never transmitted by our code.
- Optionally **repackages core GLB assets** with aligned bufferViews while preserving each resource's original bytes; this may reclaim unused gaps.
- Optionally **re-encodes embedded JPEG/PNG** images with browser Canvas at chosen resolution/quality and retains a replacement only if it is smaller. The MIME type remains unchanged (no undocumented extensions are added).
- Validates the generated file's GLB container again and only offers download when the file actually shrank. Users should still run [Khronos glTF Validator](https://github.khronos.org/glTF-Validator/) and check the image fidelity in a 3D viewer.

**Limitations and important warnings:** Automated GLB rewriting is restricted to simple, single-buffer core glTF assets **without extensions** and without external image references. Extensions such as `KHR_texture_basisu`, `EXT_meshopt_compression` and custom binary layouts are analysis-only. This lab does **not** compress meshes, create KTX2, transcode textures into GPU formats or prove XR hardware compatibility. PNG/JPEG recompression through Canvas can alter pixel values, color profiles or image metadata; preserve the original. Large model files and images may strain browser memory. Models with unusual scene structures or unsupported data should be optimized using dedicated tools such as [glTF Transform](https://gltf-transform.dev/cli) or [Khronos KTX Software](https://www.khronos.org/ktx/).

The knowledge library also adds the **Asset Optimization & Delivery** path, detailed guides on asset budgets and texture formats, official reference links and glossary entries. Unit tests for GLB parsing and byte-for-byte resource repacking are in `tests/asset-core.mjs`. Run `node tests/asset-core.mjs` and `node tests/smoke.mjs` before merging.

## Edition 05 — XR Experience Gallery (preview)

Open \`#gallery\` for an English-language **curated collection of 12 experiences**:

- **8 offline runnable HTML demos:** holographic CSS 3D cube, perspective camera projections, pointer and keyboard parallax, accessible hotspots, WebGL GLSL shader, procedural (not photographic) 360° navigation, pointer-reactive particles and conceptual stereo disparity.
- **3 connected demos:** Three.js 0.187.0 torus-knot study, A-Frame 1.8.0 WebXR/VR room and \`<model-viewer>\` 4.4.0 GLB astronaut viewer. These rely on free, externally hosted open-source JavaScript and sometimes sample assets. They are not offline demos.
- **1 integrated workflow:** a deep link to the local Asset Optimization Lab for practical GLB inspections.

The gallery provides category and runtime filters, global search integration, source links, guide recommendations, a live preview, and **copy/download full HTML** for each runnable demo. Samples load **only after a visitor chooses Run**, in an \`iframe sandbox="allow-scripts"\` without \`allow-same-origin\`, \`allow-popups\` or \`allow-forms\`, and with \`referrerpolicy="no-referrer"\`. This isolation deliberately restricts privileges and can prevent headset immersive mode inside the preview. For external demos, run the downloaded HTML on a trusted HTTPS origin and an actually supported device, after reviewing the code and network requests.

All examples are educational **representations of concepts**, not assertions of universal WebXR, tracking, headset, camera or geospatial support. The 360 panorama uses a procedural landscape, not real-world imagery or geolocation. The stereo disparity viewer is only a 2D teaching comparison, not binocular output to a headset. The library links to official specifications and documentation, including [WebXR](https://www.w3.org/TR/webxr/), [A-Frame](https://aframe.io/docs/), [Three.js](https://threejs.org/manual/pages/installation.html), and [model-viewer](https://modelviewer.dev/docs/).

Two new companion guides and an \`XR Experience Explorer\` learning path explain sandboxing, compatibility and how to turn a browser demo into a device-verified immersive experience. The implementation consists of \`experience-demos.js\`, \`experience-gallery.js\`, and \`experience-gallery.css\`; it preserves Spectrum V2 and the existing Spatial Workbench, 3D Model Studio and Asset Optimization Lab.

**Local checks:** \`node tests/smoke.mjs && node tests/asset-core.mjs && node tests/gallery.mjs\`. The gallery test verifies all 12 records, offline-only source restrictions, pinned network runtimes, route connections, isolated preview permissions and lesson links. Full cross-browser and headset checks remain necessary prior to generalizing about runtime compatibility.

## Run

Run a local static server from this directory:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`. You can also open `index.html` directly for most features, but **WebXR requires HTTPS or a trusted local development origin**, and browsers restrict certain APIs on `file://` pages.

## Deploy for free

Upload the contents to GitHub Pages, Cloudflare Pages or a free static hosting project on Vercel. There is no build step. Publish the repository root (`index.html`). A `vercel.json` is provided for a static deployment.

## Security notes

- Sandbox preview uses `iframe sandbox="allow-scripts"`, intentionally **without** `allow-same-origin`, forms or popups. Even so, running arbitrary JavaScript has inherent risks, especially outbound network requests; only use trusted snippets.
- File inspection uses the browser `File` APIs without uploading content.
- Third-party sample libraries are fetched from CDNs for optional scenes; future hardening should pin exact versions and use a CSP aligned with the hosting origin and allowed remote resources.
- The site does not promise browser XR compatibility. The diagnostic uses real feature detection.

## Internationalisation

Content and UI are currently English. The data catalog is separated into `data.js` and UI rendering into `app.js`. Add language packs under `locales/fr.js` and `locales/ar.js` in a later iteration; support `lang`, `dir="rtl"` and route-language metadata without duplicating the UI layout.

## Provenance

The information architecture preserves and expands the user's uploaded React/TypeScript prototype `spatialportal.tsx`, archived at `reference/original-spatialportal.tsx`. This version intentionally uses framework-free HTML, CSS and JavaScript to remain runnable without a build environment or package installation.

## Editorial maintenance

Entries have official source links. Revalidate links and status tags periodically. In particular, 8th Wall's formerly hosted platform was retired on February 28, 2026; its successor tools have different license terms. Keep separate notes for software that is free to use, open source, freemium or proprietary.
