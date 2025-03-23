import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Lesson } from '../models/lesson';

@Injectable({
  providedIn: 'root',
})
export class JitsiService {
  constructor(private router: Router) {}

  startVideoCall(lesson: Lesson, user: { firstName?: string; lastName?: string; email: string }) {
    const displayName = user.firstName ? `${user.firstName} ${user.lastName}`.trim() : user.email;
    const queryParams = new URLSearchParams({
      roomName: lesson.meetingRoomName,
      domain: lesson.meetingDomain,
      meetingUrl: lesson.meetingUrl,
      jwt: lesson.meetingToken || '',
      displayName: displayName
    });

    const contentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const contentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    const url = `/video-call-window?${queryParams.toString()}`;
    window.open(url, '_blank', `width=${contentWidth},height=${contentHeight},toolbar=0,location=0,status=0,menubar=0,scrollbars=yes,resizable=yes`);
  }
}
