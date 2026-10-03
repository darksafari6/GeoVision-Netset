import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface IpInfo {
  ip: string; city: string; region: string; country_name: string;
  latitude: number; longitude: number; org: string; timezone: string;
  asn?: string; country_code?: string;
}

export interface PlaceResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance?: number;
  address?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class GeoService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  userLocation = signal<GeolocationPosition | null>(null);
  ipInfo = signal<IpInfo | null>(null);

  async getUserLocation(): Promise<GeolocationPosition> {
    if (!isPlatformBrowser(this.platformId)) return Promise.reject(new Error('Geolocation is browser-only.'));
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error('Geolocation is not supported by this browser.')); return; }
      navigator.geolocation.getCurrentPosition(
        pos => { this.userLocation.set(pos); resolve(pos); },
        err => reject(new Error(this.locationError(err.code))),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
      );
    });
  }

  watchUserLocation(onPosition: (position: GeolocationPosition) => void, onError: (error: Error) => void): number {
    if (!isPlatformBrowser(this.platformId) || !navigator.geolocation) throw new Error('Geolocation is not supported.');
    return navigator.geolocation.watchPosition(
      pos => { this.userLocation.set(pos); onPosition(pos); },
      err => onError(new Error(this.locationError(err.code))),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
    );
  }

  clearLocationWatch(id: number) { if (isPlatformBrowser(this.platformId)) navigator.geolocation.clearWatch(id); }

  async getIpIntelligence(): Promise<IpInfo> {
    const info = await firstValueFrom(this.http.get<IpInfo>('/api/ip-info'));
    this.ipInfo.set(info);
    return info;
  }

  async searchPlaces(query: string): Promise<PlaceResult[]> {
    return firstValueFrom(this.http.get<PlaceResult[]>('/api/geocode', { params: { q: query } }));
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<PlaceResult> {
    return firstValueFrom(this.http.get<PlaceResult>('/api/reverse-geocode', { params: { lat: latitude, lon: longitude } }));
  }

  async analyzeImageLocation(imageBase64: string, mimeType = 'image/jpeg'): Promise<unknown> {
    return firstValueFrom(this.http.post('/api/analyze-image', { imageBase64, mimeType }));
  }

  private locationError(code: number): string {
    if (code === 1) return 'Location permission was denied.';
    if (code === 2) return 'Your location could not be determined.';
    if (code === 3) return 'Location request timed out.';
    return 'Unable to read your location.';
  }
}
