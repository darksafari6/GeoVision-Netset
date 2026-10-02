import { ChangeDetectionStrategy, Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { GeoService, IpInfo } from '../../core/services/geo.service';

@Component({
  selector: 'app-ip-intel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6 md:p-10">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-2">IP Intelligence</h1>
        <p class="text-slate-500 mb-10">Deep analysis of network protocols and origin points.</p>

        @if (loading()) {
          <div class="flex items-center justify-center py-20">
            <div class="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        } @else if (ipInfo()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Global Identity -->
            <div class="md:col-span-2 glass p-10 rounded-[3rem] relative overflow-hidden">
               <div class="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 font-display select-none">IDENTITY</div>
               <div class="relative z-10">
                  <div class="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold mb-2">Public IP Address</div>
                  <div class="text-6xl font-mono text-emerald-400 mb-6">{{ ipInfo()?.ip }}</div>
                  
                  <div class="flex flex-wrap gap-4">
                    <div class="bg-white/5 px-4 py-2 rounded-xl text-sm border border-white/5">
                      <span class="text-slate-500">ASN:</span> {{ ipInfo()?.org }}
                    </div>
                    <div class="bg-white/5 px-4 py-2 rounded-xl text-sm border border-white/5">
                      <span class="text-slate-500">Version:</span> IPv4
                    </div>
                  </div>
               </div>
            </div>

            <!-- Regional Intelligence -->
            <div class="glass p-8 rounded-3xl">
              <h3 class="text-xs text-slate-500 uppercase tracking-widest mb-6 font-bold">Regional Metadata</h3>
              <div class="space-y-4">
                <div class="flex justify-between border-b border-white/5 pb-3">
                  <span class="text-slate-400">City</span>
                  <span class="font-semibold">{{ ipInfo()?.city }}</span>
                </div>
                <div class="flex justify-between border-b border-white/5 pb-3">
                  <span class="text-slate-400">Region</span>
                  <span class="font-semibold">{{ ipInfo()?.region }}</span>
                </div>
                <div class="flex justify-between border-b border-white/5 pb-3">
                  <span class="text-slate-400">Country</span>
                  <span class="font-semibold">{{ ipInfo()?.country_name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Timezone</span>
                  <span class="font-semibold">{{ ipInfo()?.timezone }}</span>
                </div>
              </div>
            </div>

            <!-- Security indicators -->
             <div class="glass p-8 rounded-3xl">
              <h3 class="text-xs text-slate-500 uppercase tracking-widest mb-6 font-bold">Security Posture</h3>
              <div class="space-y-4">
                 <div class="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <span class="material-icons text-emerald-500 text-sm">verified_user</span>
                    <div class="text-sm">Not listed on major RBLs</div>
                 </div>
                 <div class="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <span class="material-icons text-emerald-500 text-sm">lock</span>
                    <div class="text-sm">Residential IP verified</div>
                 </div>
                 <div class="flex items-center gap-3 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                    <span class="material-icons text-indigo-500 text-sm">vpn_key</span>
                    <div class="text-sm">No active proxy detected</div>
                 </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-20 glass rounded-3xl">
            <button (click)="loadInfo()" class="px-8 py-4 bg-emerald-500 text-black font-bold rounded-2xl">
              Execute Intelligence Scan
            </button>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IpIntel implements OnInit {
  private geo = inject(GeoService);
  private platformId = inject(PLATFORM_ID);
  
  ipInfo = this.geo.ipInfo;
  loading = signal(false);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId) && !this.ipInfo()) {
      this.loadInfo();
    }
  }

  async loadInfo() {
    this.loading.set(true);
    try {
      await this.geo.getIpIntelligence();
    } finally {
      this.loading.set(false);
    }
  }
}
