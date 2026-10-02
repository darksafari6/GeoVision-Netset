import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div [class.dark]="theme.theme() === 'dark'" class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col md:flex-row">
      
      <!-- Sidebar Navigation (Desktop) -->
      <aside class="w-64 bg-white/5 backdrop-blur-xl border-r border-white/5 hidden md:flex flex-col p-6 h-screen sticky top-0 shrink-0">
        <div class="text-2xl font-bold tracking-tighter mb-10 flex items-center gap-3">
          <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span class="text-black text-xs font-black italic">G</span>
          </div>
          GEOVISION
        </div>

        <nav class="flex-1 space-y-2">
          <a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-emerald-500/10 text-emerald-500" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-lg">home</span>
            <span class="font-medium">Home</span>
          </a>
          <a routerLink="/dashboard" routerLinkActive="bg-emerald-500/10 text-emerald-500" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-lg">dashboard</span>
            <span class="font-medium">Dashboard</span>
          </a>
          <a routerLink="/explorer" routerLinkActive="bg-emerald-500/10 text-emerald-500" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-lg">explore</span>
            <span class="font-medium">Explorer</span>
          </a>
          <a routerLink="/live" routerLinkActive="bg-emerald-500/10 text-emerald-500" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-lg">gps_fixed</span>
            <span class="font-medium">Live Tracking</span>
          </a>
          <a routerLink="/ip-intel" routerLinkActive="bg-emerald-500/10 text-emerald-500" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-lg">router</span>
            <span class="font-medium">IP Intel</span>
          </a>
          <a routerLink="/image-detection" routerLinkActive="bg-emerald-500/10 text-emerald-500" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-lg">add_a_photo</span>
            <span class="font-medium">Image AI</span>
          </a>
          <a routerLink="/speed-test" routerLinkActive="bg-emerald-500/10 text-emerald-500" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-lg">speed</span>
            <span class="font-medium">Speed Test</span>
          </a>
        </nav>

        <div class="mt-auto pt-6 border-t border-white/5">
          <a routerLink="/settings" routerLinkActive="bg-emerald-500/10 text-emerald-500" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-lg">settings</span>
            <span class="font-medium">Settings</span>
          </a>
        </div>
      </aside>

      <!-- Mobile Nav -->
      <nav class="md:hidden bg-slate-900/80 backdrop-blur-lg border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-50">
        <div class="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div class="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
            <span class="text-black text-[10px] font-black italic">G</span>
          </div>
          GEOVISION
        </div>
        <button class="material-icons">menu</button>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class App {
  theme = inject(ThemeService);
}
