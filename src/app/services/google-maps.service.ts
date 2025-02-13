import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private scriptLoaded = false;

  constructor(
    private configService: ConfigService
  ) { }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve();
        return;
      }

      this.configService.loadConfig().then(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.configService.get('googleMapsApiKey')}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.scriptLoaded = true;
          resolve();
        };
        script.onerror = () => reject('Google Maps API could not be loaded.');
        document.body.appendChild(script);  
      });
    });
  }
}
