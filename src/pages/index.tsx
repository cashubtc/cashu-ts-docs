import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';
import cashuLogo from '@site/static/img/cashu-no-bg.png';

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
    const particleCount = 500;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const rangeY = 100;
    const baseTTL = 50;
    const rangeTTL = 150;
    const baseSpeed = 0.05;
    const rangeSpeed = 1;
    const baseRadius = 0.5;
    const rangeRadius = 2;
    const baseHue = 220;
    const rangeHue = 100;
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
        const opacity = 0.06; // Constant opacity instead of fade
        ctxA.globalAlpha = opacity;
        const angle = Math.atan2(y2 - y, x2 - x);
        ctxA.translate(x, y);
        ctxA.rotate(angle);
        ctxA.drawImage(logoImage, -logoSize/2, -logoSize/2, logoSize, logoSize);
      } else {
        // Original line drawing code for all other particles
        ctxA.lineCap = 'round';
        ctxA.lineWidth = radius;
        ctxA.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
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
      ctxB.filter = 'blur(8px) brightness(150%)';
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();

      ctxB.save();
      ctxB.filter = 'blur(4px) brightness(150%)';
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
        <div className="container mx-auto px-4 h-full flex flex-col">
          <div className="flex flex-col h-full">
            <div className="mb-12">
              <h1 className="text-7xl font-extrabold mb-4 text-white">
                <span className="font-jersey">Cashu TS</span>
              </h1>
              <h2 className="text-4xl font-dm-mono text-purple-100">
                a lightweight library for Cashu development.
              </h2>
              
              <p className="text-2xl text-white/90 mt-6 max-w-2xl">
                We handle the groundwork, you ship the features. 
                Build your Cashu app with confidence using cashu-ts.
              </p>
            </div>

            <div className="mb-8">
              <pre className="inline-block py-3 px-6 rounded bg-purple-900/70 border-2 border-purple-900">
                <code className="text-purple-300">$ </code>
                <code>npm i @cashu/cashu-ts</code>
              </pre>
            </div>

            <div className="mb-auto">
              <a
                className="inline-block px-8 py-4 bg-purple-900 hover:bg-purple-700 rounded-full text-white hover:no-underline hover:text-white font-medium text-lg"
                href={docsLink}
              >
                Start Building ↗
              </a>
            </div>

            <div className="mt-12 mb-12">
              <h2 className="text-center text-2xl mb-8 text-gray-400">
                Built with Cashu TS
                <span className="block text-gray-500">building the next generation of digital cash apps</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center max-w-6xl mx-auto px-4">
                {Array(7).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-center w-full opacity-70 hover:opacity-100 transition-opacity duration-300"
                  >
                    <img 
                      src={cashuLogo}
                      alt="Logo placeholder"
                      className="max-w-[50px] h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
