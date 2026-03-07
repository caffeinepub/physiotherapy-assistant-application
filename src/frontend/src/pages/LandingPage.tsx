import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  Brain,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
interface LandingPageProps {
  login: () => void;
  loginStatus: string;
}

// ─── Particle Canvas ─────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const PARTICLE_COUNT = 110;
    const MAX_DIST = 145;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.6 + 0.25,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 220, 210, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 220, 210, ${p.opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}

// ─── SVG Skeleton Fallback ────────────────────────────────────────────────────
function SkeletonSVG() {
  return (
    <div className="relative flex items-center justify-center h-full w-full float-anim">
      <svg
        viewBox="0 0 200 400"
        className="h-full max-h-[420px] w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Human skeleton diagram"
      >
        {/* Skull */}
        <ellipse
          cx="100"
          cy="35"
          rx="28"
          ry="32"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2"
          fill="oklch(0.72 0.17 195 / 0.06)"
        />
        <ellipse
          cx="100"
          cy="40"
          rx="18"
          ry="12"
          stroke="oklch(0.72 0.17 195 / 0.4)"
          strokeWidth="1"
          fill="none"
        />
        {/* Jaw */}
        <rect
          x="82"
          y="60"
          width="36"
          height="14"
          rx="5"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2"
          fill="oklch(0.72 0.17 195 / 0.06)"
        />
        {/* Neck */}
        <rect
          x="92"
          y="74"
          width="16"
          height="20"
          rx="4"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2"
          fill="oklch(0.72 0.17 195 / 0.06)"
        />
        {/* Clavicles */}
        <line
          x1="100"
          y1="94"
          x2="55"
          y2="108"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="94"
          x2="145"
          y2="108"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Spine */}
        {[94, 106, 118, 130, 142, 154, 166, 178, 190].map((y) => (
          <rect
            key={y}
            x="93"
            y={y}
            width="14"
            height="10"
            rx="2"
            stroke="oklch(0.72 0.17 195)"
            strokeWidth="1.5"
            fill="oklch(0.72 0.17 195 / 0.08)"
          />
        ))}
        {/* Ribcage */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path
              d={`M 100 ${104 + i * 12} Q 65 ${110 + i * 12} 60 ${120 + i * 12}`}
              stroke="oklch(0.72 0.17 195 / 0.7)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d={`M 100 ${104 + i * 12} Q 135 ${110 + i * 12} 140 ${120 + i * 12}`}
              stroke="oklch(0.72 0.17 195 / 0.7)"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        ))}
        {/* Pelvis */}
        <ellipse
          cx="100"
          cy="200"
          rx="32"
          ry="20"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2"
          fill="oklch(0.72 0.17 195 / 0.06)"
        />
        {/* Arms */}
        <line
          x1="55"
          y1="108"
          x2="38"
          y2="160"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="38"
          y1="160"
          x2="28"
          y2="210"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="145"
          y1="108"
          x2="162"
          y2="160"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="162"
          y1="160"
          x2="172"
          y2="210"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Femurs */}
        <line
          x1="78"
          y1="210"
          x2="68"
          y2="280"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="122"
          y1="210"
          x2="132"
          y2="280"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Tibias */}
        <line
          x1="68"
          y1="280"
          x2="65"
          y2="350"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="132"
          y1="280"
          x2="135"
          y2="350"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Feet */}
        <ellipse
          cx="63"
          cy="355"
          rx="12"
          ry="6"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="1.5"
          fill="oklch(0.72 0.17 195 / 0.06)"
        />
        <ellipse
          cx="137"
          cy="355"
          rx="12"
          ry="6"
          stroke="oklch(0.72 0.17 195)"
          strokeWidth="1.5"
          fill="oklch(0.72 0.17 195 / 0.06)"
        />
        {/* Joint dots */}
        {[
          [100, 94],
          [55, 108],
          [145, 108],
          [38, 160],
          [162, 160],
          [100, 200],
          [78, 210],
          [122, 210],
          [68, 280],
          [132, 280],
        ].map(([cx, cy]) => (
          <circle
            key={`j-${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="4"
            fill="oklch(0.72 0.17 195 / 0.3)"
            stroke="oklch(0.72 0.17 195)"
            strokeWidth="1.5"
          />
        ))}
        {/* Glow filter */}
        <defs>
          <filter id="skeleton-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 195 / 0.4) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ─── 3D Skeleton with Three.js ────────────────────────────────────────────────
function SkeletonScene() {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: import("three").WebGLRenderer | null = null;
    let animId = 0;
    let scene: import("three").Scene | null = null;
    let camera: import("three").PerspectiveCamera | null = null;
    let skeletonGroup: import("three").Group | null = null;

    const run = async () => {
      try {
        const THREE = await import("three");

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
          50,
          mount.clientWidth / mount.clientHeight,
          0.1,
          100,
        );
        camera.position.set(0, 1, 6);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x4dc9b8, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0x66ffee, 1.2);
        directionalLight.position.set(2, 4, 3);
        scene.add(directionalLight);
        const pointLight = new THREE.PointLight(0x4dc9b8, 2, 10);
        pointLight.position.set(-2, 2, 2);
        scene.add(pointLight);

        skeletonGroup = new THREE.Group();

        const boneMat = new THREE.MeshStandardMaterial({
          color: 0x4dc9b8,
          emissive: 0x1a6655,
          emissiveIntensity: 0.4,
          roughness: 0.4,
          metalness: 0.3,
          transparent: true,
          opacity: 0.9,
        });

        const jointMat = new THREE.MeshStandardMaterial({
          color: 0x88ffee,
          emissive: 0x44ccaa,
          emissiveIntensity: 0.6,
          roughness: 0.2,
          metalness: 0.5,
        });

        const addBone = (
          x: number,
          y: number,
          z: number,
          h: number,
          rx = 0,
          rz = 0,
        ) => {
          const geo = new THREE.CapsuleGeometry(0.06, h, 4, 8);
          const mesh = new THREE.Mesh(geo, boneMat);
          mesh.position.set(x, y, z);
          mesh.rotation.x = rx;
          mesh.rotation.z = rz;
          skeletonGroup!.add(mesh);
        };

        const addJoint = (x: number, y: number, z: number, r = 0.1) => {
          const geo = new THREE.SphereGeometry(r, 8, 8);
          const mesh = new THREE.Mesh(geo, jointMat);
          mesh.position.set(x, y, z);
          skeletonGroup!.add(mesh);
        };

        const addSkull = () => {
          const geo = new THREE.SphereGeometry(0.28, 12, 12);
          const mesh = new THREE.Mesh(geo, boneMat);
          mesh.position.set(0, 2.85, 0);
          mesh.scale.set(1, 1.1, 0.9);
          skeletonGroup!.add(mesh);
        };

        addSkull();
        // Neck
        addBone(0, 2.42, 0, 0.28);
        addJoint(0, 2.56, 0, 0.1);
        // Spine segments
        addBone(0, 1.8, 0, 0.7);
        addBone(0, 1.1, 0, 0.5);
        addBone(0, 0.55, 0, 0.4);
        addJoint(0, 0.3, 0, 0.12);
        // Pelvis
        const pelvisGeo = new THREE.TorusGeometry(0.28, 0.06, 6, 12);
        const pelvisMesh = new THREE.Mesh(pelvisGeo, boneMat);
        pelvisMesh.position.set(0, 0.2, 0);
        pelvisMesh.rotation.x = Math.PI / 2;
        skeletonGroup!.add(pelvisMesh);

        // Clavicles
        addBone(-0.4, 2.28, 0, 0.38, 0, Math.PI * 0.15);
        addBone(0.4, 2.28, 0, 0.38, 0, -Math.PI * 0.15);
        addJoint(-0.7, 2.18, 0, 0.09);
        addJoint(0.7, 2.18, 0, 0.09);

        // Left arm
        addBone(-0.85, 1.7, 0, 0.55, 0, Math.PI * 0.05);
        addJoint(-0.9, 1.38, 0, 0.1);
        addBone(-0.95, 1.05, 0, 0.42);
        addJoint(-0.98, 0.8, 0, 0.08);

        // Right arm
        addBone(0.85, 1.7, 0, 0.55, 0, -Math.PI * 0.05);
        addJoint(0.9, 1.38, 0, 0.1);
        addBone(0.95, 1.05, 0, 0.42);
        addJoint(0.98, 0.8, 0, 0.08);

        // Ribs
        for (let i = 0; i < 5; i++) {
          const ribGeo = new THREE.TorusGeometry(
            0.32 - i * 0.02,
            0.03,
            4,
            10,
            Math.PI,
          );
          const leftRib = new THREE.Mesh(
            ribGeo,
            new THREE.MeshStandardMaterial({
              color: 0x4dc9b8,
              emissive: 0x1a6655,
              emissiveIntensity: 0.3,
              transparent: true,
              opacity: 0.7,
            }),
          );
          leftRib.position.set(-0.04, 2.1 - i * 0.15, 0);
          leftRib.rotation.y = Math.PI / 2;
          skeletonGroup!.add(leftRib);
        }

        // Left leg
        addBone(-0.22, -0.35, 0, 0.7);
        addJoint(-0.25, -0.72, 0, 0.12);
        addBone(-0.26, -1.1, 0, 0.55);
        addJoint(-0.28, -1.4, 0, 0.09);
        addBone(-0.28, -1.65, 0, 0.35);

        // Right leg
        addBone(0.22, -0.35, 0, 0.7);
        addJoint(0.25, -0.72, 0, 0.12);
        addBone(0.26, -1.1, 0, 0.55);
        addJoint(0.28, -1.4, 0, 0.09);
        addBone(0.28, -1.65, 0, 0.35);

        skeletonGroup.position.set(0, 0.2, 0);
        scene.add(skeletonGroup);

        setLoaded(true);

        // Resize handler
        const handleResize = () => {
          if (!mount || !camera || !renderer) return;
          camera.aspect = mount.clientWidth / mount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        let time = 0;
        const animate = () => {
          animId = requestAnimationFrame(animate);
          time += 0.005;
          if (skeletonGroup) {
            skeletonGroup.rotation.y = time * 0.5;
            skeletonGroup.position.y = 0.2 + Math.sin(time * 1.2) * 0.08;
          }
          renderer!.render(scene!, camera!);
        };
        animate();

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (err) {
        console.warn("Three.js failed to load:", err);
        setFailed(true);
      }
    };

    const cleanup = run();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      }
      cleanup.then((fn) => fn?.());
    };
  }, []);

  if (failed) {
    return <SkeletonSVG />;
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="h-full w-full" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SkeletonSVG />
        </div>
      )}
    </div>
  );
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("section-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

// ─── Recovery Chart Data ──────────────────────────────────────────────────────
const chartData = [
  { week: "W1", rom: 42, pain: 78 },
  { week: "W2", rom: 51, pain: 70 },
  { week: "W3", rom: 60, pain: 61 },
  { week: "W4", rom: 68, pain: 52 },
  { week: "W5", rom: 74, pain: 44 },
  { week: "W6", rom: 81, pain: 34 },
  { week: "W7", rom: 87, pain: 26 },
  { week: "W8", rom: 92, pain: 18 },
];

// ─── Feature Cards Data ───────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    glow: "icon-glow-teal",
    iconColor: "text-primary",
    accentColor: "oklch(0.72 0.17 195)",
    accentGradient:
      "linear-gradient(135deg, oklch(0.72 0.17 195 / 0.18) 0%, transparent 60%)",
    accentBorder: "oklch(0.72 0.17 195 / 0.35)",
    title: "Clinical Reasoning",
    description:
      "AI-powered assessment engine that supports physiotherapists in diagnosis and treatment planning.",
    ocid: "features.card.1",
    illustration: (
      <svg
        viewBox="0 0 120 70"
        className="w-full h-16"
        fill="none"
        role="img"
        aria-label="Clinical reasoning neural diagram"
      >
        {/* Neural network nodes */}
        {[
          [20, 15],
          [20, 35],
          [20, 55],
          [55, 10],
          [55, 30],
          [55, 50],
          [55, 65],
          [90, 22],
          [90, 48],
          [110, 35],
        ].map(([cx, cy]) => (
          <circle
            key={`n-${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="4"
            fill="oklch(0.72 0.17 195 / 0.5)"
            stroke="oklch(0.72 0.17 195)"
            strokeWidth="1"
          />
        ))}
        {/* Connections */}
        {[
          [20, 15, 55, 10],
          [20, 15, 55, 30],
          [20, 35, 55, 30],
          [20, 35, 55, 50],
          [20, 55, 55, 50],
          [20, 55, 55, 65],
          [55, 10, 90, 22],
          [55, 30, 90, 22],
          [55, 30, 90, 48],
          [55, 50, 90, 48],
          [55, 65, 90, 48],
          [90, 22, 110, 35],
          [90, 48, 110, 35],
        ].map(([x1, y1, x2, y2]) => (
          <line
            key={`l-${x1}-${y1}-${x2}-${y2}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="oklch(0.72 0.17 195 / 0.25)"
            strokeWidth="0.8"
          />
        ))}
        {/* Active path highlight */}
        <path
          d="M20 35 L55 30 L90 22 L110 35"
          stroke="oklch(0.78 0.18 195)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="4 2"
        />
      </svg>
    ),
  },
  {
    icon: Camera,
    glow: "icon-glow-blue",
    iconColor: "text-blue-400",
    accentColor: "oklch(0.68 0.2 250)",
    accentGradient:
      "linear-gradient(135deg, oklch(0.68 0.2 250 / 0.18) 0%, transparent 60%)",
    accentBorder: "oklch(0.68 0.2 250 / 0.35)",
    title: "Posture Analysis",
    description:
      "Camera-based posture detection using computer vision and AI body landmark tracking.",
    ocid: "features.card.2",
    illustration: (
      <svg
        viewBox="0 0 120 70"
        className="w-full h-16"
        fill="none"
        role="img"
        aria-label="Posture analysis camera grid"
      >
        {/* Grid lines */}
        {[30, 60, 90].map((x) => (
          <line
            key={x}
            x1={x}
            y1="8"
            x2={x}
            y2="62"
            stroke="oklch(0.68 0.2 250 / 0.2)"
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />
        ))}
        {[22, 42, 62].map((y) => (
          <line
            key={y}
            x1="8"
            y1={y}
            x2="112"
            y2={y}
            stroke="oklch(0.68 0.2 250 / 0.2)"
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />
        ))}
        {/* Body outline simplified */}
        <ellipse
          cx="60"
          cy="18"
          rx="8"
          ry="10"
          stroke="oklch(0.68 0.2 250 / 0.7)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M52 28 L44 50 M68 28 L76 50 M52 30 L68 30 L70 52 L50 52 Z"
          stroke="oklch(0.68 0.2 250 / 0.7)"
          strokeWidth="1.2"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Joint landmarks */}
        {[
          [60, 8],
          [52, 28],
          [68, 28],
          [44, 50],
          [76, 50],
          [54, 52],
          [66, 52],
        ].map(([cx, cy]) => (
          <circle
            key={`p-${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="2.5"
            fill="oklch(0.68 0.2 250)"
            stroke="oklch(0.68 0.2 250 / 0.5)"
            strokeWidth="3"
          />
        ))}
        {/* Scan line */}
        <line
          x1="8"
          y1="38"
          x2="112"
          y2="38"
          stroke="oklch(0.68 0.2 250 / 0.5)"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    icon: TrendingUp,
    glow: "icon-glow-green",
    iconColor: "text-green-400",
    accentColor: "oklch(0.68 0.18 155)",
    accentGradient:
      "linear-gradient(135deg, oklch(0.68 0.18 155 / 0.18) 0%, transparent 60%)",
    accentBorder: "oklch(0.68 0.18 155 / 0.35)",
    title: "Progress Tracking",
    description:
      "Evidence-based recovery metrics and patient outcome monitoring over time.",
    ocid: "features.card.3",
    illustration: (
      <svg
        viewBox="0 0 120 70"
        className="w-full h-16"
        fill="none"
        role="img"
        aria-label="Progress tracking chart"
      >
        {/* Area fill */}
        <path
          d="M10 58 L28 46 L46 48 L64 30 L82 22 L100 10 L100 65 L10 65 Z"
          fill="oklch(0.68 0.18 155 / 0.1)"
        />
        {/* Chart line */}
        <polyline
          points="10,58 28,46 46,48 64,30 82,22 100,10"
          stroke="oklch(0.68 0.18 155)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Data points */}
        {[
          [10, 58],
          [28, 46],
          [46, 48],
          [64, 30],
          [82, 22],
          [100, 10],
        ].map(([cx, cy]) => (
          <circle
            key={`c-${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="3.5"
            fill="oklch(0.68 0.18 155)"
            stroke="oklch(0.13 0.025 240)"
            strokeWidth="1.5"
          />
        ))}
        {/* Axis */}
        <line
          x1="8"
          y1="65"
          x2="112"
          y2="65"
          stroke="oklch(0.68 0.18 155 / 0.2)"
          strokeWidth="1"
        />
        <line
          x1="8"
          y1="5"
          x2="8"
          y2="65"
          stroke="oklch(0.68 0.18 155 / 0.2)"
          strokeWidth="1"
        />
      </svg>
    ),
  },
  {
    icon: Shield,
    glow: "icon-glow-purple",
    iconColor: "text-purple-400",
    accentColor: "oklch(0.68 0.2 290)",
    accentGradient:
      "linear-gradient(135deg, oklch(0.68 0.2 290 / 0.18) 0%, transparent 60%)",
    accentBorder: "oklch(0.68 0.2 290 / 0.35)",
    title: "Safety Layer",
    description:
      "Red-flag detection system that alerts physiotherapists about serious conditions requiring referral.",
    ocid: "features.card.4",
    illustration: (
      <svg
        viewBox="0 0 120 70"
        className="w-full h-16"
        fill="none"
        role="img"
        aria-label="Safety shield protection"
      >
        {/* Shield */}
        <path
          d="M60 5 L95 18 L95 42 Q95 62 60 68 Q25 62 25 42 L25 18 Z"
          stroke="oklch(0.68 0.2 290)"
          strokeWidth="1.5"
          fill="oklch(0.68 0.2 290 / 0.08)"
        />
        {/* Inner shield detail */}
        <path
          d="M60 14 L84 24 L84 42 Q84 56 60 61 Q36 56 36 42 L36 24 Z"
          stroke="oklch(0.68 0.2 290 / 0.4)"
          strokeWidth="1"
          fill="none"
        />
        {/* Alert symbol */}
        <line
          x1="60"
          y1="28"
          x2="60"
          y2="44"
          stroke="oklch(0.68 0.2 290)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="60" cy="51" r="2.5" fill="oklch(0.68 0.2 290)" />
        {/* Pulse rings */}
        <circle
          cx="60"
          cy="35"
          r="20"
          stroke="oklch(0.68 0.2 290 / 0.15)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <circle
          cx="60"
          cy="35"
          r="28"
          stroke="oklch(0.68 0.2 290 / 0.08)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
      </svg>
    ),
  },
];

// ─── Posture Joint Positions ──────────────────────────────────────────────────
const JOINTS = [
  { top: "12%", left: "48%", label: "Head" },
  { top: "22%", left: "30%", label: "L Shoulder" },
  { top: "22%", left: "70%", label: "R Shoulder" },
  { top: "38%", left: "20%", label: "L Elbow" },
  { top: "38%", left: "80%", label: "R Elbow" },
  { top: "48%", left: "40%", label: "L Hip" },
  { top: "48%", left: "60%", label: "R Hip" },
  { top: "66%", left: "36%", label: "L Knee" },
  { top: "66%", left: "64%", label: "R Knee" },
  { top: "84%", left: "34%", label: "L Ankle" },
  { top: "84%", left: "66%", label: "R Ankle" },
];

// ─── Section: Hero ────────────────────────────────────────────────────────────
function HeroSection({ login, loginStatus }: LandingPageProps) {
  const handleTryDemo = () => {
    const el = document.getElementById("posture-demo");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-100" />
      <div className="absolute inset-0 hero-glow" />
      {/* Dramatic teal crown glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full opacity-25 blur-[80px]"
        style={{ background: "oklch(0.72 0.17 195 / 0.5)" }}
      />
      {/* Tight center hotspot */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full opacity-15 blur-[60px]"
        style={{ background: "oklch(0.72 0.17 195 / 0.6)" }}
      />
      {/* Blue accent right side */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "oklch(0.68 0.2 250 / 0.4)" }}
      />
      {/* Deep purple accent bottom left */}
      <div
        className="pointer-events-none absolute bottom-1/4 -left-20 h-64 w-64 rounded-full opacity-12 blur-3xl"
        style={{ background: "oklch(0.68 0.2 290 / 0.3)" }}
      />

      <div className="container relative z-10 mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold badge-neon">
              <Activity className="h-3.5 w-3.5" />
              <span>Professional Physiotherapy Platform</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 font-display font-bold leading-[0.98] tracking-tight text-foreground text-6xl md:text-7xl xl:text-8xl">
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.72 0.17 195) 0%, oklch(0.78 0.18 195) 35%, oklch(0.72 0.2 250) 65%, oklch(0.68 0.2 250) 100%)",
                }}
              >
                AI-Powered
              </span>
              <span className="block text-foreground">Clinical</span>
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, oklch(0.85 0.12 195) 0%, oklch(0.72 0.17 195) 50%, oklch(0.68 0.2 250) 100%)",
                  filter: "drop-shadow(0 0 24px oklch(0.72 0.17 195 / 0.4))",
                }}
              >
                Intelligence
              </span>
              <span className="block text-foreground/70 text-4xl md:text-5xl xl:text-6xl mt-2">
                for Physiotherapy
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 text-base leading-relaxed text-muted-foreground md:text-lg max-w-xl mx-auto lg:mx-0">
              PhysioAssist empowers physiotherapists with AI-driven clinical
              reasoning, camera-based posture analysis, and evidence-based
              patient progress tracking — all in one unified platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                data-ocid="hero.primary_button"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                size="lg"
                className="btn-glow glow-pulse h-16 rounded-2xl px-10 text-lg font-bold bg-primary text-primary-foreground hover:opacity-90 relative overflow-hidden group"
                style={{
                  boxShadow:
                    "0 0 30px oklch(0.72 0.17 195 / 0.5), 0 4px 20px oklch(0.05 0.05 240 / 0.8), inset 0 1px 0 oklch(0.9 0.02 220 / 0.2)",
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {loginStatus === "logging-in" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <Button
                data-ocid="hero.secondary_button"
                onClick={handleTryDemo}
                size="lg"
                variant="outline"
                className="h-16 rounded-2xl px-10 text-lg font-bold border-2 border-primary/50 text-primary bg-primary/8 hover:bg-primary/15 hover:border-primary/80 transition-all"
                style={{
                  boxShadow:
                    "0 0 16px oklch(0.72 0.17 195 / 0.15), inset 0 1px 0 oklch(0.72 0.17 195 / 0.1)",
                }}
              >
                Try Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
              {[
                { icon: CheckCircle, label: "Evidence-based" },
                { icon: Shield, label: "Red-flag safe" },
                { icon: Star, label: "5 clinical domains" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-muted-foreground"
                  style={{
                    background: "oklch(0.22 0.035 240 / 0.8)",
                    border: "1px solid oklch(0.5 0.08 200 / 0.2)",
                  }}
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Skeleton */}
          <div className="relative h-[460px] lg:h-[560px] flex items-center justify-center">
            {/* Glow rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="h-72 w-72 rounded-full border border-primary/10 animate-spin"
                style={{ animationDuration: "20s" }}
              />
              <div
                className="absolute h-56 w-56 rounded-full border border-primary/15 animate-spin"
                style={{
                  animationDuration: "15s",
                  animationDirection: "reverse",
                }}
              />
              <div className="absolute h-40 w-40 rounded-full border border-primary/20" />
              <div
                className="absolute inset-0 rounded-full opacity-30 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.72 0.17 195 / 0.25) 0%, transparent 60%)",
                }}
              />
            </div>
            <SkeletonScene />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground text-xs">
        <span>Scroll to explore</span>
        <div className="h-8 w-px bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
}

// ─── Section: Features ────────────────────────────────────────────────────────
function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  useScrollReveal(sectionRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      card.classList.add("section-hidden");
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.classList.add("section-visible");
            }, i * 100);
            obs.unobserve(card);
          }
        },
        { threshold: 0.1 },
      );
      obs.observe(card);
      observers.push(obs);
    });
    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="section-hidden relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.72 0.17 195 / 0.04), transparent)",
        }}
      />

      <div className="container relative mx-auto px-4">
        {/* Section header */}
        <div className="mb-20 text-center">
          <Badge className="mb-5 badge-neon border-0 px-4 py-2 text-xs font-bold tracking-widest uppercase">
            Core Capabilities
          </Badge>
          <h2 className="font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl leading-tight">
            Built for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.78 0.18 195), oklch(0.72 0.17 195) 40%, oklch(0.72 0.2 250))",
              }}
            >
              Clinical Excellence
            </span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Five integrated AI brains working together to support every stage of
            physiotherapy assessment and treatment.
          </p>
          {/* Decorative line */}
          <div
            className="mt-8 mx-auto w-24 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.72 0.17 195 / 0.6), transparent)",
            }}
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-ocid={f.ocid}
              className="relative overflow-hidden rounded-2xl p-6 group cursor-default transition-all duration-300"
              style={{
                background: "oklch(0.18 0.035 240 / 0.85)",
                border: `1px solid ${f.accentBorder}`,
                backdropFilter: "blur(16px) saturate(1.6)",
                WebkitBackdropFilter: "blur(16px) saturate(1.6)",
                boxShadow: `0 1px 0 oklch(0.9 0.02 220 / 0.1) inset, 0 12px 40px oklch(0.05 0.05 240 / 0.7), 0 0 0 0 ${f.accentColor}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-8px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 1px 0 oklch(0.9 0.02 220 / 0.12) inset, 0 20px 60px oklch(0.05 0.05 240 / 0.8), 0 0 32px ${f.accentColor.replace(")", " / 0.25)")}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 1px 0 oklch(0.9 0.02 220 / 0.1) inset, 0 12px 40px oklch(0.05 0.05 240 / 0.7), 0 0 0 0 ${f.accentColor}`;
              }}
            >
              {/* Top accent gradient flood */}
              <div
                className="absolute inset-0 pointer-events-none opacity-100"
                style={{ background: f.accentGradient }}
              />
              {/* Inner highlight line at top */}
              <div
                className="absolute top-0 left-6 right-6 h-px pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${f.accentColor}, transparent)`,
                  opacity: 0.5,
                }}
              />

              {/* Icon */}
              <div
                className={`relative z-10 mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${f.glow}`}
              >
                <f.icon className={`h-7 w-7 ${f.iconColor}`} />
              </div>

              {/* Illustration */}
              <div className="relative z-10 mb-5">{f.illustration}</div>

              {/* Content */}
              <h3 className="relative z-10 mb-2 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Posture Demo ────────────────────────────────────────────────────
function PostureDemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef as React.RefObject<HTMLElement>);

  const findings = [
    {
      label: "Forward Head Posture",
      status: "warning",
      badge: "MONITOR",
      color: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Rounded Shoulders",
      status: "alert",
      badge: "CORRECTIVE",
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      bg: "bg-orange-500/10",
    },
    {
      label: "Anterior Pelvic Tilt",
      status: "warning",
      badge: "MONITOR",
      color: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Knee Alignment",
      status: "ok",
      badge: "NORMAL",
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <section
      id="posture-demo"
      ref={sectionRef as React.RefObject<HTMLElement>}
      data-ocid="posture_demo.section"
      className="section-hidden relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 50%, oklch(0.68 0.2 250 / 0.06) 0%, transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="mb-20 text-center">
          <Badge className="mb-5 badge-neon border-0 px-4 py-2 text-xs font-bold tracking-widest uppercase">
            AI Posture Screening
          </Badge>
          <h2 className="font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl leading-tight">
            Posture{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.68 0.2 250), oklch(0.72 0.17 195))",
              }}
            >
              Analysis Demo
            </span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real-time body landmark detection and AI-driven postural deviation
            screening from any camera.
          </p>
          <div
            className="mt-8 mx-auto w-24 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.68 0.2 250 / 0.6), transparent)",
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
          {/* Left: Body scan visualization */}
          <div className="relative mx-auto w-full max-w-sm h-[480px] glass-card rounded-3xl overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid opacity-50" />

            {/* Horizontal measurement lines */}
            {[20, 35, 50, 65, 80].map((pct) => (
              <div
                key={pct}
                className="absolute left-0 right-0 flex items-center px-3"
                style={{ top: `${pct}%` }}
              >
                <div
                  className="flex-1 h-px opacity-20"
                  style={{ background: "oklch(0.72 0.17 195)" }}
                />
                <span className="mx-2 text-xs opacity-40 text-primary font-mono">
                  {pct}%
                </span>
                <div
                  className="flex-1 h-px opacity-20"
                  style={{ background: "oklch(0.72 0.17 195)" }}
                />
              </div>
            ))}

            {/* Human silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 120 340"
                className="h-[85%] w-auto opacity-25"
                fill="oklch(0.72 0.17 195 / 0.15)"
                stroke="oklch(0.72 0.17 195)"
                strokeWidth="1.5"
                role="img"
                aria-label="Human body silhouette for posture analysis"
              >
                {/* Head */}
                <ellipse cx="60" cy="28" rx="20" ry="24" />
                {/* Neck */}
                <rect x="54" y="50" width="12" height="16" rx="4" />
                {/* Torso */}
                <path d="M35 66 L85 66 L90 160 L30 160 Z" />
                {/* Arms */}
                <path d="M35 70 L15 130 L12 165" strokeLinecap="round" />
                <path d="M85 70 L105 130 L108 165" strokeLinecap="round" />
                {/* Legs */}
                <path
                  d="M42 160 L35 245 L32 310"
                  strokeLinecap="round"
                  strokeWidth="12"
                />
                <path
                  d="M78 160 L85 245 L88 310"
                  strokeLinecap="round"
                  strokeWidth="12"
                />
                {/* Feet */}
                <ellipse cx="32" cy="315" rx="12" ry="6" />
                <ellipse cx="88" cy="315" rx="12" ry="6" />
              </svg>
            </div>

            {/* Scanning beam */}
            <div
              className="scan-beam absolute left-0 right-0 h-1 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.72 0.17 195 / 0.8), transparent)",
                boxShadow: "0 0 12px oklch(0.72 0.17 195 / 0.5)",
              }}
            />

            {/* Joint dots */}
            {JOINTS.map((j) => (
              <div
                key={j.label}
                className="joint-pulse absolute h-3 w-3 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-default group/joint"
                style={{
                  top: j.top,
                  left: j.left,
                  background: "oklch(0.72 0.17 195 / 0.8)",
                  boxShadow: "0 0 8px oklch(0.72 0.17 195 / 0.6)",
                }}
              >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-primary/50 scale-150" />
              </div>
            ))}

            {/* Corner labels */}
            <div className="absolute top-4 left-4 text-xs font-mono text-primary/60">
              ANTERIOR VIEW
            </div>
            <div className="absolute top-4 right-4 font-mono text-xs text-primary">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                SCANNING
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-xs text-muted-foreground text-center font-mono">
              11 landmarks · 60fps · 94% confidence
            </div>
          </div>

          {/* Right: AI results panel */}
          <div className="space-y-4">
            {/* Header */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  AI Analysis Complete
                </h3>
                <span className="badge-neon rounded-full px-3 py-1 text-xs font-semibold">
                  94% Confidence
                </span>
              </div>

              {/* Findings */}
              <div className="space-y-2">
                {findings.map((f) => (
                  <div
                    key={f.label}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 border ${f.borderColor} ${f.bg}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${f.status === "ok" ? "bg-green-400" : f.status === "warning" ? "bg-yellow-400" : "bg-orange-400"}`}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {f.label}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${f.color}`}>
                      {f.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Provisional impression */}
            <div className="glass-card rounded-2xl p-5 border border-primary/20">
              <h4 className="mb-3 text-sm font-bold text-primary uppercase tracking-wider">
                Provisional Physiotherapy Impression
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Posture patterns are{" "}
                <span className="text-foreground font-medium">
                  consistent with upper crossed syndrome
                </span>
                . Findings suggest cervical and scapular muscle imbalances.
                Likely functional impact on neck mobility and shoulder
                mechanics.
              </p>
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-yellow-500/8 border border-yellow-500/20 p-3">
                <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200/70">
                  This posture assessment is a{" "}
                  <strong>screening tool only</strong> and does not replace an
                  in-person physiotherapy evaluation.
                </p>
              </div>
            </div>

            {/* Corrective focus */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="mb-3 text-sm font-bold text-foreground">
                Suggested Corrective Focus
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                {[
                  "Deep neck flexor activation",
                  "Scapular retraction exercises",
                  "Hip flexor stretching",
                  "Core stabilization",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2"
                  >
                    <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Dashboard Preview ───────────────────────────────────────────────
function DashboardPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef as React.RefObject<HTMLElement>);

  const stats = [
    {
      label: "Active Patients",
      value: "48",
      icon: Users,
      glow: "icon-glow-teal",
      color: "text-primary",
      ocid: "dashboard_preview.stats.item.1",
    },
    {
      label: "Avg. Recovery",
      value: "72%",
      icon: TrendingUp,
      glow: "icon-glow-green",
      color: "text-green-400",
      ocid: "dashboard_preview.stats.item.2",
    },
    {
      label: "Sessions Today",
      value: "12",
      icon: Clock,
      glow: "icon-glow-blue",
      color: "text-blue-400",
      ocid: "dashboard_preview.stats.item.3",
    },
    {
      label: "Red Flags",
      value: "2",
      icon: AlertTriangle,
      glow: "icon-glow-purple",
      color: "text-orange-400",
      ocid: "dashboard_preview.stats.item.4",
    },
  ];

  const insights = [
    {
      icon: TrendingUp,
      text: "Patient #4 shows 40% ROM improvement this week — consider progressing to strengthening phase.",
      color: "text-green-400",
      glow: "icon-glow-green",
    },
    {
      icon: AlertTriangle,
      text: "2 patients flagged for potential red flags. Immediate in-person review recommended.",
      color: "text-orange-400",
      glow: "icon-glow-amber",
    },
    {
      icon: Brain,
      text: "AI suggests updating cervical protocol for 3 patients based on updated outcome data.",
      color: "text-primary",
      glow: "icon-glow-teal",
    },
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="section-hidden relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 50%, oklch(0.72 0.17 195 / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="mb-20 text-center">
          <Badge className="mb-5 badge-neon border-0 px-4 py-2 text-xs font-bold tracking-widest uppercase">
            Analytics Dashboard
          </Badge>
          <h2 className="font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl leading-tight">
            Track{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.68 0.18 155), oklch(0.72 0.17 195))",
              }}
            >
              Patient Progress
            </span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real-time recovery metrics, outcome tracking, and AI-driven insights
            across all patients.
          </p>
          <div
            className="mt-8 mx-auto w-24 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.68 0.18 155 / 0.6), transparent)",
            }}
          />
        </div>

        {/* Stats row */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              data-ocid={s.ocid}
              className="stat-card rounded-2xl p-5 text-center"
            >
              <div
                className={`mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.glow}`}
              >
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className={`font-display text-3xl font-bold ${s.color}`}>
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Chart */}
          <div
            data-ocid="dashboard_preview.chart"
            className="glass-card rounded-2xl p-6 lg:col-span-2"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-foreground">
                ROM vs Pain — Recovery Trend
              </h3>
              <span className="text-xs text-muted-foreground">
                Past 8 weeks
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(100, 200, 200, 0.1)"
                />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "oklch(0.58 0.02 230)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "oklch(0.58 0.02 230)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.03 240 / 0.95)",
                    border: "1px solid oklch(0.5 0.08 200 / 0.3)",
                    borderRadius: "12px",
                    color: "oklch(0.93 0.01 220)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "oklch(0.58 0.02 230)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rom"
                  stroke="#4dc9b8"
                  strokeWidth={2.5}
                  dot={{ fill: "#4dc9b8", r: 4 }}
                  name="ROM %"
                />
                <Line
                  type="monotone"
                  dataKey="pain"
                  stroke="#6680ff"
                  strokeWidth={2.5}
                  dot={{ fill: "#6680ff", r: 4 }}
                  name="Pain Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Insights
            </h3>
            {insights.map((insight) => (
              <div
                key={insight.text.slice(0, 20)}
                className="glass-card card-lift rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${insight.glow}`}
                  >
                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {insight.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Stats Strip ─────────────────────────────────────────────────────
function StatsTrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef as React.RefObject<HTMLElement>);

  const trustStats = [
    { value: "500+", label: "Clinical Assessments", sub: "Across all domains" },
    { value: "98%", label: "Safety Detection", sub: "Red-flag accuracy" },
    {
      value: "4 Domains",
      label: "Specialties Covered",
      sub: "Ortho · Neuro · Cardio · Peds",
    },
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      data-ocid="stats.section"
      className="section-hidden relative py-24 overflow-hidden"
    >
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.72 0.17 195 / 0.03) 0%, oklch(0.68 0.2 250 / 0.04) 100%)",
        }}
      />

      <div className="container relative mx-auto px-4">
        <div className="glass-card rounded-3xl p-8">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:divide-x sm:divide-border">
            {trustStats.map((s) => (
              <div key={s.value} className="px-6">
                <div
                  className="font-display text-5xl font-bold mb-1 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.78 0.18 195), oklch(0.72 0.2 250))",
                  }}
                >
                  {s.value}
                </div>
                <div className="text-base font-semibold text-foreground">
                  {s.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Landing Footer ───────────────────────────────────────────────────────────
function LandingFooter({ login, loginStatus }: LandingPageProps) {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Clinical Reasoning", id: "features" },
    { label: "Posture Demo", id: "posture-demo" },
    { label: "Dashboard Preview", id: "dashboard" },
  ];

  return (
    <footer
      data-ocid="footer.section"
      className="relative pt-16 pb-8 overflow-hidden"
    >
      {/* Glow divider */}
      <div className="divider-glow mb-16 mx-auto max-w-4xl" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 mb-12">
          {/* Left: Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-glow-teal">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                PhysioAssist
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Clinical AI platform for physiotherapists. Assessment, treatment
              planning, and progress tracking powered by evidence-based AI.
            </p>
            <Button
              onClick={login}
              disabled={loginStatus === "logging-in"}
              size="sm"
              className="btn-glow rounded-xl bg-primary text-primary-foreground text-sm px-5"
            >
              {loginStatus === "logging-in" ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />{" "}
                  Connecting...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>

          {/* Center: Quick links */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-foreground uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById(link.id)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Legal */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-foreground uppercase tracking-wider">
              Legal
            </h4>
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-yellow-300">
                  Medical Disclaimer
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                PhysioAssist is a clinical decision-support tool and does not
                replace licensed physiotherapy care. Always consult a qualified
                physiotherapist for diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} PhysioAssist. Built with{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Clinical decision-support only · Not a substitute for professional
            care
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main LandingPage Export ──────────────────────────────────────────────────
export default function LandingPage({ login, loginStatus }: LandingPageProps) {
  return (
    <div className="bg-background text-foreground">
      <HeroSection login={login} loginStatus={loginStatus} />
      <FeaturesSection />
      <PostureDemoSection />
      <DashboardPreviewSection />
      <StatsTrustSection />
      <LandingFooter login={login} loginStatus={loginStatus} />
    </div>
  );
}
