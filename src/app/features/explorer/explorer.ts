import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { GeoService } from '../../core/services/geo.service';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative h-screen w-full bg-slate-900">
      <!-- Map Container -->
      <div #mapContainer class="absolute inset-0 z-0"></div>
      
      <!-- Placeholder for Server Render -->
      @if (!isBrowser) {
        <div class="absolute inset-0 bg-slate-900 flex items-center justify-center">
          <div class="text-slate-500 animate-pulse">Initializing Global Intelligence...</div>
        </div>
      }

      <!-- Controls Overlay -->
      <div class="absolute top-6 left-6 z-10 flex flex-col gap-4 pointer-events-none">
        <div class="glass p-6 rounded-2xl w-80 pointer-events-auto">
          <h2 class="text-xl font-bold mb-2">Earth Explorer</h2>
          <p class="text-sm text-slate-400 mb-4">Interactive 2D/3D map intelligence.</p>
          
          <div class="space-y-4">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-widest">Map Layers</div>
            <div class="grid grid-cols-2 gap-2">
              <button (click)="setLayer('street')" [class.bg-emerald-500]="activeLayer === 'street'" class="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all">Street</button>
              <button (click)="setLayer('sat')" [class.bg-emerald-500]="activeLayer === 'sat'" class="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all">Satellite</button>
            </div>
            
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-4">Active Coordinates</div>
            <div class="bg-black/40 p-3 rounded-lg font-mono text-xs text-emerald-400">
              LAT: {{ lat() | number:'1.4-4' }}<br>
              LNG: {{ lng() | number:'1.4-4' }}
            </div>

            <button (click)="locateMe()" class="w-full py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20">
              Sync My Location
            </button>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="absolute top-6 right-6 z-10 pointer-events-auto">
        <div class="glass p-2 rounded-full flex items-center gap-2 pl-6 pr-2 shadow-2xl">
          <input 
            type="text" 
            placeholder="Search coordinates or city..." 
            class="bg-transparent border-none outline-none text-sm w-64 text-white placeholder-slate-500"
          >
          <button class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
            <span class="material-icons text-black text-sm">search</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .leaflet-container { background: transparent !important; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Explorer implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private geo = inject(GeoService);
  private platformId = inject(PLATFORM_ID);
  
  isBrowser = isPlatformBrowser(this.platformId);
  private map!: any; // L.Map
  activeLayer: 'street' | 'sat' = 'street';
  lat = signal(0);
  lng = signal(0);

  private streetLayer: any;
  private satLayer: any;

  ngOnInit() {
    if (this.isBrowser) {
      this.initMap();
    }
  }

  private async initMap() {
    const L = await import('leaflet');
    
    this.streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    });

    this.satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri'
    });

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [20, 0],
      zoom: 3,
      zoomControl: false,
    });

    this.streetLayer.addTo(this.map);

    this.map.on('move', () => {
      const center = this.map.getCenter();
      this.lat.set(center.lat);
      this.lng.set(center.lng);
    });

    this.applyMapTheme();
  }

  async setLayer(type: 'street' | 'sat') {
    if (!this.isBrowser) return;
    this.activeLayer = type;
    if (type === 'sat') {
      this.map.removeLayer(this.streetLayer);
      this.satLayer.addTo(this.map);
    } else {
      this.map.removeLayer(this.satLayer);
      this.streetLayer.addTo(this.map);
    }
    this.applyMapTheme();
  }

  async locateMe() {
    if (!this.isBrowser) return;
    const L = await import('leaflet');
    try {
      const pos = await this.geo.getUserLocation();
      this.map.flyTo([pos.coords.latitude, pos.coords.longitude], 13);
      L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(this.map)
        .bindPopup('You are here')
        .openPopup();
    } catch (e) {
      console.error('Location denied', e);
    }
  }

  private applyMapTheme() {
    if (!this.isBrowser) return;
    const container = this.mapContainer.nativeElement;
    if (this.activeLayer === 'street') {
      container.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)';
    } else {
      container.style.filter = 'none';
    }
  }
}
