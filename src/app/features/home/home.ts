import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  providers: [DecimalPipe],
  template: `
    <div class="relative bg-slate-950 text-white selection:bg-emerald-500/30">
      
      <!-- Fixed 3D Canvas Background -->
      <canvas #canvas class="fixed inset-0 z-0 pointer-events-none opacity-40"></canvas>

      <!-- Custom Scroll Indicator -->
      <div class="fixed top-0 left-0 w-full h-1 bg-emerald-500/10 z-[100]">
        <div #scrollProgress class="h-full bg-emerald-500 origin-left scale-x-0"></div>
      </div>

      <!-- Main Scrollable Content -->
      <div class="relative z-10">
        
        <!-- HERO SECTION -->
        <section class="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
          <div #heroContent class="max-w-5xl opacity-0 translate-y-12">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em] mb-10 shadow-2xl">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Orbital Node Online
            </div>
            <h1 class="text-7xl md:text-[12rem] font-black tracking-tighter leading-none mb-8 mix-blend-difference">
              GEO<span class="gradient-text">VISION</span>
            </h1>
            <p class="text-xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed mb-12">
              Next-generation planetary intelligence. <br class="hidden md:block">
              Synthesizing millions of data points into a unified visual spectrum.
            </p>
            <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a routerLink="/explorer" class="group relative px-12 py-5 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] flex items-center gap-3">
                <span>Access Explorer</span>
                <span class="material-icons transition-transform group-hover:translate-x-1">arrow_forward</span>
              </a>
              <a routerLink="/dashboard" class="px-12 py-5 glass hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all border-white/5 flex items-center gap-3">
                <span class="material-icons">hub</span>
                System Hub
              </a>
            </div>
          </div>
          
          <!-- Floating Scroll Icon -->
          <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <span class="material-icons text-3xl">expand_more</span>
          </div>
        </section>

        <!-- ABOUT SECTION: SEQUENTIAL APPEARANCE -->
        <section class="min-h-screen py-32 px-6 flex items-center overflow-hidden">
          <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div #aboutText class="space-y-10">
              <h2 class="text-5xl md:text-7xl font-black leading-none">
                Deep Earth <br> <span class="text-emerald-500">Analysis.</span>
              </h2>
              <p class="text-xl text-slate-400 leading-relaxed max-w-xl">
                GeoVision AI utilizes advanced neural networks to map, track, and predict geospatial changes in real-time. From urban sprawl to environmental shifts, our platform provides the precision needed for modern decision-making.
              </p>
              <div class="grid grid-cols-2 gap-8 pt-10">
                <div class="glass p-6 rounded-3xl border-white/5">
                  <div class="text-3xl font-black text-emerald-400 mb-2">99.9%</div>
                  <div class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Data Precision</div>
                </div>
                <div class="glass p-6 rounded-3xl border-white/5">
                  <div class="text-3xl font-black text-indigo-400 mb-2">&lt; 10ms</div>
                  <div class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Latency Floor</div>
                </div>
              </div>
            </div>
            
            <!-- 360° ROTATING CONTENT -->
            <div #rotatingModule class="relative aspect-square flex items-center justify-center">
              <div class="absolute inset-0 bg-emerald-500/10 blur-[150px] rounded-full"></div>
              <div #rotateBox class="w-72 h-72 md:w-96 md:h-92 glass rounded-[4rem] border-white/10 flex flex-col items-center justify-center p-12 text-center shadow-2xl transition-transform">
                <span class="material-icons text-8xl text-emerald-500 mb-8 animate-pulse">language</span>
                <h3 class="text-2xl font-black mb-4">Unified Mesh</h3>
                <p class="text-sm text-slate-400 font-medium">Synchronizing orbital and ground-based telemetry nodes into a single source of truth.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- FEATURE CARDS: IN/OUT SEQUENCE -->
        <section class="min-h-screen py-32 px-6 flex flex-col items-center">
          <h2 #featuresTitle class="text-4xl md:text-6xl font-black mb-24 text-center opacity-0">Platform <span class="text-indigo-400 underline decoration-indigo-500/30">Capabilities</span></h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
            <div class="feature-card glass p-10 rounded-[3rem] border-white/5 group hover:border-emerald-500/20 transition-all cursor-default">
              <div class="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span class="material-icons text-emerald-500 text-3xl">satellite_alt</span>
              </div>
              <h3 class="text-2xl font-bold mb-4">Space-Born Intel</h3>
              <p class="text-slate-500 leading-relaxed">Multi-spectral satellite imagery processed through our custom AI vision layers for unparalleled terrain awareness.</p>
            </div>

            <div class="feature-card glass p-10 rounded-[3rem] border-white/5 group hover:border-indigo-500/20 transition-all cursor-default">
              <div class="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span class="material-icons text-indigo-400 text-3xl">psychology</span>
              </div>
              <h3 class="text-2xl font-bold mb-4">Visual Reasoning</h3>
              <p class="text-slate-500 leading-relaxed">Our Gemini-powered visual engine can identify locations from basic landmarks, flora, and architectural patterns.</p>
            </div>

            <div class="feature-card glass p-10 rounded-[3rem] border-white/5 group hover:border-amber-500/20 transition-all cursor-default">
              <div class="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span class="material-icons text-amber-500 text-3xl">security</span>
              </div>
              <h3 class="text-2xl font-bold mb-4">Cyber Sentinel</h3>
              <p class="text-slate-500 leading-relaxed">Advanced IP intelligence and ASN tracking to verify the origin and security posture of every connected node.</p>
            </div>
          </div>
        </section>

        <!-- DATA VISUALIZATION: PARALLAX BOXES -->
        <section class="py-32 px-6 bg-emerald-500/5 overflow-hidden">
          <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
             <div #parallaxText class="md:w-1/2 space-y-8">
                <div class="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Autonomous Processing</div>
                <h2 class="text-5xl md:text-7xl font-black">Global Data <br> <span class="text-slate-600">Mesh.</span></h2>
                <p class="text-lg text-slate-400 leading-relaxed">Every second, GeoVision ingests terabytes of raw geospatial data. Our distributed mesh network ensures this information is cleaned, indexed, and available for analysis within milliseconds.</p>
                <button routerLink="/speed-test" class="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all hover:bg-emerald-500">Node Performance Log</button>
             </div>

             <div #parallaxBoxes class="md:w-1/2 grid grid-cols-2 gap-6 relative">
                <div class="parallax-item glass p-8 rounded-3xl mt-12 border-white/10 shadow-2xl">
                   <div class="text-4xl font-black text-emerald-500 mb-2">2.4PB</div>
                   <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Storage Pool</div>
                </div>
                <div class="parallax-item glass p-8 rounded-3xl border-white/10 shadow-2xl">
                   <div class="text-4xl font-black text-indigo-500 mb-2">500+</div>
                   <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sat Clusters</div>
                </div>
                <div class="parallax-item glass p-8 rounded-3xl mt-6 border-white/10 shadow-2xl">
                   <div class="text-4xl font-black text-white mb-2">99.9%</div>
                   <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Uptime</div>
                </div>
                <div class="parallax-item glass p-8 rounded-3xl -mt-12 border-white/10 shadow-2xl">
                   <div class="text-4xl font-black text-emerald-400 mb-2">AI</div>
                   <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Powered</div>
                </div>
             </div>
          </div>
        </section>

        <!-- CTA FOOTER -->
        <section class="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div #cta class="max-w-4xl opacity-0 scale-90">
             <h2 class="text-6xl md:text-9xl font-black mb-12">Ready to <span class="gradient-text">Explore?</span></h2>
             <p class="text-2xl text-slate-500 mb-16 max-w-2xl mx-auto">The planet is speaking. Are you listening? Join the vanguard of geospatial intelligence today.</p>
             <a routerLink="/explorer" class="inline-flex items-center gap-4 px-16 py-6 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-full shadow-[0_0_80px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95">
                Initialize Deep Scan
             </a>
             <div class="mt-24 text-[10px] font-bold text-slate-700 uppercase tracking-[0.8em]">
                GeoVision Unified Protocol • Est. 2026
             </div>
          </div>
        </section>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .feature-card { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('scrollProgress', { static: true }) scrollProgress!: ElementRef<HTMLDivElement>;
  @ViewChild('heroContent', { static: true }) heroContent!: ElementRef<HTMLDivElement>;
  @ViewChild('aboutText', { static: true }) aboutText!: ElementRef<HTMLDivElement>;
  @ViewChild('rotateBox', { static: true }) rotateBox!: ElementRef<HTMLDivElement>;
  @ViewChild('featuresTitle', { static: true }) featuresTitle!: ElementRef<HTMLDivElement>;
  @ViewChild('parallaxText', { static: true }) parallaxText!: ElementRef<HTMLDivElement>;
  @ViewChild('parallaxBoxes', { static: true }) parallaxBoxes!: ElementRef<HTMLDivElement>;
  @ViewChild('cta', { static: true }) cta!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private points!: THREE.Points;

  ngOnInit() {
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initThree();
      this.initAnimations();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }

  private initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement, antialias: true, alpha: true });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const radius = 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i+2] = radius * Math.cos(phi);

      colors[i] = Math.random();
      colors[i+1] = Math.random();
      colors[i+2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);

    this.camera.position.z = 12;

    const animate = () => {
      requestAnimationFrame(animate);
      this.points.rotation.y += 0.0005;
      this.points.rotation.x += 0.0002;
      this.renderer.render(this.scene, this.camera);
    };

    animate();

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  private initAnimations() {
    // 1. Global Progress Bar
    gsap.to(this.scrollProgress.nativeElement, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });

    // 2. Hero Reveal
    gsap.to(this.heroContent.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.5
    });

    // 3. Three.js Camera Scroll Sync
    gsap.to(this.camera.position, {
      z: 5,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    // 4. About Text Fade In
    gsap.from(this.aboutText.nativeElement.children, {
      x: -50,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: this.aboutText.nativeElement,
        start: 'top 80%',
      }
    });

    // 5. 360° Rotating Box
    gsap.to(this.rotateBox.nativeElement, {
      rotationY: 360,
      scrollTrigger: {
        trigger: this.rotateBox.nativeElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // 6. Feature Cards Sequence (Appear and slightly move)
    const cards = document.querySelectorAll('.feature-card');
    gsap.from(cards, {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.feature-card',
        start: 'top 85%',
      }
    });

    gsap.to(this.featuresTitle.nativeElement, {
      opacity: 1,
      scrollTrigger: {
        trigger: this.featuresTitle.nativeElement,
        start: 'top 90%',
      }
    });

    // 7. Parallax Items
    const items = document.querySelectorAll('.parallax-item');
    items.forEach((item, i) => {
      gsap.from(item, {
        y: (i % 2 === 0 ? 50 : -50),
        opacity: 0,
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          scrub: 1
        }
      });
    });

    // 8. CTA Scale Up
    gsap.to(this.cta.nativeElement, {
      opacity: 1,
      scale: 1,
      duration: 1,
      scrollTrigger: {
        trigger: this.cta.nativeElement,
        start: 'top 80%',
      }
    });
  }
}
