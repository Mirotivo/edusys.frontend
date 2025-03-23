import { Component, OnDestroy,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-video-call-window',
  templateUrl: './video-call-window.component.html',
  styleUrls: ['./video-call-window.component.css']
})
export class VideoCallWindowComponent implements OnInit, OnDestroy {
  private jitsiApi: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const roomName = params['roomName'];
      const domain = params['domain'];
      const meetingUrl = params['meetingUrl'];
      const jwt = params['jwt'];
      const displayName = params['displayName'];

      this.loadJitsi(roomName, domain, meetingUrl, jwt, displayName);
    });
  }

  loadJitsi(roomName: string, domain: string, meetingUrl: string, jwt: string, displayName: string) {
    const container = document.getElementById('jitsi-container');
    if (!container) return;

    this.jitsiApi = new JitsiMeetExternalAPI(domain, {
      roomName: roomName,
      parentNode: container,
      jwt: jwt,
      userInfo: {
        displayName: displayName
      },
      configOverwrite: {
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false
      },
      interfaceConfigOverwrite: {
        filmStripOnly: false
      }
    });

    this.jitsiApi.addEventListener('videoConferenceLeft', () => {
      this.jitsiApi.dispose();
      window.close();
    });
  }

  ngOnDestroy() {
    if (this.jitsiApi) {
      this.jitsiApi.dispose();
    }
  }
}
