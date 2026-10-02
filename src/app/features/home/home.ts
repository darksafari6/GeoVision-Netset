import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as THREE from 'three';
import gsap from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="relative min-h-screen overflow-hidden bg-slate-950">
      <!-- 3D Canvas Background -->
      <canvas #canvas class="absolute inset-0 z-0"></canvas>
      
      <!-- Overlay Content -->
      <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 md:px-10 py-20 text-center">
        <div #heroContent class="max-w-5xl opacity-0 translate-y-12 transition-all duration-1000">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-2xl">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Next-Gen Geospatial Node
          </div>

          <h1 class="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-none">
            <span class="gradient-text">GEOVISION</span>
          </h1>
          
          <p class="text-lg md:text-3xl text-slate-400 mb-12 font-light max-w-3xl mx-auto leading-tight md:leading-relaxed">
            Autonomous planetary analysis and location intelligence. <br class="hidden md:block">
            <span class="text-slate-600">The definitive interface for global awareness.</span>
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a routerLink="/explorer" class="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3">
              <span class="material-icons">explore</span>
              Launch Explorer
            </a>
            <a routerLink="/dashboard" class="w-full sm:w-auto px-10 py-5 glass hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all border-white/5 flex items-center justify-center gap-3">
              <span class="material-icons">dashboard</span>
              Platform Hub
            </a>
          </div>
        </div>

        <!-- Dynamic Metrics Grid -->
        <div #stats class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 mt-20 md:mt-32 opacity-0 translate-y-12">
          <div class="flex flex-col items-center glass p-6 rounded-3xl min-w-[140px] md:min-w-[180px] border-white/5">
            <span class="text-2xl md:text-4xl font-black text-white mb-1 font-mono tracking-tighter">2.5M+</span>
            <span class="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Active Nodes</span>
          </div>
          <div class="flex flex-col items-center glass p-6 rounded-3xl min-w-[140px] md:min-w-[180px] border-white/5">
            <span class="text-2xl md:text-4xl font-black text-emerald-400 mb-1 font-mono tracking-tighter">400TB</span>
            <span class="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Daily Index</span>
          </div>
          <div class="flex flex-col items-center glass p-6 rounded-3xl min-w-[140px] md:min-w-[180px] border-white/5">
            <span class="text-2xl md:text-4xl font-black text-indigo-400 mb-1 font-mono tracking-tighter">&lt; 50ms</span>
            <span class="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Latency</span>
          </div>
          <div class="flex flex-col items-center glass p-6 rounded-3xl min-w-[140px] md:min-w-[180px] border-white/5">
            <span class="text-2xl md:text-4xl font-black text-white mb-1 font-mono tracking-tighter">99.9%</span>
            <span class="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Precision</span>
          </div>
        </div>
      </div>

      <!-- Footer / Legal Mobile Overlay -->
      <div class="absolute bottom-6 left-0 right-0 px-8 text-center md:text-left z-20 pointer-events-none">
        <div class="text-[9px] text-slate-700 uppercase tracking-[0.5em] font-bold">
          GeoVision Unified Protocol v1.0.4-Build-X
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroContent', { static: true }) heroContent!: ElementRef<HTMLDivElement>;
  @ViewChild('stats', { static: true }) stats!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initThree();
      this.initAnimations();
    }
  }

  private initThree() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement, antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create a particle sphere
    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const radius = 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i+2] = radius * Math.cos(phi);

      colors[i] = Math.random() * 0.5 + 0.5;
      colors[i+1] = Math.random() * 0.5 + 0.5;
      colors[i+2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 8;

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.001;
      points.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  private initAnimations() {
    gsap.to(this.heroContent.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.5
    });

    gsap.to(this.stats.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 1.2
    });
  }
}
