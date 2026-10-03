import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { GeoService } from '../../core/services/geo.service';

@Component({
  selector: 'app-explorer', standalone: true, imports: [CommonModule, DecimalPipe, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      @if (mode() === 'globe') { <canvas #globe class="absolute inset-0 h-full w-full"></canvas> } @else { <div #mapContainer class="absolute inset-0"></div> }
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#02061799_85%)]"></div>
      <section class="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 md:p-8">
        <div class="pointer-events-auto flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div class="glass rounded-2xl border border-white/10 px-4 py-3 backdrop-blur-xl"><p class="text-[9px] font-black uppercase tracking-[0.35em] text-emerald-400">Earth Explorer</p><p class="mt-1 font-mono text-xs text-slate-300">{{ lat() | number:'1.4-4' }}°, {{ lng() | number:'1.4-4' }}°</p></div>
          <form (ngSubmit)="search()" class="glass flex w-full max-w-md items-center gap-2 rounded-2xl border border-white/10 p-2 backdrop-blur-xl"><label for="explorer-query" class="sr-only">Search place</label><input id="explorer-query" name="query" [(ngModel)]="query" placeholder="Search a place…" class="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"/><button class="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-black text-black">GO</button></form>
        </div>
        <div class="pointer-events-auto flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div class="glass rounded-2xl border border-white/10 p-2 backdrop-blur-xl"><div class="grid grid-cols-2 gap-1"><button (click)="setMode('globe')" [class.bg-emerald-400]="mode() === 'globe'" [class.text-black]="mode() === 'globe'" class="rounded-xl px-4 py-2 text-[10px] font-black tracking-widest">3D GLOBE</button><button (click)="setMode('map')" [class.bg-emerald-400]="mode() === 'map'" [class.text-black]="mode() === 'map'" class="rounded-xl px-4 py-2 text-[10px] font-black tracking-widest">2D MAP</button></div></div>
          <div class="flex gap-2"><button (click)="locateMe()" class="glass rounded-2xl border border-white/10 px-5 py-3 text-xs font-black backdrop-blur-xl">◎ SYNC LOCATION</button><button (click)="zoom(1)" class="glass rounded-2xl border border-white/10 px-4 py-3 text-xs font-black backdrop-blur-xl">＋</button><button (click)="zoom(-1)" class="glass rounded-2xl border border-white/10 px-4 py-3 text-xs font-black backdrop-blur-xl">−</button></div>
        </div>
      </section>
    </main>`
})
export class Explorer implements OnInit, OnDestroy {
  @ViewChild('globe', { static: false }) globeCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('mapContainer', { static: false }) mapContainer?: ElementRef<HTMLDivElement>;
  private platformId = inject(PLATFORM_ID); private geo = inject(GeoService);
  private scene?: THREE.Scene; private camera?: THREE.PerspectiveCamera; private renderer?: THREE.WebGLRenderer; private earth?: THREE.Mesh; private animation = 0; private map: any; private mapLayer: any;
  mode = signal<'globe' | 'map'>('globe'); lat = signal(20); lng = signal(0); query = ''; private dragging = false; private lastX = 0;
  private cities = [{ name: 'London', lat: 51.5074, lon: -0.1278 }, { name: 'New York', lat: 40.7128, lon: -74.006 }, { name: 'Tokyo', lat: 35.6762, lon: 139.6503 }, { name: 'Lahore', lat: 31.5204, lon: 74.3587 }, { name: 'Sydney', lat: -33.8688, lon: 151.2093 }];

  ngOnInit() { if (isPlatformBrowser(this.platformId)) setTimeout(() => this.initGlobe()); }
  ngOnDestroy() { cancelAnimationFrame(this.animation); this.renderer?.dispose(); this.map?.remove(); }
  setMode(mode: 'globe' | 'map') { this.mode.set(mode); setTimeout(() => mode === 'globe' ? this.initGlobe() : this.initMap()); }

  private initGlobe() {
    if (!this.globeCanvas) return;
    this.renderer?.dispose(); this.scene = new THREE.Scene(); this.camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100); this.camera.position.z = 3.2;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.globeCanvas.nativeElement, antialias: true, alpha: true }); this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); this.renderer.setSize(innerWidth, innerHeight);
    const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85, metalness: 0.05 })); this.scene.add(this.earth);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.035, 64, 64), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.08, side: THREE.BackSide })); this.scene.add(atmosphere);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2)); const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(4, 2, 5); this.scene.add(sun);
    const stars = new THREE.BufferGeometry(); const positions = new Float32Array(1800 * 3); for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 20; stars.setAttribute('position', new THREE.BufferAttribute(positions, 3)); this.scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ size: 0.018, color: 0xffffff })));
    const canvas = this.globeCanvas.nativeElement; canvas.onpointerdown = e => { this.dragging = true; this.lastX = e.clientX; canvas.setPointerCapture(e.pointerId); }; canvas.onpointermove = e => { if (!this.dragging || !this.earth) return; this.earth.rotation.y += (e.clientX - this.lastX) * 0.005; this.lastX = e.clientX; }; canvas.onpointerup = () => this.dragging = false; canvas.onwheel = e => { e.preventDefault(); this.zoom(e.deltaY > 0 ? -1 : 1); };
    const render = () => { this.animation = requestAnimationFrame(render); if (this.earth && !this.dragging) this.earth.rotation.y += 0.0007; this.renderer?.render(this.scene!, this.camera!); }; render();
  }

  private async initMap() { if (!this.mapContainer || !isPlatformBrowser(this.platformId)) return; const L = await import('leaflet'); this.map?.remove(); this.map = L.map(this.mapContainer.nativeElement, { center: [this.lat(), this.lng()], zoom: 3, zoomControl: false }); this.mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(this.map); this.map.on('move', () => { const c = this.map.getCenter(); this.lat.set(c.lat); this.lng.set(c.lng); }); }
  async search() { if (!this.query.trim()) return; try { const places = await this.geo.searchPlaces(this.query.trim()); const p = places[0]; if (!p) return; this.lat.set(+p.lat); this.lng.set(+p.lon); this.setMode('map'); setTimeout(() => this.map?.setView([+p.lat, +p.lon], 12)); } catch (e) { console.error(e); } }
  async locateMe() { try { const p = await this.geo.getUserLocation(); this.lat.set(p.coords.latitude); this.lng.set(p.coords.longitude); this.setMode('map'); setTimeout(() => this.map?.setView([this.lat(), this.lng()], 14)); } catch (e) { console.error(e); } }
  zoom(direction: number) { if (this.mode() === 'map') { const z = this.map?.getZoom() ?? 3; this.map?.setZoom(Math.max(1, Math.min(18, z + direction))); } else if (this.camera) this.camera.position.z = Math.max(1.6, Math.min(6, this.camera.position.z - direction * 0.35)); }
}
