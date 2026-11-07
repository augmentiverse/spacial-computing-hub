import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Box, 
  Code, 
  Cpu, 
  Cuboid, 
  FileJson, 
  FileText, 
  Globe, 
  Glasses,
  Hexagon, 
  Layers, 
  MonitorPlay, 
  PlaySquare, 
  Settings, 
  Wrench,
  RefreshCw
} from 'lucide-react';

// --- DATA DEFINITIONS ---

const OVERVIEW_CONCEPTS = [
  {
    title: "Spatial Computing",
    icon: <Cpu className="w-8 h-8 text-blue-400" />,
    description: "The digitization of activities of machines, people, objects, and the environments in which they take place to enable and optimize actions and interactions.",
  },
  {
    title: "WebXR",
    icon: <Globe className="w-8 h-8 text-purple-400" />,
    description: "A web standard API that provides access to virtual reality (VR) and augmented reality (AR) devices, including sensors and head-mounted displays, directly through a web browser.",
  },
  {
    title: "Augmented Reality (AR)",
    icon: <Glasses className="w-8 h-8 text-emerald-400" />,
    description: "An interactive experience that combines the real world and computer-generated 3D content. The content can span multiple sensory modalities, including visual and auditory.",
  },
  {
    title: "Virtual Reality (VR)",
    icon: <Box className="w-8 h-8 text-rose-400" />,
    description: "A simulated 3D environment that enables users to explore and interact with a virtual surrounding in a way that approximates reality, as it is perceived through the users' senses.",
  }
];

const FRAMEWORKS = [
  { name: "Three.js", tags: ["3D", "WebGL", "Core"], desc: "A cross-browser JavaScript library and API used to create and display animated 3D computer graphics in a web browser using WebGL." },
  { name: "A-Frame", tags: ["WebXR", "HTML", "VR/AR"], desc: "A web framework for building 3D/AR/VR experiences. Built on top of HTML, making it easy to get started while offering deep access to Three.js." },
  { name: "React Three Fiber", tags: ["React", "Three.js", "3D"], desc: "A React renderer for three.js. Build your 3D scenes declaratively with re-usable, self-contained components that react to state." },
  { name: "Babylon.js", tags: ["3D", "Engine", "WebGPU"], desc: "A powerful, beautiful, simple, and open game and rendering engine packed into a friendly JavaScript framework." },
  { name: "MindAR", tags: ["WebAR", "Face Tracking", "Image Tracking"], desc: "An open-source web augmented reality framework. Supports Image Tracking and Face Tracking." },
  { name: "8th Wall", tags: ["WebAR", "Commercial", "SLAM"], desc: "A powerful commercial platform for creating WebAR experiences with robust SLAM capabilities." },
  { name: "PlayCanvas", tags: ["Game Engine", "WebGL", "Editor"], desc: "A visual development platform for interactive web content. Both a game engine and a collaborative cloud-based editor." },
  { name: "Blender", tags: ["DCC", "Modeling", "Animation"], desc: "The free and open-source 3D creation suite. It supports the entirety of the 3D pipeline—modeling, rigging, animation, simulation, rendering, compositing." },
  { name: "MeshMixer", tags: ["3D Modeling", "Printing", "Tools"], desc: "State-of-the-art software for working with triangle meshes. Perfect for cleaning up 3D scans and preparing models for 3D printing or WebXR optimization." }
];

const STANDARDS = [
  { name: "WebXR Device API", org: "W3C", desc: "The core specification that provides the interfaces to access VR and AR hardware from the web.", link: "https://www.w3.org/TR/webxr/" },
  { name: "OpenXR", org: "Khronos Group", desc: "A royalty-free, open standard that provides high-performance access to Augmented Reality (AR) and Virtual Reality (VR) platforms and devices.", link: "https://www.khronos.org/openxr/" },
  { name: "glTF 2.0", org: "Khronos Group", desc: "The 'JPEG of 3D'. An open format for the efficient transmission and loading of 3D scenes and models.", link: "https://www.khronos.org/gltf/" },
  { name: "USD (Universal Scene Description)", org: "Pixar / Apple", desc: "A high-performance extensible software platform for collaboratively constructing animated 3D scenes, widely used in AR via USDZ.", link: "https://openusd.org/" },
  { name: "WebGPU", org: "W3C", desc: "The future web standard for graphics and compute, providing modern GPU features and better performance than WebGL.", link: "https://www.w3.org/TR/webgpu/" },
];

const CONVERTERS = [
  { name: "glTF-Transform", type: "CLI / Node.js", desc: "A robust CLI and scripting library to read, edit, and write glTF 2.0 files. Essential for optimizing 3D models for the web." },
  { name: "Draco Compression", type: "Library / CLI", desc: "An open-source library for compressing and decompressing 3D geometric meshes and point clouds. Significantly reduces glTF file sizes." },
  { name: "KTX2 Texture Tools", type: "CLI", desc: "Tools for creating KTX2 files with Basis Universal supercompression. Drastically reduces GPU memory usage for textures in WebGL/WebXR." },
  { name: "Reality Converter", type: "macOS GUI", desc: "Apple's tool to convert, view, and customize USDZ 3D objects on Mac. Great for preparing assets for iOS Quick Look." },
  { name: "Blender (Import/Export)", type: "GUI App", desc: "Blender natively supports importing and exporting a massive variety of formats (OBJ, FBX, glTF, Collada) via its built-in tools." },
  { name: "FFmpeg", type: "CLI", desc: "The ultimate multimedia framework. Essential for converting standard videos into formats optimized for WebXR video textures (e.g., transparent WebM)." }
];

const DEFAULT_SANDBOX_CODE = `<!DOCTYPE html>
<html>
  <head>
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
  </head>
  <body>
    <a-scene background="color: #1e293b">
      <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" animation="property: rotation; to: 0 405 0; loop: true; dur: 5000"></a-box>
      <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" animation="property: position; to: 0 1.5 -5; dir: alternate; loop: true; dur: 1000"></a-sphere>
      <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
    </a-scene>
  </body>
</html>`;

// --- COMPONENTS ---

const Badge = ({ children }) => (
  <span className="px-2 py-1 text-xs font-semibold text-blue-300 bg-blue-900/50 rounded-full border border-blue-700/50">
    {children}
  </span>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/80 transition-colors ${className}`}>
    {children}
  </div>
);

const SectionOverview = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-8 border border-slate-700/50">
      <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Spatial Computing Hub</h1>
      <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
        Your comprehensive developer portal for everything related to Spatial Computing, WebXR, AR, VR, and 3D web technologies. Explore documentation, frameworks, tools, and test code live in the sandbox.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {OVERVIEW_CONCEPTS.map((concept, idx) => (
        <Card key={idx} className="flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-900/50 rounded-lg">
              {concept.icon}
            </div>
            <h2 className="text-2xl font-bold text-white">{concept.title}</h2>
          </div>
          <p className="text-slate-400 leading-relaxed flex-grow">{concept.description}</p>
        </Card>
      ))}
    </div>
  </div>
);

const SectionFrameworks = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Frameworks & Tools</h2>
      <p className="text-slate-400">Essential libraries and platforms for building spatial experiences on the web and beyond.</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {FRAMEWORKS.map((fw, idx) => (
        <Card key={idx}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white">{fw.name}</h3>
            <div className="flex gap-2 flex-wrap justify-end">
              {fw.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mt-4">{fw.desc}</p>
        </Card>
      ))}
    </div>
  </div>
);

const SectionStandards = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Standards & References</h2>
      <p className="text-slate-400">The foundational specifications and open standards powering the spatial web.</p>
    </div>

    <div className="space-y-4">
      {STANDARDS.map((std, idx) => (
        <Card key={idx} className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-1">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">{std.name}</h3>
              <span className="text-xs font-mono text-slate-500 px-2 py-0.5 bg-slate-900 rounded">{std.org}</span>
            </div>
            <p className="text-slate-400 text-sm mt-2">{std.desc}</p>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const SectionConverters = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Converters & Pipelines</h2>
      <p className="text-slate-400">Tools for asset optimization, format conversion, and media processing.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {CONVERTERS.map((conv, idx) => (
        <Card key={idx}>
          <div className="flex items-center gap-3 mb-3">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">{conv.name}</h3>
          </div>
          <span className="inline-block text-xs font-medium text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded mb-3">
            {conv.type}
          </span>
          <p className="text-slate-400 text-sm">{conv.desc}</p>
        </Card>
      ))}
    </div>
  </div>
);

const SectionSandbox = () => {
  const [code, setCode] = useState(DEFAULT_SANDBOX_CODE);
  const [previewCode, setPreviewCode] = useState(DEFAULT_SANDBOX_CODE);

  const handleRunCode = () => {
    setPreviewCode(code);
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Sandbox Playground</h2>
        <p className="text-slate-400">Write HTML/WebXR code on the left and click "Run/Update" to see it rendered live on the right. Defaults to an A-Frame scene.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-grow min-h-[600px]">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between bg-slate-800/80 px-4 py-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300 font-mono">index.html</span>
            </div>
            <button 
              onClick={handleRunCode}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Run/Update
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow w-full bg-transparent text-slate-300 font-mono text-sm p-4 focus:outline-none resize-none"
            spellCheck="false"
          />
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex flex-col bg-black rounded-xl border border-slate-700/50 overflow-hidden relative">
           <div className="flex items-center justify-between bg-slate-800/80 px-4 py-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <MonitorPlay className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Live Preview</span>
            </div>
          </div>
          <div className="flex-grow relative bg-slate-950 w-full h-full">
            <iframe
              title="sandbox-preview"
              srcDoc={previewCode}
              className="absolute inset-0 w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const NAVIGATION = [
    { id: 'overview', label: 'Overview', icon: <Globe className="w-5 h-5" /> },
    { id: 'frameworks', label: 'Frameworks & Tools', icon: <Layers className="w-5 h-5" /> },
    { id: 'standards', label: 'Standards & References', icon: <FileText className="w-5 h-5" /> },
    { id: 'converters', label: 'Converters & Pipelines', icon: <Wrench className="w-5 h-5" /> },
    { id: 'sandbox', label: 'Sandbox Playground', icon: <PlaySquare className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <SectionOverview />;
      case 'frameworks': return <SectionFrameworks />;
      case 'standards': return <SectionStandards />;
      case 'converters': return <SectionConverters />;
      case 'sandbox': return <SectionSandbox />;
      default: return <SectionOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <Cuboid className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Spatial Dev Hub
          </span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {NAVIGATION.map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === nav.id
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
            >
              {nav.icon}
              {nav.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Hexagon className="w-4 h-4" />
            <span>v1.0.0-beta • English UI</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 lg:p-12 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
      
    </div>
  );
}