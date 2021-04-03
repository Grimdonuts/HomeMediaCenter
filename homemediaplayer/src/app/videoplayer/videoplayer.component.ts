import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoplayerComponent implements OnInit {
  videoname: string = "";
  rawvideoname: string = "";
  nextFile: string = "";
  previousFile: string = "";
  videoSubscription: any;
  storedLocation: string = "";
  videoCurrentTime: Number;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    window.onbeforeunload = function (e) {
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


  ngOnInit() {
    document.cookie = "lastWatchedURL=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.storedLocation = window.location.href;
    if (this.storedLocation.includes("videoTime")) {
      this.storedLocation = this.storedLocation.split("&videoTime")[0];
    }
    this.videoSubscription = this.route.queryParams.subscribe(params => {
      this.videoname = "http://192.168.1.19:3000/video?video=" + params.video;
      this.rawvideoname = params.video;
      this.videoCurrentTime = params.videoTime;
    });
    this.http.get('http://192.168.1.19:3000/foldercheck?filename=' + this.rawvideoname).subscribe((res: string[]) => {
      res.forEach((data) => {
        this.previousFile = data["previous"];
        this.nextFile = data["next"];
        let video = document.getElementById('singleVideo');
        if (this.videoCurrentTime) {
          video["currentTime"] = this.videoCurrentTime;
        }
        let routerr = this.router;
        video.addEventListener('ended', function () {
          if (data["next"].length > 0) {
            routerr.navigate(['/videoplayer'], { queryParams: { 'video': data["next"] } });
          }
        });
      });
    });
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
