import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAquaTech } from '../../context/AquaTechContext';
import {
  Box,
  Eye,
  Layers,
  Activity,
  Droplet,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface ComponentDetail {
  id: string;
  name: string;
  subsystem: 'cooldrop' | 'purification';
  description: string;
  telemetry: string;
  maintenanceState: 'healthy' | 'advisory' | 'attention';
}

const componentDatabase: Record<string, ComponentDetail> = {
  ac_unit: {
    id: 'ac_unit',
    name: 'HVAC Evaporator Coil & Blower Unit',
    subsystem: 'cooldrop',
    description: 'Chilled refrigerant tubes condense ambient humidity into liquid water droplets over aluminum fins.',
    telemetry: 'Condensation Inflow: 6.4 L/h | Coil Temp: 11.2°C',
    maintenanceState: 'healthy'
  },
  condensate_outlet: {
    id: 'condensate_outlet',
    name: 'Condensate Drain Siphon & Trap',
    subsystem: 'cooldrop',
    description: 'U-bend water seal prevents back-draft air suction into evaporator negative pressure zone.',
    telemetry: 'Differential Pressure: 0.2 kPa | Biofilm check: Normal',
    maintenanceState: 'healthy'
  },
  collection_pipe: {
    id: 'collection_pipe',
    name: 'Gravity-Fed Collection Piping & Pulse Flowmeter',
    subsystem: 'cooldrop',
    description: 'Food-grade clear acrylic conduit with integrated micro-turbine Hall-effect sensor SNS-FLW-01.',
    telemetry: 'Pulse frequency: 24.8 Hz | Velocity: 0.42 m/s',
    maintenanceState: 'advisory'
  },
  storage_tank_cd: {
    id: 'storage_tank_cd',
    name: '250L Condensate Buffer Cistern (Tank-01)',
    subsystem: 'cooldrop',
    description: 'Rotomolded polyethylene tank equipped with hydrostatic pressure transducer SNS-LVL-01 and overflow valve.',
    telemetry: 'Current Fill: 57.1% | Volume: 142.8 L / 250 L',
    maintenanceState: 'healthy'
  },
  wastewater_inlet: {
    id: 'wastewater_inlet',
    name: 'Simulated Greywater Inflow Manifold',
    subsystem: 'purification',
    description: 'Dosing valve introducing simulated campus wastewater at controlled volumetric rate.',
    telemetry: 'Inflow Rate: 2.1 L/min | Turbidity: 42.0 NTU (Raw)',
    maintenanceState: 'healthy'
  },
  chambers_1_2: {
    id: 'chambers_1_2',
    name: 'Screening & Lamella Settling Clarifier',
    subsystem: 'purification',
    description: 'Dual-chamber physical separator with 500µm micro-mesh and angled lamella settling plates.',
    telemetry: 'Floc settling velocity: 1.8 cm/min | Sludge depth: 4.2 cm',
    maintenanceState: 'healthy'
  },
  chambers_3_4: {
    id: 'chambers_3_4',
    name: 'Multi-Media Depth Filter & Activated Carbon Bed',
    subsystem: 'purification',
    description: 'Layered anthracite/silica sand followed by high surface-area granular activated carbon.',
    telemetry: 'Delta P: 14.6 kPa | Effluent Turbidity: 0.88 NTU',
    maintenanceState: 'advisory'
  },
  disinfection_unit: {
    id: 'disinfection_unit',
    name: 'UV-C Germicidal 254nm Reactor Flow-Cell',
    subsystem: 'purification',
    description: 'Quartz-jacketed high-intensity ultraviolet mercury lamp delivering >40 mJ/cm² pathogen destruction.',
    telemetry: 'UV Dosage: 44.2 mJ/cm² | Lamp Intensity: 98.4%',
    maintenanceState: 'healthy'
  },
  verification_tank: {
    id: 'verification_tank',
    name: 'Treated Water Verification & Reuse Tank',
    subsystem: 'purification',
    description: 'Final multi-parameter sensor manifold (pH, EC, DO) routing to non-potable distribution pumps.',
    telemetry: 'pH: 7.24 | Turbidity: 0.88 NTU | Output: 189.2 L',
    maintenanceState: 'healthy'
  }
};

export const DigitalTwinView: React.FC = () => {
  const { coolDrop, purification, isSimulatedHardware } = useAquaTech();
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedTwin, setSelectedTwin] = useState<'both' | 'cooldrop' | 'purification'>('both');
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetail>(componentDatabase['ac_unit']);
  const [isDemoAnimation, setIsDemoAnimation] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Use element's bounding rect or fallback gracefully to window width
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1d29); // Dark industrial blue-navy

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 38);
    camera.lookAt(0, 2, 0);

    // 2. Renderer setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'default' });
    } catch (e) {
      console.error('Failed to initialize WebGLRenderer', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Clear and attach DOM element safely
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    const cyanPointLight = new THREE.PointLight(0x21a6a0, 4, 60);
    cyanPointLight.position.set(-10, 10, 0);
    scene.add(cyanPointLight);

    const bluePointLight = new THREE.PointLight(0x5cb6dc, 4, 60);
    bluePointLight.position.set(10, 10, 0);
    scene.add(bluePointLight);

    // Grid Floor
    const grid = new THREE.GridHelper(60, 40, 0x123b55, 0x163447);
    grid.position.y = -4;
    scene.add(grid);

    // Groups
    const coolDropGroup = new THREE.Group();
    const purifGroup = new THREE.Group();

    // -------------------------------------------------------------
    // COOL DROP 3D PHYSICAL MODEL
    // -------------------------------------------------------------
    // AC Indoor Unit (Box)
    const acGeo = new THREE.BoxGeometry(7, 3.5, 4);
    const acMat = new THREE.MeshStandardMaterial({
      color: 0x334e68,
      metalness: 0.4,
      roughness: 0.3
    });
    const acMesh = new THREE.Mesh(acGeo, acMat);
    acMesh.position.set(-14, 10, 0);
    coolDropGroup.add(acMesh);

    // AC Louver Fins
    const finGeo = new THREE.BoxGeometry(6.6, 0.3, 0.2);
    const finMat = new THREE.MeshBasicMaterial({ color: 0x5cb6dc });
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(-14, 9.2 + i * 0.7, 2.05);
      coolDropGroup.add(fin);
    }

    // Condensate Drain Tray & Pipe
    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 11, 16);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x5cb6dc,
      transparent: true,
      opacity: 0.75,
      metalness: 0.2
    });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.set(-14, 2.5, 0);
    coolDropGroup.add(pipe);

    // CoolDrop Storage Tank (Translucent Cylinder)
    const tankGeo = new THREE.CylinderGeometry(4, 4, 9, 32);
    const tankMat = new THREE.MeshStandardMaterial({
      color: 0x123b55,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1
    });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(-14, -0.5, 0);
    coolDropGroup.add(tank);

    // Tank Liquid Level Mesh
    const fillFraction = Math.max(0.05, Math.min(1.0, coolDrop.tankFillPercentage / 100));
    const fillHeight = 7 * fillFraction;
    const liquidGeo = new THREE.CylinderGeometry(3.8, 3.8, fillHeight, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x21a6a0,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.set(-14, -4 + (fillHeight / 2), 0);
    coolDropGroup.add(liquidMesh);

    // Animated water droplet particles in CoolDrop
    const dropCount = 18;
    const dropGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const dropMat = new THREE.MeshBasicMaterial({ color: 0x7be4ff });
    const drops: THREE.Mesh[] = [];
    for (let i = 0; i < dropCount; i++) {
      const drop = new THREE.Mesh(dropGeo, dropMat);
      drop.position.set(-14 + (Math.random() - 0.5) * 0.2, 8 - Math.random() * 11, (Math.random() - 0.5) * 0.2);
      coolDropGroup.add(drop);
      drops.push(drop);
    }

    // -------------------------------------------------------------
    // PURIFICATION 3D PHYSICAL MODEL
    // -------------------------------------------------------------
    // Raw wastewater inlet header
    const purInletGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
    const purInletMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const purInlet = new THREE.Mesh(purInletGeo, purInletMat);
    purInlet.rotation.z = Math.PI / 2;
    purInlet.position.set(4, 8, 0);
    purifGroup.add(purInlet);

    // 4 Modular Glass Chambers (Screening/Sedimentation/Filtration/Adsorption)
    const chamberColors = [0x546e7a, 0x37474f, 0x1f4e5b, 0x1b5e20];
    const chambers: THREE.Mesh[] = [];
    for (let c = 0; c < 4; c++) {
      const chGeo = new THREE.BoxGeometry(3.5, 7, 3.5);
      const chMat = new THREE.MeshStandardMaterial({
        color: chamberColors[c],
        transparent: true,
        opacity: 0.65,
        roughness: 0.2
      });
      const chamber = new THREE.Mesh(chGeo, chMat);
      chamber.position.set(7 + c * 4.4, 3, 0);
      purifGroup.add(chamber);
      chambers.push(chamber);

      // Connecting jumper pipes between chambers
      if (c < 3) {
        const linkGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 12);
        const linkMat = new THREE.MeshBasicMaterial({ color: 0x21a6a0 });
        const link = new THREE.Mesh(linkGeo, linkMat);
        link.rotation.z = Math.PI / 2;
        link.position.set(9.2 + c * 4.4, 4.5, 0);
        purifGroup.add(link);
      }
    }

    // Disinfection UV Chamber (Horizontal Glow Cylinder)
    const uvGeo = new THREE.CylinderGeometry(1.2, 1.2, 6, 24);
    const uvMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8
    });
    const uvMesh = new THREE.Mesh(uvGeo, uvMat);
    uvMesh.rotation.z = Math.PI / 2;
    uvMesh.position.set(13.6, -1.8, 0);
    purifGroup.add(uvMesh);

    // Final Storage Tank (Treated)
    const finalTankGeo = new THREE.CylinderGeometry(3.8, 3.8, 8, 32);
    const finalTankMat = new THREE.MeshStandardMaterial({
      color: 0x21a6a0,
      transparent: true,
      opacity: 0.5,
      roughness: 0.2
    });
    const finalTank = new THREE.Mesh(finalTankGeo, finalTankMat);
    finalTank.position.set(22.5, -0.5, 0);
    purifGroup.add(finalTank);

    scene.add(coolDropGroup);
    scene.add(purifGroup);

    // Animation loop
    let reqId: number;
    let angle = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Smooth camera orbit or static view
      if (isDemoAnimation) {
        angle += 0.003;
        camera.position.x = Math.sin(angle) * 32;
        camera.position.z = Math.cos(angle) * 32;
        camera.lookAt(2, 3, 0);
      }

      // Animate CoolDrop water droplets falling down the pipe
      drops.forEach((d) => {
        d.position.y -= 0.12;
        if (d.position.y < -3) {
          d.position.y = 8;
        }
      });

      // Filter chamber pulse glow
      const time = Date.now() * 0.002;
      uvMat.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [coolDrop.tankFillPercentage, isDemoAnimation]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#123B55]/10 flex items-center justify-center text-[#123B55]">
            <Box className="w-7 h-7 text-[#123B55]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">3D Cyber-Physical Digital Twin</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-[#123B55] font-bold border border-blue-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#21A6A0]" />
                WebGL / Three.js
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive 3D Virtual Representation of Connected CoolDrop & Sewage Treatment Models
            </p>
          </div>
        </div>

        {/* Controls: Live vs Demo Mode and Camera Rotation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDemoAnimation(!isDemoAnimation)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isDemoAnimation
                ? 'bg-[#21A6A0]/15 text-[#123B55] border-[#21A6A0]/40'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isDemoAnimation ? 'animate-spin' : ''}`} />
            <span>{isDemoAnimation ? 'Orbit Auto-Rotate ON' : 'Orbit Paused'}</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-700 bg-[#0c1d29] h-[500px] w-full">
        {/* Three.js viewport */}
        <div ref={mountRef} className="w-full h-full" style={{ minHeight: '480px' }} />

        {/* Overlay Telemetry HUD (Top Left) */}
        <div className="absolute top-4 left-4 pointer-events-auto bg-[#0B2333]/90 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-white text-xs max-w-xs space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-[#5CB6DC] font-bold">Digital Twin HUD</span>
            <span className="w-2 h-2 rounded-full bg-[#65A875] animate-ping" />
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between text-slate-300">
              <span>CoolDrop Flow:</span>
              <span className="text-[#5CB6DC] font-bold">{coolDrop.collectionRateLPerHr} L/h</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tank Fill:</span>
              <span className="text-[#21A6A0] font-bold">{coolDrop.tankFillPercentage}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Purif. Turbidity:</span>
              <span className="text-emerald-400 font-bold">{purification.turbidityNTU} NTU</span>
            </div>
          </div>
          <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400">
            {isSimulatedHardware ? 'Synced to Simulated ESP32 Telemetry' : 'Reflecting Physical Transducers'}
          </div>
        </div>

        {/* Component Selector Buttons (Bottom Center) */}
        <div className="absolute bottom-4 inset-x-4 pointer-events-auto flex items-center justify-center gap-2 overflow-x-auto py-1">
          {Object.values(componentDatabase).map((comp) => {
            const isSelected = selectedComponent.id === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedComponent(comp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex-shrink-0 border ${
                  isSelected
                    ? 'bg-[#21A6A0] text-[#0B2333] font-bold border-[#21A6A0] shadow-lg'
                    : 'bg-[#0B2333]/90 text-slate-300 hover:text-white border-white/10'
                }`}
              >
                {comp.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Component Inspection Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-slate-100 text-slate-600">
              {selectedComponent.subsystem.toUpperCase()} SUBASSEMBLY
            </span>
            <h3 className="font-bold text-slate-900 text-base">{selectedComponent.name}</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            {selectedComponent.description}
          </p>
        </div>

        <div className="flex-shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs">
          <span className="text-slate-400 text-[10px] uppercase block">Subsystem Telemetry</span>
          <span className="font-bold text-[#123B55] mt-0.5 block">{selectedComponent.telemetry}</span>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#65A875] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Maintenance State: {selectedComponent.maintenanceState.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
