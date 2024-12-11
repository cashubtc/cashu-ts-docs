import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

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
    const particleCount = 700;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const rangeY = 100;
    const baseTTL = 50;
    const rangeTTL = 150;
    const baseSpeed = 0.1;
    const rangeSpeed = 2;
    const baseRadius = 1;
    const rangeRadius = 4;
    const baseHue = 220;
    const rangeHue = 100;
    const noiseSteps = 8;
    const xOff = 0.00125;
    const yOff = 0.00125;
    const zOff = 0.0005;

    let center: number[] = [];
    let tick = 0;
    let particleProps: Float32Array;
    const simplex = createNoise3D();

    // Initialize particles
    const initParticle = (i: number) => {
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
    };

    const rand = (n: number) => Math.random() * n;
    const randRange = (n: number) => n - rand(2 * n);
    const fadeInOut = (t: number, m: number) => {
      let hm = 0.5 * m;
      return Math.abs((t + hm) % m - hm) / hm;
    };
    const lerp = (n1: number, n2: number, speed: number) => (1 - speed) * n1 + speed * n2;
    const TAU = 2 * Math.PI;

    const drawParticle = (x: number, y: number, x2: number, y2: number, life: number, ttl: number, radius: number, hue: number) => {
      ctxA.save();
      ctxA.lineCap = 'round';
      ctxA.lineWidth = radius;
      ctxA.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
      ctxA.beginPath();
      ctxA.moveTo(x, y);
      ctxA.lineTo(x2, y2);
      ctxA.stroke();
      ctxA.closePath();
      ctxA.restore();
    };

    const updateParticle = (i: number) => {
      let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i, i9=8+i;
      let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

      x = particleProps[i];
      y = particleProps[i2];
      n = simplex(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
      vx = lerp(particleProps[i3], Math.cos(n), 0.5);
      vy = lerp(particleProps[i4], Math.sin(n), 0.5);
      life = particleProps[i5];
      ttl = particleProps[i6];
      speed = particleProps[i7];
      x2 = x + vx * speed;
      y2 = y + vy * speed;
      radius = particleProps[i8];
      hue = particleProps[i9];

      drawParticle(x, y, x2, y2, life, ttl, radius, hue);

      life++;

      particleProps[i] = x2;
      particleProps[i2] = y2;
      particleProps[i3] = vx;
      particleProps[i4] = vy;
      particleProps[i5] = life;

      if (life > ttl || x < 0 || x > canvasA.width || y < 0 || y > canvasA.height) {
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
      ctxB.filter = 'blur(8px) brightness(200%)';
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();

      ctxB.save();
      ctxB.filter = 'blur(4px) brightness(200%)';
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
      <main className="h-screen bg-transparent">
        <div className="container mx-auto px-4 h-full flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="text-white space-y-6">
              <div className="flex gap-4 items-center">
                <img
                  src={require("@site/static/img/tslogo.png").default}
                  className="w-12 h-12"
                />
                <h1 className="text-5xl font-extrabold">
                  cashu-ts
                </h1>
              </div>

              <div className="inline-block">
                <pre className="py-2 px-4 rounded bg-purple-900/70 border-2 border-purple-900">
                  <code className="text-purple-300">$ </code>
                  <code>npm i @cashu/cashu-ts</code>
                </pre>
              </div>

              <div className="flex gap-4">
                <a
                  className="px-6 py-3 bg-purple-900 hover:bg-purple-700 rounded-full text-white hover:no-underline hover:text-white font-medium"
                  href={docsLink}
                >
                  Getting Started
                </a>
              </div>
            </div>

            <div className="hidden lg:block text-white">
              <p className="text-2xl">
                Building Web & Node based Cashu apps has never been easier
              </p>
            </div>
          </div>

          <div className="mt-auto mb-8">
            <h2 className="text-white text-xl mb-4 opacity-70">
              Trusted by developers building amazing apps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              {[1, 2, 3].map((_, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded-lg bg-purple-900/30 border border-purple-800/50 p-4 flex items-center justify-center hover:bg-purple-900/40 transition-all duration-300"
                >
                  <img 
                    src={require("@site/static/img/tslogo.png").default}
                    alt="TypeScript Logo"
                    className="w-12 h-12 opacity-70"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
