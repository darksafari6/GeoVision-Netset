import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

interface TestResult { timestamp: string; download: number; upload: number; ping: number; jitter: number; }

@Component({
  selector: 'app-speed-test', standalone: true, imports: [CommonModule, DecimalPipe, DatePipe], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-10 md:py-12"><div class="mx-auto max-w-5xl">
      <header class="mb-8"><p class="text-[10px] font-black uppercase tracking-[0.45em] text-emerald-400">Network intelligence</p><h1 class="mt-3 text-4xl font-black md:text-6xl">Real throughput test.</h1><p class="mt-3 text-slate-400">Measures your connection using real bytes transferred between your browser and the GeoVision test server. No random or simulated results.</p></header>
      <section class="glass rounded-[2rem] border border-white/10 p-6 md:p-10"><div class="grid gap-5 sm:grid-cols-3">
        <div class="rounded-3xl bg-white/5 p-6"><p class="text-[10px] uppercase tracking-widest text-slate-500">Download</p><strong class="mt-2 block text-4xl font-black">{{ download() | number:'1.1-1' }} <small class="text-sm text-slate-500">Mbps</small></strong></div>
        <div class="rounded-3xl bg-white/5 p-6"><p class="text-[10px] uppercase tracking-widest text-slate-500">Upload</p><strong class="mt-2 block text-4xl font-black">{{ upload() | number:'1.1-1' }} <small class="text-sm text-slate-500">Mbps</small></strong></div>
        <div class="rounded-3xl bg-white/5 p-6"><p class="text-[10px] uppercase tracking-widest text-slate-500">Ping / Jitter</p><strong class="mt-2 block text-4xl font-black">{{ ping() }} <small class="text-sm text-slate-500">/ {{ jitter() }} ms</small></strong></div>
      </div>
      @if (error()) { <p role="alert" class="mt-5 rounded-2xl bg-red-400/10 p-4 text-sm text-red-200">{{ error() }}</p> }
      <button type="button" (click)="startTest()" [disabled]="testing()" class="mt-8 w-full rounded-2xl bg-emerald-400 py-4 font-black text-black transition hover:scale-[1.01] disabled:opacity-40">{{ testing() ? phase() : 'Start real test' }}</button></section>
      <section class="mt-6"><h2 class="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">Local test history</h2><div class="space-y-3">@for (item of history(); track item.timestamp) {<div class="glass grid grid-cols-2 gap-3 rounded-2xl border border-white/5 p-4 text-sm sm:grid-cols-4"><span>{{ item.download | number:'1.1-1' }} ↓</span><span>{{ item.upload | number:'1.1-1' }} ↑</span><span>{{ item.ping }} ms</span><span class="text-right text-slate-500">{{ item.timestamp | date:'medium' }}</span></div>}</div></section>
    </div></main>`
})
export class SpeedTest {
  download = signal(0); upload = signal(0); ping = signal(0); jitter = signal(0); testing = signal(false); phase = signal('Preparing…'); error = signal(''); history = signal<TestResult[]>(this.readHistory());

  async startTest() {
    if (this.testing()) return;
    this.testing.set(true); this.error.set(''); this.download.set(0); this.upload.set(0); this.ping.set(0); this.jitter.set(0);
    try {
      const samples: number[] = [];
      for (let i = 0; i < 7; i++) {
        this.phase.set(`Measuring latency ${i + 1}/7`);
        const start = performance.now();
        const response = await fetch(`/api/ping?cache=${crypto.randomUUID()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
        if (!response.ok) throw new Error('Ping endpoint unavailable.');
        await response.arrayBuffer();
        samples.push(performance.now() - start);
      }
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
      this.ping.set(Math.round(avg));
      const deltas = samples.slice(1).map((value, index) => Math.abs(value - samples[index]));
      this.jitter.set(Math.round((deltas.reduce((a, b) => a + b, 0) / deltas.length) * 10) / 10);

      this.phase.set('Measuring real download…');
      this.download.set(await this.measureDownload());
      this.phase.set('Measuring real upload…');
      this.upload.set(await this.measureUpload());
      this.save({ timestamp: new Date().toISOString(), download: this.download(), upload: this.upload(), ping: this.ping(), jitter: this.jitter() });
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Speed test failed.');
    } finally {
      this.testing.set(false);
      this.phase.set('Ready');
    }
  }

  private async measureDownload(): Promise<number> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const started = performance.now();
    let bytes = 0;
    try {
      const response = await fetch(`/api/speed-test/download?bytes=25000000&t=${crypto.randomUUID()}`, { cache: 'no-store', signal: controller.signal, headers: { 'Cache-Control': 'no-cache' } });
      if (!response.ok || !response.body) throw new Error('Download stream unavailable.');
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
      }
      const seconds = Math.max((performance.now() - started) / 1000, 0.001);
      return bytes * 8 / seconds / 1_000_000;
    } finally { clearTimeout(timer); }
  }

  private async measureUpload(): Promise<number> {
    const bytesToSend = 10000000;
    const payload = new Uint8Array(bytesToSend);
    const started = performance.now();
    const response = await fetch(`/api/speed-test/upload?expectedBytes=${bytesToSend}&t=${crypto.randomUUID()}`, {
      method: 'POST', body: payload, cache: 'no-store', headers: { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'no-cache' }
    });
    if (!response.ok) throw new Error('Upload endpoint unavailable.');
    const result = await response.json() as { bytes?: number };
    const bytes = Number(result.bytes) || bytesToSend;
    return bytes * 8 / Math.max((performance.now() - started) / 1000, 0.001) / 1_000_000;
  }

  private save(result: TestResult) { const next = [result, ...this.history()].slice(0, 10); this.history.set(next); if (typeof localStorage !== 'undefined') localStorage.setItem('geovision-speed-history', JSON.stringify(next)); }
  private readHistory(): TestResult[] { try { return typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem('geovision-speed-history') ?? '[]'); } catch { return []; } }
}
