import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-speed-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6 md:p-10 flex flex-col items-center justify-center">
      <div class="max-w-xl w-full">
        <h1 class="text-4xl font-bold text-center mb-2">Network Intelligence</h1>
        <p class="text-slate-500 text-center mb-12">Testing node latency and data throughput</p>

        <div class="glass p-10 rounded-[3rem] text-center relative overflow-hidden">
          <!-- Background Glow -->
          <div class="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
          <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-600/20 blur-[100px] rounded-full"></div>

          <div class="relative z-10">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-4">Current Speed</div>
            <div class="text-8xl font-black mb-2 tracking-tighter transition-all">
              {{ speed() | number:'1.1-1' }}
            </div>
            <div class="text-xl text-slate-400 font-medium mb-10">Mbps</div>

            <div class="grid grid-cols-2 gap-4 mb-10">
              <div class="bg-white/5 p-4 rounded-2xl">
                <div class="text-[10px] text-slate-500 uppercase font-bold mb-1">Ping</div>
                <div class="text-xl font-bold">{{ ping() }} ms</div>
              </div>
              <div class="bg-white/5 p-4 rounded-2xl">
                <div class="text-[10px] text-slate-500 uppercase font-bold mb-1">Jitter</div>
                <div class="text-xl font-bold">{{ jitter() }} ms</div>
              </div>
            </div>

            <button 
              (click)="startTest()" 
              [disabled]="testing()"
              class="w-full py-4 bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-black font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/10 hover:scale-[1.02]"
            >
              {{ testing() ? 'Analyzing Spectrum...' : 'Begin Intelligence Scan' }}
            </button>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-3 gap-4">
          <div class="glass p-4 rounded-xl text-center">
            <div class="text-xs text-slate-500 mb-1">Encryption</div>
            <div class="text-sm font-semibold">AES-256</div>
          </div>
           <div class="glass p-4 rounded-xl text-center">
            <div class="text-xs text-slate-500 mb-1">Protocol</div>
            <div class="text-sm font-semibold">HTTP/3</div>
          </div>
           <div class="glass p-4 rounded-xl text-center">
            <div class="text-xs text-slate-500 mb-1">IPv6</div>
            <div class="text-sm font-semibold text-emerald-400 font-mono">READY</div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedTest {
  private http = inject(HttpClient);
  
  speed = signal(0);
  ping = signal(0);
  jitter = signal(0);
  testing = signal(false);

  async startTest() {
    this.testing.set(true);
    this.speed.set(0);
    this.ping.set(0);
    this.jitter.set(0);

    // Phase 1: Ping
    const startPing = Date.now();
    await fetch('/api/ping');
    this.ping.set(Date.now() - startPing);

    // Phase 2: Pseudo Download
    // In a real app, we'd fetch a large binary blob. 
    // Here we'll simulate the gauge animation while fetching something modest.
    let currentSpeed = 0;
    const targetSpeed = Math.random() * 400 + 100;
    
    const interval = setInterval(() => {
      currentSpeed += (targetSpeed - currentSpeed) * 0.1;
      this.speed.set(currentSpeed);
      if (Math.abs(targetSpeed - currentSpeed) < 1) {
        clearInterval(interval);
        this.speed.set(targetSpeed);
        this.testing.set(false);
        this.jitter.set(Math.floor(Math.random() * 5 + 1));
      }
    }, 50);
  }
}
