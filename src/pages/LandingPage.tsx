import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets,
  ArrowRight,
  Shield,
  Activity,
  Brain,
  Zap,
  MapPin,
  Bell,
  Cpu,
  Radio,
  CheckCircle,
  Play,
  Terminal,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/landing/Navbar';
import { LoginModal } from '@/components/LoginModal';
import bg1 from '@/images/15.jpg';
import bg2 from '@/images/5.jpg';
import bg3 from '@/images/7.jpg';
import bg4 from '@/images/10.jpg';
import bg5 from '@/images/11.jpg';
import bg6 from '@/images/13.jpg';
import bg7 from '@/images/25.jpg';

export function LandingPage() {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const [degradationScore, setDegradationScore] = useState(12);
   const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
   const [activeBackground, setActiveBackground] = useState(0);
   const [loginModalOpen, setLoginModalOpen] = useState(false);
   const heroBackgrounds = [bg1, bg2, bg3, bg4, bg5, bg6, bg7];

  // Background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }> = [];

    for (let i = 0; i < 70; i++) {
      const isCyan = Math.random() > 0.4;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.6 + 0.1,
        color: isCyan ? '6, 182, 212' : '59, 130, 246', // Cyan or Blue
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Overlay
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${particle.color}, ${particle.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Connect particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 160) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * (1 - distance / 160)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBackground((previous) => (previous + 1) % heroBackgrounds.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [heroBackgrounds.length]);

  const runAiSimulation = () => {
    if (aiAnalysisRunning) return;
    setAiAnalysisRunning(true);
    let current = 12;
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 15) + 5;
      current += change;
      if (current >= 94) {
        current = 94.6;
        clearInterval(interval);
        setAiAnalysisRunning(false);
      }
      setDegradationScore(Number(current.toFixed(1)));
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-200">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-grid-cyber">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* ── ROTATING IMAGE BACKGROUNDS ── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {heroBackgrounds.map((image, index) => (
            <div
              key={image}
              aria-hidden
              className={
                `absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-1200 ${
                  index === activeBackground ? 'opacity-100' : ''
                }`
              }
              style={{ backgroundImage: `url(${image})`, mixBlendMode: 'screen' }}
            />
          ))}
          <div className="absolute inset-0 bg-cyan-950/70 mix-blend-multiply" />
        </div>

        {/* Glow ambient effects (subtle, white tones) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/6 rounded-full blur-[120px] pointer-events-none animate-pulse-soft" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-white/6 rounded-full blur-[120px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '1.5s' }} />

         <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-12 pb-24">

          {/* Badge start-up modern */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-2 mb-8 animate-fade-in glow-border-cyan">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              Plateforme Cyber-Industrielle 4.0
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight leading-none">
            Qatra Mind
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Every Drop Matters
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-3xl text-lg sm:text-2xl text-slate-400 mb-12 font-light leading-relaxed">
            Découvrez <strong className="text-white font-semibold">Qatra Mind</strong>, la plateforme intelligente de détection préventive de fuites. Combinez jumeau numérique 3D, analyse acoustique spectrale et algorithmes d'intelligence artificielle pour préserver chaque goutte d'eau.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button onClick={() => setLoginModalOpen(true)} size="lg" className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-600 hover:to-indigo-800 text-white font-bold px-10 py-7 text-lg rounded-xl shadow-[0_4px_30px_rgba(6,182,212,0.4)] transition-all duration-300 transform hover:-translate-y-1">
              Lancer le Dashboard
              <ArrowRight className="ml-3 h-5 w-5 text-white" />
            </Button>
            <a href="#interactive-map" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-800 text-slate-300 bg-slate-950/60 hover:bg-slate-900 hover:text-white px-10 py-7 text-lg rounded-xl border border-cyan-500/10 transition-all duration-300 hover:border-cyan-500/30">
                <Play className="mr-3 h-5 w-5 text-cyan-400 animate-pulse" />
                Démonstration Interactive
              </Button>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-4 max-w-5xl mx-auto">
            {[
              { value: '99.8%', label: 'Précision de Détection IA', icon: Brain, color: 'text-cyan-400' },
              { value: '< 45s', label: 'Temps de Réaction Alerte', icon: Zap, color: 'text-amber-400' },
              { value: '-42%', label: 'Pertes en Eau Réduites', icon: TrendingDown, color: 'text-green-400' },
              { value: '1.2M', label: 'm³ Préservés / An', icon: Droplets, color: 'text-blue-400' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-premium rounded-2xl p-6 border border-slate-900 hover:border-slate-800/80 transition-all text-left group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                    <Icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Diagonal fade out bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="py-32 relative bg-[#040817] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-30">
            <img
              src={heroBackgrounds[(activeBackground + 2) % heroBackgrounds.length]}
              alt="Architecture IoT" 
              className="h-full w-full object-cover object-center filter blur-3xl brightness-75"
            />
            <div className="absolute inset-0 bg-[#040817]/80" />
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-24 max-w-3xl mx-auto">
            <div className="inline-flex h-9 items-center justify-center rounded-full bg-cyan-950/50 px-4 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Intelligence Hardware & Software
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
              Architecture IoT Trilatérale
            </h2>
            <p className="text-lg text-slate-400 font-light">
              Qatra Mind déploie un écosystème interconnecté associant capteurs acoustiques, transmetteurs de pression et modèles neuronaux prédictifs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Cpu,
                title: 'Capteurs Acoustiques IoT',
                desc: 'Analyse continue des vibrations dans la tuyauterie pour repérer les fréquences de fuite microscopiques (0.1 Hz - 20 kHz).',
                badge: 'Hardware Pro',
                color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/20 text-cyan-400'
              },
              {
                icon: Brain,
                title: 'Deep Learning Neural Net',
                desc: 'Des algorithmes intelligents entraînés sur 5 ans d\'historique SONEDE modélisent les flux de pression et prédisent les ruptures.',
                badge: 'IA Prédictive',
                color: 'from-purple-500/20 to-pink-500/20 border-purple-500/20 text-purple-400'
              },
              {
                icon: Activity,
                title: 'Monitoring Hydrique Live',
                desc: 'Dashboard temps réel mesurant le débit, la pression résiduelle, le pH et l\'oxygène dissous avec rafraîchissement millisecondes.',
                badge: 'Real-time',
                color: 'from-green-500/20 to-emerald-500/20 border-green-500/20 text-green-400'
              },
              {
                icon: Shield,
                title: 'Chiffrement Cyber-Physique',
                desc: 'Intégrité de bout en bout des capteurs IoT. Protocoles sécurisés de qualité militaire empêchant l\'intrusion ou le sabotage du réseau.',
                badge: 'Cybersécurité',
                color: 'from-indigo-500/20 to-blue-600/20 border-indigo-500/20 text-indigo-400'
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="group relative rounded-3xl border border-slate-900 bg-slate-950/40 p-8 hover:bg-slate-950 transition-all duration-500 flex flex-col justify-between overflow-hidden">
                  {/* Subtle neon glow border */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.color} border`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/60">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="mb-4 text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-semibold text-slate-500 group-hover:text-cyan-400 transition-colors cursor-pointer">
                    En savoir plus <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. SMART ANALYTICS SECTION (STRIKING PREVIEW) */}
      <section id="analytics" className="py-32 relative bg-[#030712] border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">

            <div className="relative">
              {/* Premium Dashboard Preview with futuristic styling */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl opacity-10 blur-3xl pointer-events-none" />
              <div className="relative rounded-2xl border border-cyan-500/20 bg-slate-950 p-6 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent" />

                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Analyses Acoustiques Spectrales</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-800" />
                    <span className="h-2 w-2 rounded-full bg-slate-800" />
                    <span className="h-2 w-2 rounded-full bg-slate-800" />
                  </div>
                </div>

                {/* Simulated Chart area */}
                <div className="space-y-6">
                  <div className="h-48 relative border-b border-slate-900 flex items-end justify-between px-2">
                    {/* Simulated Waveform chart */}
                    {[45, 68, 52, 90, 85, 30, 42, 60, 75, 48, 62, 70, 95, 50, 40].map((h, i) => (
                      <div key={i} className="w-[5%] group relative flex flex-col items-center justify-end h-full">
                        <div
                          className={`w-full rounded-t transition-all duration-1000 ${h > 80
                            ? 'bg-gradient-to-t from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                            : 'bg-slate-800 group-hover:bg-slate-700'
                            }`}
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[9px] text-slate-600 mt-2 font-mono">{i * 2}h</span>
                      </div>
                    ))}
                    <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-cyan-500/20 border-dashed" />
                    <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-cyan-500/10 border-dashed" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-[#090d19] p-4 border border-cyan-500/5">
                      <span className="text-xs text-slate-500 uppercase tracking-widest">Fréquence de Résonance</span>
                      <div className="text-xl font-bold text-white font-mono mt-1">482.4 Hz</div>
                    </div>
                    <div className="rounded-xl bg-[#090d19] p-4 border border-cyan-500/5">
                      <span className="text-xs text-slate-500 uppercase tracking-widest">Indice Acoustique global</span>
                      <div className="text-xl font-bold text-cyan-400 font-mono mt-1">Optimal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex h-9 items-center justify-center rounded-full bg-cyan-950/50 px-4 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase">
                Section 3 - Analyse Avancée
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Smart Analytics : Interpréter l'Invisible
              </h2>
              <p className="text-lg text-slate-400 font-light">
                À travers l'extraction des données hydro-acoustiques et l'analyse spectrale transitoire, Ma2Guard identifie le développement de micro-fissures superficielles avant qu'elles ne se transforment en fuites de surface dévastatrices.
              </p>

              <ul className="space-y-4">
                {[
                  { text: 'Identification automatique des signatures spectrales anormales.', color: 'text-cyan-400' },
                  { text: 'Analyse spectrale de Fourier (FFT) appliquée aux vibrations de l\'eau.', color: 'text-cyan-400' },
                  { text: 'Rapports prédictifs hebdomadaires de l\'état structurel des vannes.', color: 'text-cyan-400' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/30">
                      <CheckCircle className={`h-4.5 w-4.5 ${item.color}`} />
                    </div>
                    <span className="text-slate-300 font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 4. LIVE MONITORING SECTION */}
      <section id="monitoring" className="py-32 relative bg-[#040817] border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">

            <div className="space-y-8 lg:order-first">
              <div className="inline-flex h-9 items-center justify-center rounded-full bg-cyan-950/50 px-4 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase">
                Supervision Intelligente
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Supervision Live & Alertes Instantanées
              </h2>
              <p className="text-lg text-slate-400 font-light">
                Chaque anomalie de débit ou de pression active instantanément le pipeline d'alerte Ma2Guard. Les techniciens reçoivent une notification interactive détaillée avec géolocalisation ultra-précise au centimètre près.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-premium rounded-2xl p-5 border border-slate-900">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-red-500/10 rounded-lg text-red-500"><Bell className="h-5 w-5" /></span>
                    <span className="font-semibold text-white">Alertes SMS & Push</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Notifications urgentes distribuées via API en moins de 5 secondes après détection.</p>
                </div>

                <div className="glass-premium rounded-2xl p-5 border border-slate-900">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500"><Radio className="h-5 w-5" /></span>
                    <span className="font-semibold text-white">Rapport Acoustique IoT</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Attachement automatique d'une courbe FFT transitoire pour une évaluation instantanée du danger.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Alert Feed Simulation */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl opacity-10 blur-3xl pointer-events-none" />
              <div className="relative rounded-2xl border border-slate-800 bg-[#060a16] p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                    Flux d'Alertes Système
                  </h3>
                  <span className="text-[10px] bg-red-500/10 text-red-500 font-bold border border-red-500/20 px-2 py-0.5 rounded">LIVE TELEMETRY</span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'AL-9082', type: 'CRITIQUE', location: 'Manar 1 - Secteur C2', message: 'Baisse brutale de pression (-1.4 bar)', time: 'À l\'instant', color: 'border-red-500 bg-red-500/5 text-red-400' },
                    { id: 'AL-9081', type: 'WARNING', location: 'Ariana - Station Pompage 3', message: 'Hausse anormale du débit (+15%)', time: 'Il y a 3 min', color: 'border-amber-500 bg-amber-500/5 text-amber-400' },
                    { id: 'AL-9080', type: 'OPTIMAL', location: 'Cité Ennasr - NP3', message: 'Test acoustique périodique réussi', time: 'Il y a 15 min', color: 'border-green-500 bg-green-500/5 text-green-400' },
                  ].map((alert, i) => (
                    <div key={i} className={`p-4 rounded-xl border border-l-4 flex items-center justify-between ${alert.color}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold">{alert.id}</span>
                          <span className="text-[9px] uppercase tracking-widest font-semibold">{alert.type}</span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium">{alert.message}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {alert.location}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap ml-4">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE WATER MAP SECTION */}
      <section id="interactive-map" className="py-32 relative bg-[#030712] border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-flex h-9 items-center justify-center rounded-full bg-cyan-950/50 px-4 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Visualisation Réseau
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
              Cartographie Réseau Interactif
            </h2>
            <p className="text-lg text-slate-400 font-light">
              Notre outil cartographique de Tunis superpose les données géospatiales SIG avec les relevés de capteurs en temps réel, offrant un contrôle opérationnel absolu.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3 items-stretch">

            {/* Map Preview Left Column */}
            <div className="lg:col-span-2 relative rounded-3xl border border-cyan-500/10 bg-slate-950/40 overflow-hidden min-h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none" />

              {/* Virtual Glowing Water Network Map */}
              <div className="relative w-full h-full max-w-[500px] aspect-square p-8 animate-pulse-soft">
                <svg viewBox="0 0 400 400" className="w-full h-full text-cyan-500/40">
                  {/* Grid Lines of Tunis network */}
                  <path d="M 50,50 L 150,150 L 250,150 L 350,250" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" className="animate-pulse" />
                  <path d="M 150,150 L 200,280 L 100,320" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 250,150 L 300,80 L 350,120" fill="none" stroke="currentColor" strokeWidth="1.5" />

                  {/* Nodes */}
                  <g className="cursor-pointer group">
                    <circle cx="50" cy="50" r="10" className="fill-blue-600 text-blue-400 stroke-white stroke-2" />
                    <circle cx="50" cy="50" r="18" className="fill-none stroke-blue-500 stroke-1 animate-ping" />
                  </g>

                  <g className="cursor-pointer">
                    <circle cx="150" cy="150" r="8" className="fill-cyan-500 text-cyan-400 stroke-white stroke-2" />
                  </g>

                  <g className="cursor-pointer">
                    <circle cx="250" cy="150" r="12" className="fill-red-500 text-red-400 stroke-white stroke-2" />
                    <circle cx="250" cy="150" r="22" className="fill-none stroke-red-500 stroke-1 animate-ping" />
                  </g>

                  <g className="cursor-pointer">
                    <circle cx="350" cy="250" r="8" className="fill-cyan-500 text-cyan-400 stroke-white stroke-2" />
                  </g>

                  <g className="cursor-pointer">
                    <circle cx="200" cy="280" r="9" className="fill-emerald-500 text-emerald-400 stroke-white stroke-2" />
                  </g>

                  {/* Location Text labels */}
                  <text x="75" y="55" fill="#94a3b8" fontSize="10" className="font-mono">Ariana (NP5)</text>
                  <text x="170" y="145" fill="#94a3b8" fontSize="10" className="font-mono">Cité Ennasr (NP3)</text>
                  <text x="270" y="155" fill="#f87171" fontSize="10" className="font-mono font-bold">Manar 1 (FUITE DETECTEE)</text>
                  <text x="215" y="285" fill="#94a3b8" fontSize="10" className="font-mono">Jardin El Manzeh (NP2)</text>
                </svg>
              </div>

              {/* Floating control bar */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl border border-slate-800 bg-slate-950/90 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">SIG Pipeline connecté</span>
                </div>
                <Link to="/dashboard">
                  <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-[#030712] font-semibold text-xs py-1 px-3">
                    Lancer la Carte 3D
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar list items */}
            <div className="flex flex-col justify-between gap-6">
              {[
                { name: 'Cité Ennaser (NP3)', status: 'Optimal', flow: '42.4 m³/h', risk: '1.2%' },
                { name: 'Manar 1 (NP1)', status: 'Fuite Active', flow: '78.1 m³/h', risk: '95.7%' },
                { name: 'Jardin El Manzeh (NP2)', status: 'Optimal', flow: '34.8 m³/h', risk: '0.8%' },
                { name: 'Manar 2 (NP4)', status: 'Attention', flow: '56.2 m³/h', risk: '44.8%' },
              ].map((zone, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border ${zone.status === 'Fuite Active' ? 'border-red-500/20 bg-red-950/10' : zone.status === 'Attention' ? 'border-amber-500/20 bg-amber-950/10' : 'border-slate-800 bg-slate-950/40'} flex flex-col justify-between hover:border-cyan-500/30 transition-all`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white">{zone.name}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${zone.status === 'Fuite Active' ? 'bg-red-500/10 text-red-500 border-red-500/20' : zone.status === 'Attention' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                      {zone.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Débit Actuel: <strong className="text-white font-semibold">{zone.flow}</strong></span>
                    <span>Probabilité de Fuite: <strong className="text-white font-semibold">{zone.risk}</strong></span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. PREDICTIVE AI SECTION */}
      <section id="ai-prediction" className="py-32 relative bg-[#040817] border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12 items-center">

            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex h-9 items-center justify-center rounded-full bg-cyan-950/50 px-4 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase">
                Intelligence Artificielle
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Analyse & Prédiction de Dégradation
              </h2>
              <p className="text-lg text-slate-400 font-light">
                Simulez les contraintes structurelles en temps réel. Notre algorithme évalue l'élasticité du matériau, le débit maximal et le vieillissement thermique pour calculer un score prévisionnel de dégradation.
              </p>

              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5" />
                  Terminal de simulation IA
                </h4>
                <div className="space-y-2 text-xs font-mono text-slate-400">
                  <p className="text-cyan-500">{`> Initializing Neural Pipeline degradation model...`}</p>
                  <p>{`> Fetching dynamic acoustic telemetry for sector [Manar 1]...`}</p>
                  <p>{`> Material constraint: PVC (SDR 21) pressure limit: 14.5 Bar.`}</p>
                  <p className={aiAnalysisRunning ? "text-cyan-400 animate-pulse" : "text-green-500"}>
                    {aiAnalysisRunning ? `> Simulating stress load: Calculating deterioration rate...` : `> Simulation ready. Last score recorded.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="glass-premium rounded-3xl p-8 border border-cyan-500/10 text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                <h3 className="text-xl font-bold text-white">Simulateur Neuronale de Matériau</h3>

                {/* Degradation score display */}
                <div className="relative inline-flex items-center justify-center p-12">
                  <div className="absolute inset-0 w-44 h-44 rounded-full border border-slate-800 animate-pulse-soft" />
                  <div className="absolute inset-2 w-40 h-40 rounded-full border border-cyan-500/20 border-dashed" />
                  <div className="relative text-center z-10">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">SCORE RUPTURE</span>
                    <span className="text-5xl font-extrabold text-white tracking-tight font-mono">{degradationScore}%</span>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">Indice de contrainte</span>
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Pression hydrostatique</span>
                    <span className="text-white font-bold font-mono">4.2 bar</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: '42%' }} />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Vitesse de flux transitoire</span>
                    <span className="text-white font-bold font-mono">1.8 m/s</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '60%' }} />
                  </div>
                </div>

                <Button
                  onClick={runAiSimulation}
                  disabled={aiAnalysisRunning}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-6 rounded-xl transition-all shadow-[0_4px_25px_rgba(6,182,212,0.2)]"
                >
                  {aiAnalysisRunning ? 'Simulation Neuronale en cours...' : 'Exécuter le diagnostic de fissure'}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FOOTER MODERNE */}
      <footer className="border-t border-slate-900 bg-[#02050f] py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-12 md:grid-cols-4 pb-16 border-b border-slate-900">
            <div className="space-y-6 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px]">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#02050f]">
                    <Shield className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
                <span className="text-lg font-bold text-white tracking-wider">
                  Ma2<span className="text-cyan-400">Guard</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Plateforme SaaS cyber-industrielle intelligente dédiée à la détection proactive et à la protection continue des réseaux de distribution d'eau.
              </p>
            </div>

            {[
              { title: 'Produit', links: ['Fonctionnalités', 'Analyses', 'Simulation IA', 'Tarification'] },
              { title: 'Solution', links: ['Jumeau Numérique', 'Capteurs Acoustiques', 'Industrie 4.0', 'Villes Connectées'] },
              { title: 'Entreprise', links: ['À propos', 'Blog', 'Études de cas', 'Carrières'] },
            ].map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{col.title}</h4>
                <ul className="space-y-2 text-xs">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 text-xs text-slate-500 font-mono">
            <p>© 2026 Ma2Guard. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-cyan-400">Confidentialité</a>
              <a href="#" className="hover:text-cyan-400">Mentions Légales</a>
              <a href="#" className="hover:text-cyan-400">Support API</a>
            </div>
          </div>

        </div>
      </footer>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
}
