import { ChangeDetectionStrategy, Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GeoService, IpInfo } from '../../core/services/geo.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 p-4 md:p-10 pb-24 md:pb-10">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-1">System Intelligence</h1>
          <p class="text-slate-500 text-sm md:text-base">Real-time geospatial intelligence overview</p>
        </div>
        <button (click)="refreshData()" class="w-full md:w-auto px-6 py-3 glass hover:bg-white/10 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border-white/5 shadow-2xl">
          <span class="material-icons text-emerald-500 text-lg">refresh</span>
          Refresh Intelligence
        </button>
      </header>

      <!-- Main KPI Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        <!-- Connection Card -->
        <div class="glass p-6 md:p-8 rounded-[2rem] border-white/5 relative overflow-hidden group">
          <div class="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all rounded-full"></div>
          <div class="text-slate-500 text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3 font-bold">Network Origin</div>
          <div class="text-xl md:text-2xl font-mono text-emerald-400 truncate">@if (ipInfo()) { {{ ipInfo()?.ip }} } @else { Scanning... }</div>
          <div class="mt-4 flex items-center gap-2">
            <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <div class="text-xs text-slate-400 font-medium truncate">
               {{ ipInfo()?.org || 'Determining Provider...' }}
            </div>
          </div>
        </div>

        <!-- Location Card -->
        <div class="glass p-6 md:p-8 rounded-[2rem] border-white/5 relative overflow-hidden group">
          <div class="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-all rounded-full"></div>
          <div class="text-slate-500 text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3 font-bold">Active Region</div>
          <div class="text-xl md:text-2xl font-bold truncate">@if (ipInfo()) { {{ ipInfo()?.city }}, {{ ipInfo()?.region }} } @else { Locating... }</div>
          <div class="mt-4 flex items-center gap-2">
            <span class="material-icons text-indigo-400 text-xs">schedule</span>
            <div class="text-xs text-slate-400 font-medium truncate">
              {{ ipInfo()?.timezone || 'Timezone unknown' }}
            </div>
          </div>
        </div>

        <!-- Accuracy Card -->
        <div class="glass p-6 md:p-8 rounded-[2rem] border-white/5 group">
          <div class="text-slate-500 text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3 font-bold">GPS Confidence</div>
          <div class="flex items-end gap-2 mb-3">
             <div class="text-3xl md:text-4xl font-black text-indigo-400">94.2</div>
             <div class="text-sm font-bold text-slate-500 mb-1.5">%</div>
          </div>
          <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div class="bg-indigo-500 h-full w-[94.2%] transition-all duration-1000"></div>
          </div>
        </div>

        <!-- System Status -->
        <div class="glass p-6 md:p-8 rounded-[2rem] border-white/5 group">
          <div class="text-slate-500 text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3 font-bold">Node Status</div>
          <div class="flex items-center gap-3 text-xl md:text-2xl font-bold text-emerald-500">
            <div class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            Active
          </div>
          <div class="mt-4 text-xs text-slate-400 font-medium">All telemetry active</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Intelligence Tools -->
        <div class="lg:col-span-1 glass p-8 md:p-10 rounded-[3rem] border-white/5">
          <h2 class="text-xl md:text-2xl font-bold mb-8">Intelligence Suite</h2>
          <div class="space-y-4">
            <a routerLink="/explorer" class="flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-transparent hover:border-emerald-500/20 shadow-xl">
              <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-icons text-emerald-500">explore</span>
              </div>
              <div class="flex-1">
                <div class="font-bold">Earth Explorer</div>
                <div class="text-[10px] text-slate-500 uppercase tracking-wider">3D Global View</div>
              </div>
              <span class="material-icons text-slate-700 group-hover:text-emerald-500 transition-colors">arrow_forward</span>
            </a>

            <a routerLink="/image-detection" class="flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-transparent hover:border-indigo-500/20 shadow-xl">
              <div class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-icons text-indigo-400">add_a_photo</span>
              </div>
              <div class="flex-1">
                <div class="font-bold">Visual Analysis</div>
                <div class="text-[10px] text-slate-500 uppercase tracking-wider">AI Geolocation</div>
              </div>
              <span class="material-icons text-slate-700 group-hover:text-indigo-400 transition-colors">arrow_forward</span>
            </a>

            <a routerLink="/live" class="flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-transparent hover:border-emerald-500/20 shadow-xl">
              <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-icons text-emerald-500">gps_fixed</span>
              </div>
              <div class="flex-1">
                <div class="font-bold">Live Tracking</div>
                <div class="text-[10px] text-slate-500 uppercase tracking-wider">Real-time GPS</div>
              </div>
              <span class="material-icons text-slate-700 group-hover:text-emerald-500 transition-colors">arrow_forward</span>
            </a>
          </div>
        </div>

        <!-- Intelligence Feed -->
        <div class="lg:col-span-2 glass p-8 md:p-10 rounded-[3rem] border-white/5">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl md:text-2xl font-bold">Node Intelligence Feed</h2>
            <span class="text-[10px] font-bold text-slate-600 tracking-widest uppercase bg-white/5 px-3 py-1.5 rounded-full">Secure Feed</span>
          </div>
          
          <div class="space-y-6">
            <div class="flex gap-5 items-start p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
              <div class="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <span class="material-icons text-amber-500">security</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold">Anomalous ASN Detected</span>
                  <span class="text-[10px] text-slate-600 font-mono">11:42:04</span>
                </div>
                <div class="text-sm text-slate-500 leading-relaxed italic">Intelligence engine flagged AS4134 for suspicious routing patterns in the Asian Pacific sector. Node auto-mitigation enabled.</div>
                <div class="flex gap-2 mt-3">
                  <span class="text-[10px] font-bold text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">THREAT_LEVEL_2</span>
                  <span class="text-[10px] font-bold text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">MITIGATED</span>
                </div>
              </div>
            </div>

            <div class="flex gap-5 items-start p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
              <div class="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <span class="material-icons text-indigo-400">sync</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold">Coordinate Sync Complete</span>
                  <span class="text-[10px] text-slate-600 font-mono">10:15:32</span>
                </div>
                <div class="text-sm text-slate-500 leading-relaxed italic">Master orbital node synchronized with local telemetry. Propagation delay 42ms. Latency verified for high-accuracy tracking.</div>
              </div>
            </div>

             <div class="flex gap-5 items-start p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
              <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <span class="material-icons text-emerald-500">public</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold">Global Mesh Status: Optimal</span>
                  <span class="text-[10px] text-slate-600 font-mono">09:00:00</span>
                </div>
                <div class="text-sm text-slate-500 leading-relaxed italic">All 2,400 secondary mesh nodes reporting green status. Geospatial resolution set to 0.5m.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private geo = inject(GeoService);
  private platformId = inject(PLATFORM_ID);
  ipInfo = this.geo.ipInfo;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.refreshData();
    }
  }

  async refreshData() {
    try {
      await this.geo.getIpIntelligence();
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    }
  }
}
