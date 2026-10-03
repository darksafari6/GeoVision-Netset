import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home), title: 'GeoVision — Geospatial Intelligence' },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard), title: 'GeoVision — Dashboard' },
  { path: 'explorer', loadComponent: () => import('./features/explorer/explorer').then(m => m.Explorer), title: 'GeoVision — Earth Explorer' },
  { path: 'search', loadComponent: () => import('./features/location-search/location-search').then(m => m.LocationSearch), title: 'GeoVision — Location Search' },
  { path: 'live', loadComponent: () => import('./features/live-location/live-location').then(m => m.LiveLocation), title: 'GeoVision — Live Tracking' },
  { path: 'ip-intel', loadComponent: () => import('./features/ip-intel/ip-intel').then(m => m.IpIntel), title: 'GeoVision — IP Intelligence' },
  { path: 'speed-test', loadComponent: () => import('./features/speed-test/speed-test').then(m => m.SpeedTest), title: 'GeoVision — Network Speed' },
  { path: 'image-detection', loadComponent: () => import('./features/image-detection/image-detection').then(m => m.ImageDetection), title: 'GeoVision — Image Geolocation' },
  { path: 'settings', loadComponent: () => import('./features/settings/settings').then(m => m.Settings), title: 'GeoVision — Settings' },
  { path: '**', redirectTo: '' },
];
