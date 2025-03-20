import { Component } from '@angular/core';
import { SlLiveplayerComponent } from './sl-liveplayer/sl-liveplayer.component';
import { SlLiveplayerControlComponent } from './sl-liveplayer/sl-liveplayer-control/sl-liveplayer-control.component';
import * as moment from 'moment';
import { VideojsPlayerComponent } from './videojs-player/videojs-player.component';
import { SlVideoplayerComponent } from './sl-videoplayer/sl-videoplayer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'video-demo',
  imports: [SlVideoplayerComponent, CommonModule],
  templateUrl: './video-demo.component.html',
  styleUrl: './video-demo.component.less',
})
export class VideoDemoComponent {
  pause: boolean = false;
  ngOnInit() {
    const {starttime, endtime} = this.data[0]
    this.startDuration = 0; // 当前进度
    this.inDuration = 600; // 总时长
  }
  w = 1600
  h = 900
  ngAfterViewInit() {
    // setInterval(() => {
    //   this.w = Math.random() * 1000;
    //   this.h = Math.random() * 1000;
    // }, 1000);
  }
  isLive: boolean = false;
  idx: number = 0;
  url: string = 'http://183.63.55.74:10000/sms/34020000002020000001/record/34020000001320241201_34020000001320000001/20250318/20250318073000/34020000001320241201_34020000001320000001_record.m3u8'
  // url: string = 'http://183.63.55.74:10000/sms/34020000002020000001/flv/hls/34020000001320241201_34020000001320000001.flv'
  startDuration = 30
  inDuration = 500
  duration: number = 0;
  data: any = [
    {
      "hls": "http://183.63.55.74:10000/sms/34020000002020000001/record/34020000001320241201_34020000001320000001/20250318/20250318073000/34020000001320241201_34020000001320000001_record.m3u8",
      "starttime": 20250318073000,
      "endtime": 20250318080001
    },
    {
      "hls": "http://183.63.55.74:10000/sms/34020000002020000001/record/34020000001320241201_34020000001320000001/20250318/20250318080000/34020000001320241201_34020000001320000001_record.m3u8",
      "starttime": 20250318080000,
      "endtime": 20250318083001
    },
    {
      "hls": "http://183.63.55.74:10000/sms/34020000002020000001/record/34020000001320241201_34020000001320000001/20250318/20250318083000/34020000001320241201_34020000001320000001_record.m3u8",
      "starttime": 20250318083000,
      "endtime": 20250318085603
    },
    {
      "hls": "http://183.63.55.74:10000/sms/34020000002020000001/flv/hls/34020000001320241201_34020000001320000001.flv"
    },
    {
      "hls": "ws://183.63.55.74:10000/sms/34020000002020000001/ws-flv/hls/34020000001110000031_34020000001320002009.flv"
    }
  ]
  toNext() {
    this.idx = (this.idx + 1) % (this.data.length);
    this.url = this.data[this.idx].hls;
    this.duration = (moment(this.data[this.idx].endtime, 'YYYYMMDDHHmmss').valueOf() -moment(this.data[this.idx].starttime, 'YYYYMMDDHHmmss').valueOf()) / 1000
    this.isLive = this.url.endsWith('flv')
  }
  show = true
  destroy() {
    this.show = !this.show
  }
}
