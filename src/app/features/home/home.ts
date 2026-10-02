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
    <div class="relative min-h-screen overflow-hidden">
      <!-- 3D Canvas Background -->
      <canvas #canvas class="absolute inset-0 z-0"></canvas>
      
      <!-- Overlay Content -->
      <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div #heroContent class="max-w-4xl opacity-0">
          <h1 class="text-5xl md:text-8xl font-bold mb-6 tracking-tighter">
            <span class="gradient-text">GEOVISION</span> AI
          </h1>
          <p class="text-xl md:text-2xl text-slate-400 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
            Unveiling the hidden layers of our planet. Real-time geospatial intelligence powered by neural networks.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/explorer" class="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
              Launch Explorer
            </a>
            <a routerLink="/dashboard" class="px-8 py-4 glass hover:bg-white/10 text-white font-semibold rounded-full transition-all">
              Platform Dashboard
            </a>
          </div>
        </div>

        <!-- Floating Stats -->
        <div #stats class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 opacity-0 translate-y-10">
          <div class="flex flex-col items-center">
            <span class="text-3xl font-bold text-white">2.5M+</span>
            <span class="text-xs text-slate-500 uppercase tracking-widest">Active Nodes</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-3xl font-bold text-white">400TB</span>
            <span class="text-xs text-slate-500 uppercase tracking-widest">Daily Data</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-3xl font-bold text-white">< 50ms</span>
            <span class="text-xs text-slate-500 uppercase tracking-widest">Latency</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-3xl font-bold text-white">99.9%</span>
            <span class="text-xs text-slate-500 uppercase tracking-widest">Accuracy</span>
          </div>
        </div>
      </div>

      <!-- Navigation Overlay -->
      <nav class="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
        <div class="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span class="text-black text-xs font-black italic">G</span>
          </div>
          GEOVISION
        </div>
        <div class="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a routerLink="/ip-intel" class="hover:text-white transition-colors">IP Intel</a>
          <a routerLink="/live" class="hover:text-white transition-colors">Live Tracking</a>
          <a routerLink="/speed-test" class="hover:text-white transition-colors">Speed Test</a>
          <a routerLink="/settings" class="hover:text-white transition-colors">Settings</a>
        </div>
      </nav>
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
