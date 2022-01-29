import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-playlistvideo',
  templateUrl: './playlistvideo.component.html',
  styleUrls: ['./playlistvideo.component.scss']
})
export class PlaylistvideoComponent implements OnInit {
  playlistid: string = "";
  videoname: string = "";
  rawvideoname: string = "";
  nextFile = "";
  previousFile = "";
  videoSubscription: any;
  playlistsArray: string[] = [];
  storedLocation: string = "";
  videoCurrentTime: Number;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    window.onbeforeunload = function(e) {
      let vidElement = document.getElementById("singleVideo");
      let dateTime = new Date();
      dateTime.setTime(dateTime.getTime() + (7 * 24 * 60 * 60 * 1000));
      let expireTime = "expires=" + dateTime.toUTCString();
      let storedLocation = window.location.href;
      if (storedLocation.includes("videoTime")) {
        storedLocation = storedLocation.split("&videoTime")[0];
      }
      document.cookie = "lastWatchedURL=" + storedLocation + "&videoTime=" + vidElement["currentTime"] + "; expires=" + expireTime + "; path=/;";
   };
  }

  ngOnInit(): void {
    document.cookie = "lastWatchedURL=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.storedLocation = window.location.href;
    if (this.storedLocation.includes("videoTime")) {
      this.storedLocation = this.storedLocation.split("&videoTime")[0];
    }
    this.videoSubscription = this.route.queryParams.subscribe(params => {
      this.videoname = "http://192.168.1.19:3000/video?video=" + params.video;
      this.rawvideoname = params.video;
      this.playlistid = params.playlistid;
      this.videoCurrentTime = params.videoTime;
    });
    this.http.get('http://192.168.1.19:3000/playlist?id=' + this.playlistid).subscribe((res: string[]) => {
      this.playlistsArray = res["videos"];
      let playingVideoIndex = this.playlistsArray.indexOf(this.rawvideoname);
      if (playingVideoIndex !== 0) {
        this.previousFile = this.playlistsArray[playingVideoIndex - 1];
      }
      if (playingVideoIndex !== this.playlistsArray.length) {
        this.nextFile = this.playlistsArray[playingVideoIndex + 1];
      }
      let next = this.nextFile;
      let listId = this.playlistid;
      let video = document.getElementById('singleVideo');
      if (this.videoCurrentTime) {
        video["currentTime"] = this.videoCurrentTime;
      }
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
      let routerr = this.router;
      video.addEventListener('ended', function () {
        if (next.length > 0) {
          routerr.navigate(['/playlistvideo'], { queryParams: { 'video': next, 'playlistid': listId } });
        }
      });
    });
  }

  accordionclick($event) {
    $event.target.classList.toggle("active");
    let panel = $event.target.nextElementSibling;
    if (panel.className === "accordion") {
      panel = panel.nextElementSibling;
    }
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  }

  ngOnDestroy(): void {
    this.videoSubscription.unsubscribe();
    let vidElement = document.getElementById("singleVideo");
    let dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (7 * 24 * 60 * 60 * 1000));
    let expireTime = "expires=" + dateTime.toUTCString();
    document.cookie = "lastWatchedURL=" + this.storedLocation + "&videoTime=" + vidElement["currentTime"] + "; expires=" + expireTime + "; path=/;";
  }
}
