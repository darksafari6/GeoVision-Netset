import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  latitude: number;
  longitude: number;
  org: string;
  timezone: string;
}

@Injectable({ providedIn: 'root' })
export class GeoService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  
  userLocation = signal<GeolocationPosition | null>(null);
  ipInfo = signal<IpInfo | null>(null);

  async getUserLocation(): Promise<GeolocationPosition> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject('Not in browser');
    }
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.userLocation.set(pos);
          resolve(pos);
        },
        (err) => reject(err),
        { enableHighAccuracy: true }
      );
    });
  }

  async getIpIntelligence(): Promise<IpInfo> {
    try {
      const info = await firstValueFrom(this.http.get<IpInfo>('/api/ip-info'));
      this.ipInfo.set(info);
      return info;
    } catch (e) {
      console.error('IP Intel failed', e);
      throw e;
    }
  }

  async analyzeImageLocation(imageBase64: string): Promise<any> {
    return firstValueFrom(this.http.post('/api/analyze-image', { imageBase64 }));
  }
}
