import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';
import cashuLogo from '@site/static/img/Cashume.png';
import tsLogo from '@site/static/img/tslogo.png';
import npubcashLogo from '@site/static/img/npubcash.png';
import bwcLogo from '@site/static/img/bwc.png';
import vpnstrLogo from '@site/static/img/vpnstr.png';
import ndklogo from '@site/static/img/ndk.png';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const docsLink = useBaseUrl("docs/Introduction/getting_started");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const backgroundColor = 'hsla(260,40%,5%,1)';
  
  useEffect(() => {
    console.log('Effect running');
    const container = canvasRef.current?.parentElement;
    if (!container) {
      console.log('No container found');
      return;
    }

    // Create two canvases (one for drawing, one for display)
    const canvasA = document.createElement('canvas');
    const canvasB = canvasRef.current;
    if (!canvasB) {
      console.log('No canvasB found');
      return;
    }

    const ctxA = canvasA.getContext('2d');
    const ctxB = canvasB.getContext('2d');
    if (!ctxA || !ctxB) {
      console.log('Could not get contexts');
      return;
    }

    console.log('Canvas setup complete');

    // Make sure canvasA is also added to the DOM
    canvasA.style.display = 'none';
    container.appendChild(canvasA);

    // Constants
    const particleCount = 300;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const rangeY = 150;
    const baseTTL = 100;
    const rangeTTL = 200;
    const baseSpeed = 0.03;
    const rangeSpeed = 0.5;
    const baseRadius = 0.3;
    const rangeRadius = 1;
    const baseHue = 260;
    const rangeHue = 40;
    const noiseSteps = 6;
    const xOff = 0.00125;
    const yOff = 0.00125;
    const zOff = 0.0003;

    let center: number[] = [];
    let tick = 0;
    let particleProps: Float32Array;
    const simplex = createNoise3D();

    const logoImage = new Image();
    logoImage.src = cashuLogo;
    const logoSize = 16;
    let logoParticleIndex = 0; // Track which particle is the logo
    
    // Initialize particles
    const initParticle = (i: number) => {
      if (i === logoParticleIndex) {
        // Special initialization for logo particle
        let x = rand(canvasA.width);
        let y = center[1] + randRange(rangeY);
        let vx = 0;
        let vy = 0;
        let life = 0;
        let ttl = Infinity;
        let speed = baseSpeed * 1.2; // Normal speed
        let radius = baseRadius;
        let hue = baseHue;

        particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
      } else {
        // Original initialization for regular particles
        let x = rand(canvasA.width);
        let y = center[1] + randRange(rangeY);
        let vx = 0;
        let vy = 0;
        let life = 0;
        let ttl = baseTTL + rand(rangeTTL);
        let speed = baseSpeed + rand(rangeSpeed);
        let radius = baseRadius + rand(rangeRadius);
        let hue = baseHue + rand(rangeHue);

        particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
      }
    };

    const rand = (n: number) => Math.random() * n;
    const randRange = (n: number) => n - rand(2 * n);
    const fadeInOut = (t: number, m: number) => {
      let hm = 0.5 * m;
      return Math.abs((t + hm) % m - hm) / hm;
    };
    const lerp = (n1: number, n2: number, speed: number) => (1 - speed) * n1 + speed * n2;
    const TAU = 2 * Math.PI;

    const drawParticle = (x: number, y: number, x2: number, y2: number, life: number, ttl: number, radius: number, hue: number, index: number) => {
      ctxA.save();
      
      if (index === logoParticleIndex) {
        const opacity = 0.04;
        ctxA.globalAlpha = opacity;
        const angle = Math.atan2(y2 - y, x2 - x);
        ctxA.translate(x, y);
        ctxA.rotate(angle);
        ctxA.drawImage(logoImage, -logoSize/2, -logoSize/2, logoSize, logoSize);
      } else {
        ctxA.lineCap = 'round';
        ctxA.lineWidth = radius;
        ctxA.strokeStyle = `hsla(${hue},85%,65%,${fadeInOut(life, ttl) * 0.5})`;
        ctxA.beginPath();
        ctxA.moveTo(x, y);
        ctxA.lineTo(x2, y2);
        ctxA.stroke();
        ctxA.closePath();
      }
      
      ctxA.restore();
    };

    const updateParticle = (i: number) => {
      let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i, i9=8+i;
      let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

      x = particleProps[i];
      y = particleProps[i2];
      
      if (i === logoParticleIndex) {
        // Regular noise movement but with reduced range
        n = simplex(x * xOff, y * yOff, tick * zOff) * (noiseSteps * 0.4) * TAU;
      } else {
        n = simplex(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
      }

      vx = lerp(particleProps[i3], Math.cos(n), 0.5);
      vy = lerp(particleProps[i4], Math.sin(n), 0.5);
      life = particleProps[i5];
      ttl = particleProps[i6];
      speed = particleProps[i7];
      x2 = x + vx * speed;
      y2 = y + vy * speed;
      radius = particleProps[i8];
      hue = particleProps[i9];

      drawParticle(x, y, x2, y2, life, ttl, radius, hue, i);

      life++;

      particleProps[i] = x2;
      particleProps[i2] = y2;
      particleProps[i3] = vx;
      particleProps[i4] = vy;
      particleProps[i5] = life;

      // Handle screen boundaries for logo particle
      if (i === logoParticleIndex) {
        if (x2 < 0) particleProps[i] = canvasA.width;
        if (x2 > canvasA.width) particleProps[i] = 0;
        if (y2 < 0) particleProps[i2] = canvasA.height;
        if (y2 > canvasA.height) particleProps[i2] = 0;
      } else if (life > ttl || x < 0 || x > canvasA.width || y < 0 || y > canvasA.height) {
        initParticle(i);
      }
    };

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      
      canvasA.width = innerWidth;
      canvasA.height = innerHeight;
      canvasB.width = innerWidth;
      canvasB.height = innerHeight;
      
      center[0] = 0.5 * innerWidth;
      center[1] = 0.5 * innerHeight;
      
      console.log('Canvas resized:', innerWidth, innerHeight);
    };

    const renderGlow = () => {
      ctxB.save();
      ctxB.filter = 'blur(6px) brightness(120%)';
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();

      ctxB.save();
      ctxB.filter = 'blur(2px) brightness(120%)';
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    };

    const renderToScreen = () => {
      ctxB.save();
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    };

    // Initialize
    resize();
    particleProps = new Float32Array(particlePropsLength);
    
    console.log('Initializing particles');
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }

    const animate = () => {
      tick++;
      
      ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
      ctxB.fillStyle = backgroundColor;
      ctxB.fillRect(0, 0, canvasA.width, canvasA.height);

      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        updateParticle(i);
      }
      
      renderGlow();
      renderToScreen();

      if (tick % 60 === 0) {
        console.log('Animation frame:', tick);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    console.log('Starting animation');
    animate();
    window.addEventListener('resize', resize);

    return () => {
      console.log('Cleaning up');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resize);
      container.removeChild(canvasA);
    };
  }, []);

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ 
          background: backgroundColor,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <main className="h-screen bg-transparent pt-24">
        <div className="h-full flex flex-col">
          <div className="container mx-auto px-4">
            <div className="mb-12 relative">
              <div className="absolute -z-1 blur-3xl opacity-30 animate-pulse bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-blue-600/20 w-full h-[200px] top-0" />
              
              <h1 className="text-4xl md:text-8xl font-extrabold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                <span className="mono-text">Cashu TS</span>
              </h1>
              <h2 className="text-2xl md:text-4xl font-dm-mono text-zinc-50 tracking-tight">
                A powerful toolkit for <span className="text-purple-400">Cashu development</span>.
              </h2>
              
              <p className="text-lg md:text-xl text-zinc-400 mt-8 max-w-2xl leading-relaxed">
                Build secure, scalable Cashu applications with confidence.<br className="hidden md:block"></br>
                We handle complexity, you ship.
              </p>
            </div>

            <div className="mb-8 group">
              <pre className="inline-block py-4 px-8 rounded-lg bg-purple-950/50 border border-purple-800/30 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-700/50 group-hover:shadow-lg group-hover:shadow-purple-900/20">
                <code className="text-purple-300 select-none">$ </code>
                <code className="text-zinc-100">npm i @cashu/cashu-ts</code>
              </pre>
            </div>

            <div className="mb-auto">
              <a
                className="group relative inline-flex items-center gap-2 px-8 py-4 
                  bg-gradient-to-r from-purple-600 to-purple-800
                  hover:from-purple-500 hover:to-purple-700
                  text-white hover:text-white
                  font-medium text-lg rounded-lg
                  transition-all duration-300 ease-out
                  border border-purple-600/20"
                href={docsLink}
              >
                <span className="text-white">Start Building</span>
                <svg 
                  className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          <div className="w-full mt-24">
            <div className="relative w-full py-24">
              <div className="absolute inset-0 bg-purple-950/5 backdrop-blur-sm" />
              
              <div className="container mx-auto px-4 relative">
                <h2 className="text-center mb-8">
                  <span className="text-4xl font-extrabold text-white block mb-4">
                    Made with Cashu TS
                  </span>
                  <span className="text-2xl text-zinc-400 block max-w-3xl mx-auto">
                  Simplifying the process of building Cashu applications.
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">
                  {/* Cashu.me */}
                  <div className="flex flex-col h-full p-4 md:p-8 rounded-lg 
                    bg-purple-900/10 backdrop-blur-sm border border-purple-900/20
                    transition-all duration-300 hover:bg-purple-900/15
                    hover:border-purple-900/30 hover:transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src={cashuLogo} alt="Cashu.me logo" className="w-8 h-8 object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Cashu.me</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      A modern web wallet built with Quasar and Vue.js, leveraging TypeScript for enhanced reliability. Experience seamless eCash transactions in a user-friendly interface.
                    </p>
                  </div>

                  {/* VPNSTR */}
                  <div className="flex flex-col h-full p-4 md:p-8 rounded-lg 
                    bg-purple-900/10 backdrop-blur-sm border border-purple-900/20
                    transition-all duration-300 hover:bg-purple-900/15
                    hover:border-purple-900/30 hover:transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src={vpnstrLogo} alt="VPNSTR logo" className="w-8 h-8 object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">VPNSTR</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      A privacy-focused VPN service accepting Bitcoin Lightning and Cashu payments. Designed for users who prioritize anonymity and secure internet access.
                    </p>
                  </div>

                  {/* NostrDevKit */}
                  <div className="flex flex-col h-full p-4 md:p-8 rounded-lg 
                    bg-purple-900/10 backdrop-blur-sm border border-purple-900/20
                    transition-all duration-300 hover:bg-purple-900/15
                    hover:border-purple-900/30 hover:transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src={ndklogo} alt="NDK logo" className="w-8 h-8 object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">NostrDevKit (NDK)</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      A comprehensive development kit for building Nostr applications. NDK simplifies the creation of relays, clients, and other Nostr-based solutions with robust tooling.
                    </p>
                  </div>

                  {/* Boardwalk Cash */}
                  <div className="flex flex-col h-full p-4 md:p-8 rounded-lg 
                    bg-purple-900/10 backdrop-blur-sm border border-purple-900/20
                    transition-all duration-300 hover:bg-purple-900/15
                    hover:border-purple-900/30 hover:transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src={bwcLogo} alt="Boardwalk Cash logo" className="w-8 h-8 object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Boardwalk Cash</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      A dollar-based CashuBTC wallet integrating Bitcoin and Nostr. Offering a seamless experience for managing digital cash with built-in social features.
                    </p>
                  </div>

                  {/* Npubcash */}
                  <div className="flex flex-col h-full p-4 md:p-8 rounded-lg 
                    bg-purple-900/10 backdrop-blur-sm border border-purple-900/20
                    transition-all duration-300 hover:bg-purple-900/15
                    hover:border-purple-900/30 hover:transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src={npubcashLogo} alt="Npubcash logo" className="w-8 h-8 object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Npubcash</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      An innovative LNURL service that generates and manages tokens for received payments, enabling seamless offline-to-online transaction experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <footer className="py-8 md:py-16 relative bg-gradient-to-b from-purple-950/5 via-purple-950/10 to-purple-950/20">
              <div className="absolute inset-0 backdrop-blur-[2px]" />
              <div className="container mx-auto px-4 relative">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                  {/* Logo Column */}
                  <div className="flex items-start">
                    <div className="flex items-center gap-4">
                      <img src={tsLogo} alt="TypeScript Logo" className="w-8 h-8 md:w-12 md:h-12" />
                      <span className="text-2xl md:text-3xl font-bold text-white">Cashu TS</span>
                    </div>
                  </div>

                  {/* Spacer Column */}
                  <div></div>

                  {/* Community Column */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Community</h3>
                    <div className="flex flex-col space-y-2">
                      <a href="https://matrix.to/#/#cashu-ts:matrix.cashu.space" className="text-zinc-400 hover:text-purple-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        Matrix
                      </a>
                      <a href="https://t.me/CashuBTC" className="text-zinc-400 hover:text-purple-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        Telegram
                      </a>
                    </div>
                  </div>

                  {/* Resources Column */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Resources</h3>
                    <div className="flex flex-col space-y-2">
                      <a href="https://cashu.space/" className="text-zinc-400 hover:text-purple-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        Official Website
                      </a>
                      <a href="https://github.com/cashubtc/awesome-cashu" className="text-zinc-400 hover:text-purple-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        Awesome Cashu
                      </a>
                      <a href="https://opencash.dev" className="text-zinc-400 hover:text-purple-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        OpenCash Association
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </Layout>
  );
}
