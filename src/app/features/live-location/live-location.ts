import { ChangeDetectionStrategy, Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoService } from '../../core/services/geo.service';

@Component({
  selector: 'app-live-location',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6 md:p-10">
      <div class="max-w-5xl mx-auto">
        <header class="mb-10">
          <h1 class="text-4xl font-bold mb-2">Live Tracking</h1>
          <p class="text-slate-500">Real-time GPS telemetry from active node</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div class="glass p-8 rounded-3xl text-center">
            <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Latitude</div>
            <div class="text-3xl font-mono text-emerald-400">{{ lat() || '---' }}</div>
          </div>
          <div class="glass p-8 rounded-3xl text-center">
            <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Longitude</div>
            <div class="text-3xl font-mono text-emerald-400">{{ lng() || '---' }}</div>
          </div>
          <div class="glass p-8 rounded-3xl text-center">
            <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Accuracy</div>
            <div class="text-3xl font-mono text-indigo-400">{{ accuracy() ? accuracy() + 'm' : '---' }}</div>
          </div>
        </div>

        <div class="glass p-10 rounded-[3rem] relative overflow-hidden">
           <div class="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent"></div>
           <div class="relative z-10">
              <h2 class="text-xl font-bold mb-6 flex items-center gap-3">
                <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                Active Telemetry Feed
              </h2>

              <div class="space-y-4">
                @for (log of history(); track log.time) {
                  <div class="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 font-mono text-xs">
                    <span class="text-slate-600">[{{ log.time | date:'HH:mm:ss' }}]</span>
                    <span class="text-emerald-500/70">POS_SYNC</span>
                    <span class="text-slate-400">Lat: {{ log.lat | number:'1.6-6' }}</span>
                    <span class="text-slate-400">Lng: {{ log.lng | number:'1.6-6' }}</span>
                    <span class="ml-auto text-indigo-400">VERIFIED</span>
                  </div>
                }
                @if (history().length === 0) {
                  <div class="text-center py-10 text-slate-600">Waiting for GPS lock...</div>
                }
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveLocation implements OnInit, OnDestroy {
  private geo = inject(GeoService);
  
  lat = signal<number | null>(null);
  lng = signal<number | null>(null);
  accuracy = signal<number | null>(null);
  history = signal<any[]>([]);
  
  private watchId?: number;

  ngOnInit() {
    this.startTracking();
  }

  ngOnDestroy() {
    if (this.watchId) navigator.geolocation.clearWatch(this.watchId);
  }

  private startTracking() {
    if (!navigator.geolocation) return;
    
    this.watchId = navigator.geolocation.watchPosition((pos) => {
      this.lat.set(pos.coords.latitude);
      this.lng.set(pos.coords.longitude);
      this.accuracy.set(Math.round(pos.coords.accuracy));
      
      this.history.update(h => [{
        time: new Date(),
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }, ...h].slice(0, 10));
    });
  }
}
