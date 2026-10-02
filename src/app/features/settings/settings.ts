import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6 md:p-10">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold mb-2 font-display">System Configuration</h1>
        <p class="text-slate-500 mb-10">Global platform preferences and security controls</p>

        <div class="space-y-6">
          <!-- Appearance -->
          <section class="glass p-8 rounded-3xl">
            <h2 class="text-lg font-bold mb-6 flex items-center gap-2">
              <span class="material-icons text-indigo-400">palette</span>
              Appearance
            </h2>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold">Visual Interface</div>
                <div class="text-sm text-slate-500">Switch between light and dark spectrums</div>
              </div>
              <button 
                (click)="theme.toggleTheme()"
                class="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
              >
                Currently: {{ theme.theme() | uppercase }}
              </button>
            </div>
          </section>

          <!-- Privacy -->
          <section class="glass p-8 rounded-3xl">
            <h2 class="text-lg font-bold mb-6 flex items-center gap-2">
              <span class="material-icons text-emerald-400">shield</span>
              Privacy & Intelligence
            </h2>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold">Geolocation Access</div>
                  <div class="text-sm text-slate-500">Allow platform to access browser GPS</div>
                </div>
                <div class="w-12 h-6 bg-emerald-500 rounded-full p-1 cursor-pointer">
                  <div class="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold">AI Pattern Analysis</div>
                  <div class="text-sm text-slate-500">Anonymize image data before neural processing</div>
                </div>
                <div class="w-12 h-6 bg-emerald-500 rounded-full p-1 cursor-pointer">
                  <div class="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- Cache -->
          <section class="glass p-8 rounded-3xl">
            <h2 class="text-lg font-bold mb-6 flex items-center gap-2">
              <span class="material-icons text-amber-400">storage</span>
              Memory & Cache
            </h2>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold">Local Workspace</div>
                <div class="text-sm text-slate-500">Clear all cached geo-intelligence data</div>
              </div>
              <button class="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20">
                Purge Memory
              </button>
            </div>
          </section>
        </div>
        
        <div class="mt-12 text-center text-slate-600 text-[10px] uppercase tracking-[0.3em]">
          GeoVision Platform v1.0.4-Stable • Unified Intelligence Protocol
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  theme = inject(ThemeService);
}
