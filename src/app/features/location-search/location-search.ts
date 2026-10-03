import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeoService, PlaceResult } from '../../core/services/geo.service';

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  template: `
    <section class="min-h-screen bg-slate-950 text-white px-4 py-8 md:px-10 md:py-12">
      <div class="mx-auto max-w-6xl space-y-8">
        <header>
          <p class="text-[10px] font-black uppercase tracking-[0.45em] text-emerald-400">Geospatial Search</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight md:text-6xl">Find any place.</h1>
          <p class="mt-3 max-w-2xl text-slate-400">Search real-world places through the GeoVision API layer, inspect coordinates, and reverse-geocode a coordinate pair.</p>
        </header>

        <div class="glass rounded-3xl border border-white/10 p-4 md:p-6">
          <form class="flex flex-col gap-3 md:flex-row" (ngSubmit)="search()">
            <label class="sr-only" for="place-query">Place name</label>
            <input id="place-query" name="query" [(ngModel)]="query" autocomplete="off" placeholder="Lahore, Eiffel Tower, Tokyo..." class="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-emerald-400/60" />
            <button type="submit" [disabled]="loading() || query.trim().length < 2" class="rounded-2xl bg-emerald-400 px-7 py-4 font-black text-black disabled:cursor-not-allowed disabled:opacity-40">{{ loading() ? 'Searching…' : 'Search' }}</button>
          </form>
        </div>

        @if (error()) { <div role="alert" class="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{{ error() }}</div> }

        @if (results().length) {
          <div class="grid gap-4 md:grid-cols-2">
            @for (place of results(); track place.place_id) {
              <button type="button" (click)="select(place)" class="glass text-left rounded-3xl border border-white/10 p-5 transition hover:-translate-y-1 hover:border-emerald-400/30">
                <div class="flex items-start justify-between gap-4">
                  <div><h2 class="font-bold">{{ place.display_name }}</h2><p class="mt-2 font-mono text-xs text-emerald-300">{{ place.lat }}, {{ place.lon }}</p></div>
                  <span class="rounded-full bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400">{{ place.type }}</span>
                </div>
              </button>
            }
          </div>
        }

        @if (selected(); as place) {
          <article class="glass rounded-3xl border border-emerald-400/20 p-6 md:p-8">
            <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div><p class="text-[10px] font-black uppercase tracking-widest text-emerald-400">Selected location</p><h2 class="mt-2 text-2xl font-black">{{ place.display_name }}</h2></div>
              <div class="grid grid-cols-2 gap-3 text-center">
                <div class="rounded-2xl bg-white/5 p-4"><div class="text-[9px] uppercase tracking-widest text-slate-500">Latitude</div><div class="mt-1 font-mono">{{ +place.lat | number:'1.5-6' }}</div></div>
                <div class="rounded-2xl bg-white/5 p-4"><div class="text-[9px] uppercase tracking-widest text-slate-500">Longitude</div><div class="mt-1 font-mono">{{ +place.lon | number:'1.5-6' }}</div></div>
              </div>
            </div>
            <a class="mt-6 inline-flex rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5" [href]="'https://www.openstreetmap.org/?mlat=' + place.lat + '&mlon=' + place.lon + '#map=16/' + place.lat + '/' + place.lon" target="_blank" rel="noopener noreferrer">Open map ↗</a>
          </article>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationSearch {
  private geo = inject(GeoService);
  query = '';
  loading = signal(false);
  error = signal('');
  results = signal<PlaceResult[]>([]);
  selected = signal<PlaceResult | null>(null);

  async search() {
    if (this.query.trim().length < 2) return;
    this.loading.set(true); this.error.set(''); this.selected.set(null);
    try { this.results.set(await this.geo.searchPlaces(this.query.trim())); }
    catch (e) { this.error.set(e instanceof Error ? e.message : 'Location search failed.'); this.results.set([]); }
    finally { this.loading.set(false); }
  }

  select(place: PlaceResult) { this.selected.set(place); }
}
