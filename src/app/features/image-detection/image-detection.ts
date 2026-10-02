import { ChangeDetectionStrategy, Component, signal, inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { GeoService } from '../../core/services/geo.service';

@Component({
  selector: 'app-image-detection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6 md:p-10">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold mb-2">Visual Intelligence</h1>
        <p class="text-slate-500 mb-10">AI-powered image location extraction and analysis.</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- Upload Section -->
          <div class="space-y-6">
            <div 
              (click)="fileInput.click()"
              class="aspect-video glass rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden group"
            >
              @if (previewUrl()) {
                <img [src]="previewUrl()" class="w-full h-full object-cover transition-transform group-hover:scale-105">
              } @else {
                <span class="material-icons text-5xl text-slate-700 mb-4">cloud_upload</span>
                <span class="text-slate-400 font-medium">Drop imagery or click to upload</span>
                <span class="text-xs text-slate-600 mt-2">JPG, PNG up to 10MB</span>
              }
              <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
            </div>

            @if (previewUrl()) {
              <button 
                (click)="analyze()" 
                [disabled]="loading()"
                class="w-full py-4 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                @if (loading()) {
                  <span class="animate-spin">◌</span> Processing Neural Layers...
                } @else {
                  Execute AI Geolocation
                }
              </button>
            }

            @if (result()) {
              <div class="glass p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <h2 class="text-xl font-bold uppercase tracking-tight">Detection Result</h2>
                  <span class="ml-auto bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded">CONFIDENCE: {{ result()?.confidence * 100 }}%</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white/5 p-4 rounded-xl">
                    <div class="text-[10px] text-slate-500 uppercase font-bold mb-1">City</div>
                    <div class="text-lg font-bold">{{ result()?.city }}</div>
                  </div>
                  <div class="bg-white/5 p-4 rounded-xl">
                    <div class="text-[10px] text-slate-500 uppercase font-bold mb-1">Country</div>
                    <div class="text-lg font-bold">{{ result()?.country }}</div>
                  </div>
                </div>

                <div class="mt-6">
                  <div class="text-[10px] text-slate-500 uppercase font-bold mb-3">AI Visual Clues</div>
                  <div class="flex flex-wrap gap-2">
                    @for (clue of result()?.clues; track clue) {
                      <span class="px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded-full border border-indigo-500/20">
                        {{ clue }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Map Preview -->
          <div class="glass rounded-[3rem] overflow-hidden min-h-[400px] relative">
             <div #mapContainer class="absolute inset-0 z-0"></div>
             @if (!result()) {
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div class="text-center">
                    <span class="material-icons text-slate-700 text-4xl mb-2">map</span>
                    <p class="text-slate-500 text-sm">Coordinates will be mapped after analysis</p>
                  </div>
                </div>
             }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageDetection {
  private geo = inject(GeoService);
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  
  previewUrl = signal<string | null>(null);
  imageBase64 = '';
  loading = signal(false);
  result = signal<any>(null);

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map!: any;
  private marker?: any;

  onFileSelected(event: any) {
    if (!this.isBrowser) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl.set(e.target.result);
        this.imageBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async analyze() {
    if (!this.imageBase64 || !this.isBrowser) return;
    
    this.loading.set(true);
    try {
      const data = await this.geo.analyzeImageLocation(this.imageBase64);
      this.result.set(data);
      this.updateMap(data.latitude, data.longitude);
    } catch (e) {
      console.error('Analysis failed', e);
    } finally {
      this.loading.set(false);
    }
  }

  private async updateMap(lat: number, lng: number) {
    if (!this.isBrowser) return;
    const L = await import('leaflet');
    
    if (!this.map) {
      this.map = L.map(this.mapContainer.nativeElement).setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    } else {
      this.map.setView([lat, lng], 13);
    }

    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker([lat, lng]).addTo(this.map);
  }
}
