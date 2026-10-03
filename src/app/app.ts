import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({ selector: 'app-root', standalone: true, imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [class.dark]="theme.theme() === 'dark'" class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 md:flex">
    <aside class="hidden h-screen w-72 shrink-0 flex-col border-r border-white/5 bg-slate-950/80 p-6 backdrop-blur-2xl md:flex">
      <a routerLink="/" class="mb-8 flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 font-black text-black">G</span><span class="font-black tracking-[0.25em]">GEOVISION</span></a>
      <nav class="flex-1 space-y-2" aria-label="Primary navigation">
        @for (item of nav; track item.path) { <a [routerLink]="item.path" routerLinkActive="bg-emerald-400 text-black shadow-lg shadow-emerald-400/20" [routerLinkActiveOptions]="{exact: item.path === '/'}" class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/5"><span class="material-icons text-lg">{{ item.icon }}</span>{{ item.label }}</a> }
      </nav>
      <a routerLink="/settings" routerLinkActive="bg-indigo-500 text-white" class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5"><span class="material-icons">settings</span>Settings</a>
    </aside>

    <header class="sticky top-0 z-[70] flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/85 px-4 backdrop-blur-2xl md:hidden">
      <a routerLink="/" class="flex items-center gap-2"><span class="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400 font-black text-black">G</span><span class="font-black tracking-widest">GEOVISION</span></a>
      <button type="button" (click)="toggleMenu()" [attr.aria-expanded]="isMenuOpen()" aria-label="Open navigation" class="grid h-10 w-10 place-items-center rounded-full bg-white/5"><span class="material-icons">{{ isMenuOpen() ? 'close' : 'menu' }}</span></button>
    </header>

    @if (isMenuOpen()) { <div class="fixed inset-0 z-[65] overflow-y-auto bg-slate-950/98 px-5 pb-24 pt-24 backdrop-blur-3xl md:hidden"><nav class="grid gap-3" aria-label="Mobile navigation">@for (item of nav; track item.path) { <a (click)="closeMenu()" [routerLink]="item.path" class="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-5 font-bold"><span class="material-icons text-emerald-400">{{ item.icon }}</span>{{ item.label }}</a> }<a (click)="closeMenu()" routerLink="/settings" class="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-5 font-bold"><span class="material-icons text-indigo-400">settings</span>Settings</a></nav></div> }

    <main class="min-w-0 flex-1 overflow-y-auto pb-20 md:h-screen md:pb-0"><router-outlet /></main>
    <nav class="fixed bottom-0 left-0 right-0 z-[60] grid h-16 grid-cols-5 border-t border-white/5 bg-slate-950/85 backdrop-blur-2xl md:hidden" aria-label="Quick navigation">
      @for (item of quickNav; track item.path) { <a [routerLink]="item.path" routerLinkActive="text-emerald-400" [routerLinkActiveOptions]="{exact: item.path === '/'}" class="grid place-items-center text-[9px] font-black uppercase tracking-wider text-slate-500"><span class="material-icons text-xl">{{ item.icon }}</span>{{ item.short }}</a> }
    </nav>
  </div>`,
})
export class App {
  theme = inject(ThemeService); isMenuOpen = signal(false);
  nav = [
    { path: '/', label: 'Intelligence Home', icon: 'home' }, { path: '/dashboard', label: 'System Dashboard', icon: 'dashboard' },
    { path: '/explorer', label: 'Earth Explorer', icon: 'public' }, { path: '/search', label: 'Location Search', icon: 'search' },
    { path: '/live', label: 'Live Tracking', icon: 'gps_fixed' }, { path: '/ip-intel', label: 'IP Intelligence', icon: 'router' },
    { path: '/image-detection', label: 'Visual AI', icon: 'photo_camera' }, { path: '/speed-test', label: 'Speed Analysis', icon: 'speed' },
  ];
  quickNav = [{ path: '/', short: 'Home', icon: 'home' }, { path: '/explorer', short: 'Explore', icon: 'public' }, { path: '/search', short: 'Search', icon: 'search' }, { path: '/dashboard', short: 'System', icon: 'dashboard' }, { path: '/live', short: 'Live', icon: 'gps_fixed' }];
  toggleMenu() { this.isMenuOpen.update(v => !v); }
  closeMenu() { this.isMenuOpen.set(false); }
}
