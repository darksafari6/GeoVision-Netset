import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div [class.dark]="theme.theme() === 'dark'" class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col md:flex-row overflow-hidden">
      
      <!-- Sidebar Navigation (Desktop) -->
      <aside class="w-72 bg-white/5 backdrop-blur-xl border-r border-white/5 hidden md:flex flex-col p-8 h-screen sticky top-0 shrink-0">
        <div class="text-2xl font-bold tracking-tighter mb-12 flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span class="text-black text-sm font-black italic">G</span>
          </div>
          <span class="tracking-widest">GEOVISION</span>
        </div>

        <nav class="flex-1 space-y-3">
          <a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-xl">home</span>
            <span class="font-semibold">Intelligence Home</span>
          </a>
          <a routerLink="/dashboard" routerLinkActive="bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-xl">dashboard</span>
            <span class="font-semibold">System Dashboard</span>
          </a>
          <a routerLink="/explorer" routerLinkActive="bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-xl">explore</span>
            <span class="font-semibold">Earth Explorer</span>
          </a>
          <a routerLink="/live" routerLinkActive="bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-xl">gps_fixed</span>
            <span class="font-semibold">Live Tracking</span>
          </a>
          <a routerLink="/ip-intel" routerLinkActive="bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-xl">router</span>
            <span class="font-semibold">IP Intelligence</span>
          </a>
          <a routerLink="/image-detection" routerLinkActive="bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-xl">add_a_photo</span>
            <span class="font-semibold">Visual AI</span>
          </a>
          <a routerLink="/speed-test" routerLinkActive="bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-xl">speed</span>
            <span class="font-semibold">Speed Analysis</span>
          </a>
        </nav>

        <div class="mt-auto pt-8 border-t border-white/5">
          <a routerLink="/settings" routerLinkActive="bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
            <span class="material-icons text-xl">settings</span>
            <span class="font-semibold">Node Settings</span>
          </a>
        </div>
      </aside>

      <!-- Mobile Top Bar -->
      <nav class="md:hidden bg-slate-900/90 backdrop-blur-2xl border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-[60] safe-top">
        <div class="text-lg font-bold tracking-tighter flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span class="text-black text-xs font-black italic">G</span>
          </div>
          GEOVISION
        </div>
        <button (click)="toggleMenu()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
          <span class="material-icons text-2xl">{{ isMenuOpen() ? 'close' : 'menu' }}</span>
        </button>
      </nav>

      <!-- Mobile Full-screen Drawer -->
      <div 
        class="fixed inset-0 z-50 md:hidden bg-slate-950/98 backdrop-blur-3xl transition-all duration-500 flex flex-col p-8 pt-24"
        [class.translate-x-full]="!isMenuOpen()"
        [class.translate-x-0]="isMenuOpen()"
      >
        <div class="grid grid-cols-1 gap-4 overflow-y-auto pb-20">
          <a (click)="closeMenu()" routerLink="/" routerLinkActive="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" class="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5">
            <span class="material-icons text-2xl text-emerald-500">home</span>
            <span class="text-lg font-semibold">Home</span>
          </a>
          <a (click)="closeMenu()" routerLink="/dashboard" routerLinkActive="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" class="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5">
            <span class="material-icons text-2xl text-emerald-500">dashboard</span>
            <span class="text-lg font-semibold">Dashboard</span>
          </a>
          <a (click)="closeMenu()" routerLink="/explorer" routerLinkActive="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" class="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5">
            <span class="material-icons text-2xl text-emerald-500">explore</span>
            <span class="text-lg font-semibold">Explorer</span>
          </a>
          <a (click)="closeMenu()" routerLink="/live" routerLinkActive="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" class="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5">
            <span class="material-icons text-2xl text-emerald-500">gps_fixed</span>
            <span class="text-lg font-semibold">Tracking</span>
          </a>
          <a (click)="closeMenu()" routerLink="/ip-intel" routerLinkActive="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" class="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5">
            <span class="material-icons text-2xl text-emerald-500">router</span>
            <span class="text-lg font-semibold">IP Intel</span>
          </a>
          <a (click)="closeMenu()" routerLink="/image-detection" routerLinkActive="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" class="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5">
            <span class="material-icons text-2xl text-emerald-500">add_a_photo</span>
            <span class="text-lg font-semibold">Visual AI</span>
          </a>
          <a (click)="closeMenu()" routerLink="/speed-test" routerLinkActive="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" class="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5">
            <span class="material-icons text-2xl text-emerald-500">speed</span>
            <span class="text-lg font-semibold">Speed Test</span>
          </a>
          <a (click)="closeMenu()" routerLink="/settings" routerLinkActive="bg-indigo-500/10 text-indigo-400 border-indigo-500/20" class="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5 mt-4">
            <span class="material-icons text-2xl text-indigo-400">settings</span>
            <span class="text-lg font-semibold">Settings</span>
          </a>
        </div>
      </div>

      <!-- Mobile Bottom Quick Navigation -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-around safe-bottom">
        <a routerLink="/" routerLinkActive="text-emerald-500" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center gap-1 opacity-60 router-link-active:opacity-100">
          <span class="material-icons text-xl">home</span>
          <span class="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </a>
        <a routerLink="/explorer" routerLinkActive="text-emerald-500" class="flex flex-col items-center gap-1 opacity-60 router-link-active:opacity-100">
          <span class="material-icons text-xl">explore</span>
          <span class="text-[10px] font-bold uppercase tracking-tighter">Explorer</span>
        </a>
        <a routerLink="/dashboard" routerLinkActive="text-emerald-500" class="flex flex-col items-center gap-1 opacity-60 router-link-active:opacity-100">
          <span class="material-icons text-xl">dashboard</span>
          <span class="text-[10px] font-bold uppercase tracking-tighter">System</span>
        </a>
        <a routerLink="/live" routerLinkActive="text-emerald-500" class="flex flex-col items-center gap-1 opacity-60 router-link-active:opacity-100">
          <span class="material-icons text-xl">gps_fixed</span>
          <span class="text-[10px] font-bold uppercase tracking-tighter">Live</span>
        </a>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 h-screen overflow-y-auto pb-20 md:pb-0 relative scroll-smooth">
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
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
