import React from 'react';
import {
  Globe,
  Smartphone,
  Palette,
  Layers,
  Settings,
  Brain,
  Cpu,
  Cloud,
  Database,
  Network,
  Activity,
  FileText,
  TrendingUp,
  Workflow,
  Terminal,
  Search,
  Lock,
  Shield,
  MousePointer,
  PenTool,
  GitBranch,
  Repeat,
  Megaphone,
  Briefcase,
  Layers3,
  Flame,
  Layout,
  Code
} from 'lucide-react';

interface IllustrationProps {
  slug: string;
}

export const OverviewIllustration = ({ slug }: IllustrationProps) => {
  // Common container with 3D perspective rotation
  const containerClass = "relative w-full max-w-[280px] h-[220px] mx-auto flex items-center justify-center [perspective:800px] select-none";
  const glassPanelClass = "absolute bg-white/60 backdrop-blur-md border border-emerald-500/20 rounded-xl p-3 shadow-[0_8px_32px_0_rgba(16,185,129,0.08)] flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1";

  // Dynamic content based on service slug
  switch (slug) {
    case 'web-development':
      return (
        <div className={containerClass}>
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:16px_16px] rounded-2xl [transform:rotateX(40deg)_rotateY(-15deg)] opacity-60" />
          
          {/* Main Browser Panel */}
          <div className={`${glassPanelClass} w-48 h-32 [transform:rotateX(40deg)_rotateY(-15deg)_translateZ(20px)] left-4 top-8`}>
            <div className="flex gap-1 border-b border-emerald-500/10 pb-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500/40" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/20" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/20" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="h-2 w-12 bg-emerald-500/20 rounded" />
              <span className="h-2 w-28 bg-emerald-500/10 rounded" />
              <span className="h-6 w-full bg-emerald-500/5 rounded border border-emerald-500/10 flex items-center px-1">
                <span className="h-1 w-8 bg-emerald-500/20 rounded" />
              </span>
            </div>
            <div className="flex justify-between items-center mt-2 border-t border-emerald-500/10 pt-1.5">
              <span className="text-[8px] font-mono text-emerald-600/60 font-semibold">&lt;div/&gt;</span>
              <Globe className="w-3 h-3 text-emerald-500" />
            </div>
          </div>

          {/* Floating Responsive Mobile Panel */}
          <div className={`${glassPanelClass} w-20 h-36 [transform:rotateX(40deg)_rotateY(-15deg)_translateZ(50px)] right-4 bottom-4`}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 mx-auto mb-2" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-10 w-full bg-emerald-500/10 rounded flex items-center justify-center">
                <Code className="w-4 h-4 text-emerald-500/50" />
              </div>
              <span className="h-1.5 w-8 bg-emerald-500/20 rounded mx-auto" />
              <span className="h-1.5 w-10 bg-emerald-500/10 rounded mx-auto" />
            </div>
            <div className="w-6 h-1 bg-emerald-500/20 rounded mx-auto mt-2" />
          </div>
        </div>
      );

    case 'mobile-app-development':
      return (
        <div className={containerClass}>
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:16px_16px] rounded-2xl [transform:rotateX(25deg)_rotateY(-25deg)] opacity-60" />
          
          {/* Base Phone Frame */}
          <div className={`${glassPanelClass} w-32 h-44 [transform:rotateX(25deg)_rotateY(-25deg)_translateZ(20px)]`}>
            <div className="w-12 h-1.5 bg-emerald-500/20 rounded-full mx-auto mb-3" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-16 w-full bg-emerald-500/15 rounded-lg border border-emerald-500/20 flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="flex gap-1.5">
                <div className="h-8 flex-1 bg-emerald-500/5 rounded border border-emerald-500/10" />
                <div className="h-8 flex-1 bg-emerald-500/5 rounded border border-emerald-500/10" />
              </div>
            </div>
            <div className="w-8 h-2 bg-emerald-500/20 rounded-full mx-auto mt-2" />
          </div>

          {/* Floating UI Notification */}
          <div className="absolute bg-white/80 border border-emerald-500/30 rounded-lg p-2 flex items-center gap-2 shadow-md [transform:rotateX(25deg)_rotateY(-25deg)_translateZ(60px)] left-2 top-10 w-36">
            <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="flex-1">
              <div className="h-1.5 w-12 bg-emerald-500/40 rounded mb-1" />
              <div className="h-1 w-16 bg-emerald-500/20 rounded" />
            </div>
          </div>
        </div>
      );

    case 'ui-ux-design':
      return (
        <div className={containerClass}>
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:16px_16px] rounded-2xl [transform:rotateX(30deg)_rotateY(-20deg)] opacity-60" />
          
          {/* Figma Board Layer 1 */}
          <div className={`${glassPanelClass} w-40 h-28 [transform:rotateX(30deg)_rotateY(-20deg)_translateZ(10px)] left-2 top-4 opacity-70`}>
            <div className="h-1.5 w-10 bg-emerald-500/20 rounded mb-2" />
            <div className="flex-1 border border-dashed border-emerald-500/30 rounded flex items-center justify-center">
              <span className="text-[10px] text-emerald-500/40 font-medium">Wireframe Layer</span>
            </div>
          </div>

          {/* Figma UI Design Layer 2 */}
          <div className={`${glassPanelClass} w-44 h-32 [transform:rotateX(30deg)_rotateY(-20deg)_translateZ(40px)] right-2 bottom-4`}>
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1.5 mb-2">
              <div className="flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-700/80">UI Design</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-emerald-500/10 rounded border border-emerald-500/20 flex flex-col p-1">
                <div className="h-1 w-4 bg-emerald-500/30 rounded mb-1" />
                <div className="h-3 w-full bg-emerald-500/20 rounded" />
              </div>
              <div className="bg-emerald-500/5 rounded border border-emerald-500/10 flex flex-col p-1 justify-center items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500/20" />
              </div>
            </div>
            {/* Interactive Cursor */}
            <div className="absolute -left-2 top-10 flex flex-col items-start [transform:translateZ(20px)]">
              <MousePointer className="w-4 h-4 text-emerald-500 fill-emerald-500 drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[7px] bg-emerald-500 text-white px-1 py-0.5 rounded ml-3 -mt-1 font-bold">DESIGNER</span>
            </div>
          </div>
        </div>
      );

    case 'branding':
      return (
        <div className={containerClass}>
          {/* Construction Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:12px_12px] rounded-2xl [transform:rotateX(35deg)_rotateY(-15deg)] opacity-75" />
          
          {/* Alignment Vectors Sheet */}
          <div className={`${glassPanelClass} w-44 h-36 [transform:rotateX(35deg)_rotateY(-15deg)_translateZ(20px)]`}>
            <div className="flex-1 relative border border-dashed border-emerald-500/20 rounded-lg flex items-center justify-center overflow-hidden">
              {/* Construction Circles */}
              <div className="absolute w-24 h-24 rounded-full border border-emerald-500/10 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-dashed border-emerald-500/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-emerald-500/30" />
                </div>
              </div>
              
              {/* Core Brand Mark */}
              <PenTool className="w-8 h-8 text-emerald-500 relative z-10" />
              
              {/* Construction Lines */}
              <div className="absolute top-0 bottom-0 w-[1px] bg-emerald-500/15" />
              <div className="absolute left-0 right-0 h-[1px] bg-emerald-500/15" />
            </div>
            <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-emerald-500/10">
              <span className="text-[8px] font-bold text-emerald-600/80 tracking-widest font-mono">GRID: ON</span>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/50" />
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/30" />
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/15" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'creative-design':
      return (
        <div className={containerClass}>
          {/* Background mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:10px_10px] rounded-2xl [transform:rotateX(25deg)_rotateY(-25deg)] opacity-60" />
          
          {/* Creative Stage */}
          <div className={`${glassPanelClass} w-48 h-32 [transform:rotateX(25deg)_rotateY(-25deg)_translateZ(20px)] left-2`}>
            <div className="flex justify-between items-center mb-1 pb-1 border-b border-emerald-500/10">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Flame className="w-3 h-3 text-emerald-500" /> Vector Motion</span>
              <span className="text-[8px] font-mono text-emerald-500/70">60 FPS</span>
            </div>
            <div className="flex-1 flex gap-2 pt-1">
              {/* Left Canvas Preview */}
              <div className="flex-1 bg-emerald-500/5 rounded border border-emerald-500/15 flex items-center justify-center relative overflow-hidden">
                <div className="w-10 h-10 border border-emerald-500/20 rotate-45 flex items-center justify-center">
                  <div className="w-6 h-6 border border-emerald-500/30 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
              {/* Right Layers Panel */}
              <div className="w-16 flex flex-col gap-1">
                <span className="h-3 w-full bg-emerald-500/10 rounded flex items-center justify-center text-[7px] text-emerald-600 font-bold border border-emerald-500/20">Layer 1</span>
                <span className="h-3 w-full bg-emerald-500/5 rounded flex items-center justify-center text-[7px] text-emerald-500/60">Layer 2</span>
                <span className="h-3 w-full bg-emerald-500/5 rounded flex items-center justify-center text-[7px] text-emerald-500/60">Layer 3</span>
              </div>
            </div>
          </div>

          {/* Floating Timeline Tracker */}
          <div className="absolute bg-white/90 border border-emerald-500/30 rounded-lg p-1.5 shadow-md [transform:rotateX(25deg)_rotateY(-25deg)_translateZ(50px)] right-4 bottom-2 w-40 flex flex-col gap-1">
            <div className="flex justify-between text-[7px] font-mono text-emerald-600/80">
              <span>0:00:02</span>
              <span>Timeline</span>
            </div>
            <div className="h-1 bg-emerald-500/20 rounded relative">
              <div className="absolute left-[40%] top-0 bottom-0 w-2 bg-emerald-500 rounded -mt-0.5" />
            </div>
          </div>
        </div>
      );

    case 'product-design':
      return (
        <div className={containerClass}>
          {/* Construction Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:14px_14px] rounded-2xl [transform:rotateX(30deg)_rotateY(-15deg)]" />
          
          {/* User Flow Board */}
          <div className={`${glassPanelClass} w-44 h-36 [transform:rotateX(30deg)_rotateY(-15deg)_translateZ(20px)] left-2 top-2`}>
            <div className="border-b border-emerald-500/10 pb-1 mb-2">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Layers3 className="w-3.5 h-3.5 text-emerald-500" /> Blueprint Flow</span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              {/* Linked Node System */}
              <div className="flex items-center justify-between px-2">
                <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"><Layout className="w-3.5 h-3.5 text-emerald-500" /></div>
                <div className="flex-1 h-[1px] bg-dashed border-t border-dashed border-emerald-500/40 mx-2" />
                <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/60" /></div>
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-[7px] text-emerald-600/80 font-medium">User Spec</span>
                <span className="text-[7px] text-emerald-600/80 font-medium">Goal Achieved</span>
              </div>
              <div className="h-10 bg-emerald-500/5 border border-emerald-500/10 rounded p-1 text-[8px] text-emerald-600/70 overflow-hidden leading-snug">
                // Specification scope mapped to layout nodes.
              </div>
            </div>
          </div>
        </div>
      );

    case 'custom-software-development':
      return (
        <div className={containerClass}>
          {/* Code lines background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:16px_16px] rounded-2xl [transform:rotateX(35deg)_rotateY(-20deg)] opacity-60" />
          
          {/* Main API Dashboard Panel */}
          <div className={`${glassPanelClass} w-48 h-32 [transform:rotateX(35deg)_rotateY(-20deg)_translateZ(20px)] left-4`}>
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1 mb-2">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-emerald-500" /> Backend API Terminal</span>
              <span className="px-1 py-0.5 rounded bg-emerald-500/20 text-[6px] text-emerald-600 font-bold border border-emerald-500/20">POST</span>
            </div>
            <div className="flex-1 font-mono text-[7px] text-emerald-600/90 flex flex-col gap-1 overflow-hidden">
              <div><span className="text-emerald-500/40">1</span> const router = express.Router();</div>
              <div><span className="text-emerald-500/40">2</span> router.post('/v1/sync', async (req, res) =&gt; &#123;</div>
              <div><span className="text-emerald-500/40">3</span>   const syncLog = await DB.store(req.body);</div>
              <div><span className="text-emerald-500/40">4</span>   return res.status(200).json(&#123; success: true &#125;);</div>
              <div><span className="text-emerald-500/40">5</span> &#125;);</div>
            </div>
          </div>

          {/* Database server stacking */}
          <div className="absolute bg-white/90 border border-emerald-500/30 rounded-lg p-2 shadow-md [transform:rotateX(35deg)_rotateY(-20deg)_translateZ(55px)] right-4 bottom-4 w-24 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 pb-1 border-b border-emerald-500/10">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[8px] font-bold text-emerald-700/80">DB Cluster</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-1.5 bg-emerald-500/35 rounded flex justify-between px-1 items-center"><span className="w-1 h-1 bg-emerald-500 rounded-full" /></div>
              <div className="h-1.5 bg-emerald-500/20 rounded flex justify-between px-1 items-center"><span className="w-1 h-1 bg-emerald-500 rounded-full" /></div>
              <div className="h-1.5 bg-emerald-500/10 rounded flex justify-between px-1 items-center"><span className="w-1 h-1 bg-emerald-500/50 rounded-full" /></div>
            </div>
          </div>
        </div>
      );

    case 'saas-platforms':
      return (
        <div className={containerClass}>
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:14px_14px] [transform:rotateX(30deg)_rotateY(-20deg)] opacity-60" />
          
          {/* Main Tenant Dashboard */}
          <div className={`${glassPanelClass} w-48 h-32 [transform:rotateX(30deg)_rotateY(-20deg)_translateZ(20px)] left-2 top-4`}>
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1.5 mb-2">
              <span className="text-[9px] font-bold text-emerald-700/80">Multi-Tenant Console</span>
              <span className="text-[8px] text-emerald-500/90 font-mono">99.98%</span>
            </div>
            <div className="flex-1 flex gap-2">
              {/* Pie/Gauge Placeholder */}
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/40 border-t-emerald-500 flex items-center justify-center shrink-0">
                <span className="text-[7px] font-bold text-emerald-600">82%</span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="h-2 w-full bg-emerald-500/10 rounded" />
                <span className="h-2 w-full bg-emerald-500/10 rounded" />
                <span className="h-4 w-full bg-emerald-500/5 rounded border border-emerald-500/10 flex items-center px-1">
                  <span className="h-1.5 w-10 bg-emerald-500/30 rounded" />
                </span>
              </div>
            </div>
            <div className="flex justify-between text-[7px] text-emerald-600/70 border-t border-emerald-500/10 pt-1 mt-1">
              <span>Clients: 242</span>
              <span>Billing: Active</span>
            </div>
          </div>
        </div>
      );

    case 'cloud':
      return (
        <div className={containerClass}>
          {/* Network grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:18px_18px] [transform:rotateX(35deg)_rotateY(-15deg)] opacity-70" />
          
          {/* Cloud Core Panel */}
          <div className={`${glassPanelClass} w-44 h-32 [transform:rotateX(35deg)_rotateY(-15deg)_translateZ(20px)]`}>
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.15)]">
                <Cloud className="w-6 h-6 text-emerald-500 animate-bounce" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700/80">AWS Cloud Stack</span>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
              </div>
            </div>
            <div className="border-t border-emerald-500/10 pt-1 mt-1 flex justify-between text-[7px] text-emerald-600/60">
              <span>S3: Connected</span>
              <span>EC2: Running</span>
            </div>
          </div>
        </div>
      );

    case 'devops':
      return (
        <div className={containerClass}>
          {/* Background nodes */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:14px_14px] [transform:rotateX(30deg)_rotateY(-20deg)] opacity-60" />
          
          {/* CI/CD pipeline loop */}
          <div className={`${glassPanelClass} w-48 h-32 [transform:rotateX(30deg)_rotateY(-20deg)_translateZ(20px)] left-2`}>
            <div className="flex justify-between border-b border-emerald-500/10 pb-1 mb-2">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Settings className="w-3.5 h-3.5 text-emerald-500 animate-spin" /> CI/CD Automation</span>
              <span className="text-[8px] text-emerald-600 font-bold font-mono">BUILD PASS</span>
            </div>
            <div className="flex-1 flex items-center justify-between relative px-2">
              {/* Step bubbles */}
              <div className="flex flex-col items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[8px] flex items-center justify-center text-emerald-600 font-bold">1</span>
                <span className="text-[6px] text-emerald-500/80">Code</span>
              </div>
              <div className="flex-1 h-[2px] bg-emerald-500/30" />
              <div className="flex flex-col items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-emerald-500 border border-emerald-500 text-[8px] flex items-center justify-center text-white font-bold animate-pulse">2</span>
                <span className="text-[6px] text-emerald-700 font-bold">Build</span>
              </div>
              <div className="flex-1 h-[2px] bg-emerald-500/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[8px] flex items-center justify-center text-emerald-500/40">3</span>
                <span className="text-[6px] text-emerald-500/40">Deploy</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'ai':
      return (
        <div className={containerClass}>
          {/* Neural net nodes background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:15px_15px] [transform:rotateX(30deg)_rotateY(-15deg)] opacity-70" />
          
          {/* Core AI Neural Panel */}
          <div className={`${glassPanelClass} w-44 h-32 [transform:rotateX(30deg)_rotateY(-15deg)_translateZ(20px)]`}>
            <div className="flex justify-between items-center mb-1 pb-1 border-b border-emerald-500/10">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Brain className="w-3.5 h-3.5 text-emerald-500" /> Neural Node Array</span>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              {/* Linked neural graphic */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[6px] font-bold animate-ping absolute" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-600 text-[6px] font-bold">W</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'ai-automation':
      return (
        <div className={containerClass}>
          {/* Workflow background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:14px_14px] [transform:rotateX(25deg)_rotateY(-25deg)] opacity-60" />
          
          {/* Automation board */}
          <div className={`${glassPanelClass} w-48 h-32 [transform:rotateX(25deg)_rotateY(-25deg)_translateZ(20px)] left-2`}>
            <div className="border-b border-emerald-500/10 pb-1 mb-2">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-emerald-500" /> AI Agent Core</span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex gap-2">
                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded p-1 flex flex-col justify-between">
                  <span className="text-[6px] text-emerald-600 font-bold uppercase">Trigger</span>
                  <span className="text-[7px] text-emerald-700 font-semibold truncate">On Data Received</span>
                </div>
                <div className="flex-1 bg-emerald-500/5 border border-emerald-500/10 rounded p-1 flex flex-col justify-between">
                  <span className="text-[6px] text-emerald-600/60 uppercase">Action</span>
                  <span className="text-[7px] text-emerald-600 truncate">Run AI Agent</span>
                </div>
              </div>
              <div className="h-5 bg-emerald-500/5 rounded border border-emerald-500/10 flex items-center justify-between px-2">
                <span className="text-[7px] text-emerald-600 font-medium">Status: Idle</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'enterprise-ai-integration':
      return (
        <div className={containerClass}>
          {/* Background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:16px_16px] [transform:rotateX(30deg)_rotateY(-20deg)] opacity-60" />
          
          {/* AI adapter board */}
          <div className={`${glassPanelClass} w-44 h-36 [transform:rotateX(30deg)_rotateY(-20deg)_translateZ(20px)]`}>
            <div className="border-b border-emerald-500/10 pb-1 mb-2 flex justify-between items-center">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> AI Safety Shield</span>
              <Lock className="w-3 h-3 text-emerald-500" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500/60" />
                <div className="flex-1 h-1.5 bg-emerald-500/20 rounded" />
                <Brain className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded p-1.5 text-[7px] text-emerald-600">
                Plausibility verification node: verified secure context tunnels.
              </div>
            </div>
          </div>
        </div>
      );

    case 'automation':
      return (
        <div className={containerClass}>
          {/* Dynamic workflows */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:12px_12px] [transform:rotateX(30deg)_rotateY(-15deg)] opacity-60" />
          
          {/* Logic workflow panel */}
          <div className={`${glassPanelClass} w-48 h-32 [transform:rotateX(30deg)_rotateY(-15deg)_translateZ(20px)] left-2`}>
            <div className="border-b border-emerald-500/10 pb-1.5 mb-2">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Workflow className="w-3.5 h-3.5 text-emerald-500" /> Integration Tree</span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              {/* Linked logic path */}
              <div className="flex items-center gap-2 px-2">
                <div className="px-1.5 py-0.5 rounded bg-emerald-500/25 text-[7px] text-emerald-700 font-bold">IF</div>
                <div className="flex-1 h-[1px] bg-emerald-500/30" />
                <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[7px] text-emerald-600 border border-emerald-500/20">THEN</div>
              </div>
              <p className="text-[7px] text-emerald-600/70 text-center leading-relaxed">
                App webhook triggers synchronizations across database targets.
              </p>
            </div>
          </div>
        </div>
      );

    case 'product-platform-engineering':
      return (
        <div className={containerClass}>
          {/* Microservices graph */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:16px_16px] [transform:rotateX(30deg)_rotateY(-20deg)] opacity-60" />
          
          {/* API gateway board */}
          <div className={`${glassPanelClass} w-44 h-36 [transform:rotateX(30deg)_rotateY(-20deg)_translateZ(20px)]`}>
            <div className="border-b border-emerald-500/10 pb-1 mb-2 flex justify-between items-center">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Network className="w-3.5 h-3.5 text-emerald-500" /> Microservices Mesh</span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-[8px] text-emerald-600 font-bold">LB</div>
                <div className="flex-1 h-[1px] bg-emerald-500/20 mx-1" />
                <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-[8px] text-emerald-600">S1</div>
                <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-[8px] text-emerald-600 ml-1">S2</div>
              </div>
              <div className="h-10 bg-emerald-500/5 rounded border border-emerald-500/10 p-1 flex justify-between items-center text-[8px] text-emerald-600/70">
                <span>Active load pool</span>
                <span className="flex gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /></span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'revenue-web-conversion-systems':
      return (
        <div className={containerClass}>
          {/* Conversion funnel background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:14px_14px] [transform:rotateX(30deg)_rotateY(-15deg)] opacity-60" />
          
          {/* Funnel conversion dashboard */}
          <div className={`${glassPanelClass} w-48 h-32 [transform:rotateX(30deg)_rotateY(-15deg)_translateZ(20px)] left-2`}>
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1 mb-2">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Growth Funnel</span>
              <span className="text-[8px] text-emerald-600 font-bold">+24.5%</span>
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="h-3 w-full bg-emerald-500/30 rounded flex items-center justify-center text-[6px] text-emerald-800 font-bold">100% Traffic</div>
              <div className="h-3 w-3/4 bg-emerald-500/20 rounded mx-auto flex items-center justify-center text-[6px] text-emerald-700 font-bold">42% Leads</div>
              <div className="h-3 w-1/2 bg-emerald-500/10 rounded mx-auto border border-emerald-500/20 flex items-center justify-center text-[6px] text-emerald-600 font-bold">12% Revenue</div>
            </div>
          </div>
        </div>
      );

    case 'documentation-research':
      return (
        <div className={containerClass}>
          {/* Background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:16px_16px] [transform:rotateX(25deg)_rotateY(-25deg)] opacity-60" />
          
          {/* Documentation file board */}
          <div className={`${glassPanelClass} w-44 h-36 [transform:rotateX(25deg)_rotateY(-25deg)_translateZ(20px)]`}>
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1 mb-2">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-emerald-500" /> Specifications Portal</span>
            </div>
            <div className="flex-1 flex flex-col gap-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[8px] text-emerald-600 font-medium">swagger_api_v1.yaml</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                <span className="text-[8px] text-emerald-600/80 font-medium">sow_requirements.docx</span>
              </div>
              <div className="h-8 bg-emerald-500/5 rounded border border-emerald-500/10 p-1 flex items-center gap-2">
                <Search className="w-3 h-3 text-emerald-500/50" />
                <div className="h-1.5 flex-1 bg-emerald-500/15 rounded" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'digital-marketing':
      return (
        <div className={containerClass}>
          {/* Analytics background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:14px_14px] [transform:rotateX(30deg)_rotateY(-15deg)] opacity-60" />
          
          {/* Marketing dashboard */}
          <div className={`${glassPanelClass} w-48 h-32 [transform:rotateX(30deg)_rotateY(-15deg)_translateZ(20px)] left-2`}>
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1 mb-2">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Megaphone className="w-3.5 h-3.5 text-emerald-500 animate-bounce" /> Campaign Console</span>
              <span className="text-[8px] text-emerald-500/70 font-mono">CTR: 4.8%</span>
            </div>
            <div className="flex-1 flex gap-2">
              {/* Analytics bar charts */}
              <div className="w-16 flex items-end gap-1.5 bg-emerald-500/5 rounded border border-emerald-500/15 p-1 h-full">
                <div className="w-2.5 h-6 bg-emerald-500/20 rounded-sm" />
                <div className="w-2.5 h-10 bg-emerald-500/40 rounded-sm" />
                <div className="w-2.5 h-12 bg-emerald-500/60 rounded-sm" />
              </div>
              <div className="flex-1 flex flex-col gap-1 justify-center">
                <span className="h-2 w-full bg-emerald-500/15 rounded" />
                <span className="h-2 w-full bg-emerald-500/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'cloud-infrastructure':
      return (
        <div className={containerClass}>
          {/* Topology mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:18px_18px] [transform:rotateX(35deg)_rotateY(-15deg)] opacity-60" />
          
          {/* Cloud infra boundary */}
          <div className={`${glassPanelClass} w-44 h-36 [transform:rotateX(35deg)_rotateY(-15deg)_translateZ(20px)]`}>
            <div className="border-b border-emerald-500/10 pb-1.5 mb-2 flex justify-between items-center">
              <span className="text-[9px] font-bold text-emerald-700/80 flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-500" /> VPC Subnet Topology</span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between gap-1.5">
                <div className="h-10 flex-1 bg-emerald-500/10 rounded border border-emerald-500/30 flex items-center justify-center text-[7px] text-emerald-700 font-bold">Subnet A</div>
                <div className="h-10 flex-1 bg-emerald-500/5 rounded border border-emerald-500/10 flex items-center justify-center text-[7px] text-emerald-500/50">Subnet B</div>
              </div>
              <div className="h-5 bg-emerald-500/5 rounded border border-emerald-500/15 flex items-center justify-between px-2">
                <span className="text-[7px] text-emerald-600">Routing Table</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={containerClass}>
          {/* Default fallback line art */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:14px_14px] [transform:rotateX(30deg)_rotateY(-15deg)] opacity-60" />
          <div className={`${glassPanelClass} w-44 h-32 [transform:rotateX(30deg)_rotateY(-15deg)_translateZ(20px)]`}>
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <Briefcase className="w-8 h-8 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-700/80">TechVistar Service</span>
            </div>
          </div>
        </div>
      );
  }
};

// Simple stub for CheckCircle2 (aliased to layout check)
const CheckCircle2 = ({ className, ...props }: React.ComponentProps<typeof Layout>) => (
  <Layout className={className} {...props} />
);
