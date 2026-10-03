import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

interface TestResult { timestamp: string; download: number; upload: number; ping: number; jitter: number; }

@Component({
  selector: 'app-speed-test',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <main class="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-10 md:py-12">
      <div class="mx-auto max-w-5xl">
        <header class="mb-8"><p class="text-[10px] font-black uppercase tracking-[0.45em] text-emerald-400">Network intelligence</p><h1 class="mt-3 text-4xl font-black md:text-6xl">Real throughput test.</h1><p class="mt-3 text-slate-400">Measures latency, jitter, download and upload against the GeoVision server.</p></header>
        <section class="glass rounded-[2rem] border border-white/10 p-6 md:p-10">
          <div class="grid gap-5 sm:grid-cols-3">
            <div class="rounded-3xl bg-white/5 p-6"><p class="text-[10px] uppercase tracking-widest text-slate-500">Download</p><strong class="mt-2 block text-4xl font-black">{{ download() | number:'1.1-1' }} <small class="text-sm text-slate-500">Mbps</small></strong></div>
            <div class="rounded-3xl bg-white/5 p-6"><p class="text-[10px] uppercase tracking-widest text-slate-500">Upload</p><strong class="mt-2 block text-4xl font-black">{{ upload() | number:'1.1-1' }} <small class="text-sm text-slate-500">Mbps</small></strong></div>
            <div class="rounded-3xl bg-white/5 p-6"><p class="text-[10px] uppercase tracking-widest text-slate-500">Ping / Jitter</p><strong class="mt-2 block text-4xl font-black">{{ ping() }} <small class="text-sm text-slate-500">/ {{ jitter() }} ms</small></strong></div>
          </div>
          @if (error()) { <p role="alert" class="mt-5 rounded-2xl bg-red-400/10 p-4 text-sm text-red-200">{{ error() }}</p> }
          <button type="button" (click)="startTest()" [disabled]="testing()" class="mt-8 w-full rounded-2xl bg-emerald-400 py-4 font-black text-black transition hover:scale-[1.01] disabled:opacity-40">{{ testing() ? phase() : 'Start measured test' }}</button>
        </section>
        <section class="mt-6"><h2 class="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">Local test history</h2><div class="space-y-3">@for (item of history(); track item.timestamp) {<div class="glass grid grid-cols-2 gap-3 rounded-2xl border border-white/5 p-4 text-sm sm:grid-cols-4"><span>{{ item.download | number:'1.1-1' }} ↓</span><span>{{ item.upload | number:'1.1-1' }} ↑</span><span>{{ item.ping }} ms</span><span class="text-right text-slate-500">{{ item.timestamp | date:'medium' }}</span></div>}</div></section>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedTest {
  download = signal(0); upload = signal(0); ping = signal(0); jitter = signal(0); testing = signal(false); phase = signal('Preparing…'); error = signal(''); history = signal<TestResult[]>(this.readHistory());

  async startTest() {
    if (this.testing()) return;
    this.testing.set(true); this.error.set(''); this.download.set(0); this.upload.set(0); this.ping.set(0); this.jitter.set(0);
    try {
      const samples: number[] = [];
      for (let i = 0; i < 5; i++) { this.phase.set(`Latency sample ${i + 1}/5`); const start = performance.now(); const response = await fetch(`/api/ping?cache=${Date.now()}-${i}`, { cache: 'no-store' }); if (!response.ok) throw new Error('Ping endpoint unavailable.'); samples.push(performance.now() - start); }
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length; this.ping.set(Math.round(avg)); this.jitter.set(Math.round(Math.sqrt(samples.reduce((sum, x) => sum + (x - avg) ** 2, 0) / samples.length) * 10) / 10);
      this.phase.set('Measuring download…'); const size = 5_000_000; const startDown = performance.now(); const response = await fetch(`/api/speed-test/download?bytes=${size}&t=${Date.now()}`, { cache: 'no-store' }); if (!response.ok) throw new Error('Download test unavailable.'); const data = await response.arrayBuffer(); this.download.set((data.byteLength * 8 / ((performance.now() - startDown) / 1000)) / 1_000_000);
      this.phase.set('Measuring upload…'); const payload = new Uint8Array(2_000_000); crypto.getRandomValues(payload); const startUp = performance.now(); const uploadResponse = await fetch('/api/speed-test/upload', { method: 'POST', headers: { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'no-store' }, body: payload }); if (!uploadResponse.ok) throw new Error('Upload test unavailable.'); const uploadResult = await uploadResponse.json(); this.upload.set((uploadResult.bytes * 8 / ((performance.now() - startUp) / 1000)) / 1_000_000);
      this.save({ timestamp: new Date().toISOString(), download: this.download(), upload: this.upload(), ping: this.ping(), jitter: this.jitter() });
    } catch (e) { this.error.set(e instanceof Error ? e.message : 'Speed test failed.'); } finally { this.testing.set(false); this.phase.set('Testing…'); }
  }

  private save(result: TestResult) { const next = [result, ...this.history()].slice(0, 10); this.history.set(next); localStorage.setItem('geovision-speed-history', JSON.stringify(next)); }
  private readHistory(): TestResult[] { try { return JSON.parse(localStorage.getItem('geovision-speed-history') ?? '[]'); } catch { return []; } }
}
