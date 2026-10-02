import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { GeoService } from '../../core/services/geo.service';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative h-screen w-full bg-slate-900 overflow-hidden">
      <!-- Map Container -->
      <div #mapContainer class="absolute inset-0 z-0"></div>
      
      <!-- Placeholder for Server Render -->
      @if (!isBrowser) {
        <div class="absolute inset-0 bg-slate-900 flex items-center justify-center">
          <div class="text-slate-400 animate-pulse font-display tracking-widest uppercase">Initializing Orbital Mesh...</div>
        </div>
      }

      <!-- UI Layers Overlay -->
      <div class="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-8">
        
        <!-- Top Bar Controls -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
           <div class="glass p-3 md:p-4 rounded-2xl pointer-events-auto flex items-center gap-4 shadow-2xl border-white/5">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span class="material-icons text-black text-sm md:text-lg font-black">explore</span>
              </div>
              <div>
                <div class="text-xs font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Active Sector</div>
                <div class="text-sm md:text-base font-bold text-white truncate max-w-[120px] md:max-w-none">
                  {{ lat() | number:'1.2-2' }}, {{ lng() | number:'1.2-2' }}
                </div>
              </div>
           </div>

           <!-- Search Bar Mobile/Desktop -->
           <div class="w-full md:w-auto glass p-1.5 rounded-full flex items-center gap-2 pl-5 pr-1.5 shadow-2xl pointer-events-auto border-white/5">
              <input 
                type="text" 
                placeholder="Search coordinates..." 
                class="bg-transparent border-none outline-none text-xs md:text-sm w-full md:w-48 lg:w-64 text-white placeholder-slate-500 font-medium"
              >
              <button class="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                <span class="material-icons text-black text-sm md:text-lg">search</span>
              </button>
           </div>
        </div>

        <!-- Bottom Controls / Layer Switching -->
        <div class="flex flex-col md:flex-row justify-between items-end gap-4 w-full">
          <!-- Floating Coordinates Display -->
          <div class="glass p-4 rounded-2xl pointer-events-auto hidden md:block border-white/5 shadow-2xl">
            <div class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Telemetry Data</div>
            <div class="font-mono text-xs text-emerald-400 space-y-1">
              <div>LATITUDE:  {{ lat() | number:'1.6-6' }}</div>
              <div>LONGITUDE: {{ lng() | number:'1.6-6' }}</div>
            </div>
          </div>

          <!-- Bottom Actions / Mode Selection -->
          <div class="w-full md:w-auto flex flex-col gap-3 pointer-events-auto">
            <div class="glass p-2 rounded-2xl flex md:flex-row gap-1 border-white/5 shadow-2xl bg-slate-900/40 backdrop-blur-3xl">
              <button 
                (click)="setLayer('street')" 
                [class.bg-emerald-500]="activeLayer === 'street'" 
                [class.text-black]="activeLayer === 'street'"
                [class.text-slate-400]="activeLayer !== 'street'"
                class="flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all"
              >
                STREET
              </button>
              <button 
                (click)="setLayer('sat')" 
                [class.bg-emerald-500]="activeLayer === 'sat'" 
                [class.text-black]="activeLayer === 'sat'"
                [class.text-slate-400]="activeLayer !== 'sat'"
                class="flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all"
              >
                SATELLITE
              </button>
            </div>

            <button (click)="locateMe()" class="w-full md:w-48 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-2">
              <span class="material-icons text-sm">my_location</span>
              Sync Node
            </button>
          </div>
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
