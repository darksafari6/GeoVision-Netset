import { ChangeDetectionStrategy, Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GeoService, IpInfo } from '../../core/services/geo.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 p-6 md:p-10">
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">System Dashboard</h1>
          <p class="text-slate-500">Real-time geospatial intelligence overview</p>
        </div>
        <div class="flex gap-4">
           <button (click)="refreshData()" class="px-4 py-2 glass hover:bg-white/10 rounded-lg text-sm transition-all flex items-center gap-2">
            Refresh
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Connection Card -->
        <div class="glass p-6 rounded-2xl">
          <div class="text-slate-500 text-xs uppercase tracking-widest mb-2 font-semibold">Network IP</div>
          <div class="text-2xl font-mono text-emerald-400">@if (ipInfo()) { {{ ipInfo()?.ip }} } @else { Scanning... }</div>
          <div class="mt-4 text-xs text-slate-400">
             {{ ipInfo()?.org || 'Determining Provider...' }}
          </div>
        </div>

        <!-- Location Card -->
        <div class="glass p-6 rounded-2xl">
          <div class="text-slate-500 text-xs uppercase tracking-widest mb-2 font-semibold">Current Region</div>
          <div class="text-2xl font-bold">@if (ipInfo()) { {{ ipInfo()?.city }}, {{ ipInfo()?.region }} } @else { Locating... }</div>
          <div class="mt-4 text-xs text-slate-400">
            {{ ipInfo()?.timezone || 'Timezone unknown' }}
          </div>
        </div>

        <!-- Accuracy Card -->
        <div class="glass p-6 rounded-2xl">
          <div class="text-slate-500 text-xs uppercase tracking-widest mb-2 font-semibold">GPS Confidence</div>
          <div class="text-2xl font-bold text-indigo-400">94.2%</div>
          <div class="mt-4 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div class="bg-indigo-500 h-full w-[94%]"></div>
          </div>
        </div>

        <!-- System Status -->
        <div class="glass p-6 rounded-2xl">
          <div class="text-slate-500 text-xs uppercase tracking-widest mb-2 font-semibold">System Status</div>
          <div class="flex items-center gap-2 text-2xl font-bold text-emerald-500">
            <span class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            Operational
          </div>
          <div class="mt-4 text-xs text-slate-400">All modules active</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Actions -->
        <div class="lg:col-span-1 glass p-8 rounded-3xl">
          <h2 class="text-xl font-bold mb-6">Quick Analysis</h2>
          <div class="space-y-4">
            <a routerLink="/explorer" class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
              <span class="font-medium">3D Earth Explorer</span>
              <span class="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a routerLink="/live" class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
              <span class="font-medium">Real-time Tracking</span>
              <span class="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a routerLink="/image-detection" class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
              <span class="font-medium">Image AI Geolocation</span>
              <span class="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a routerLink="/speed-test" class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
              <span class="font-medium">Network Intelligence</span>
              <span class="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        <!-- Activity Log -->
        <div class="lg:col-span-2 glass p-8 rounded-3xl overflow-hidden">
          <h2 class="text-xl font-bold mb-6">Security Intelligence</h2>
          <div class="space-y-6">
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center shrink-0">
                <span class="text-indigo-400">!</span>
              </div>
              <div>
                <div class="font-semibold">Unauthorized ASN Attempt</div>
                <div class="text-sm text-slate-500">Detected bypass attempt from AS4134 (Chinanet)</div>
                <div class="text-xs text-slate-600 mt-1">2 mins ago • Blocked</div>
              </div>
            </div>
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                <span class="text-emerald-400">✓</span>
              </div>
              <div>
                <div class="font-semibold">Secure Handshake Established</div>
                <div class="text-sm text-slate-500">Encrypted tunnel established with primary node</div>
                <div class="text-xs text-slate-600 mt-1">15 mins ago • Success</div>
              </div>
            </div>
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                <span class="text-emerald-400">✓</span>
              </div>
              <div>
                <div class="font-semibold">IP Validation Complete</div>
                <div class="text-sm text-slate-500">Public IP metadata verified and indexed</div>
                <div class="text-xs text-slate-600 mt-1">1 hour ago • Verified</div>
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
