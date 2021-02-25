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
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

  ngOnInit(): void {
    this.videoSubscription = this.route.queryParams.subscribe(params => {
      this.videoname = "http://192.168.1.19:3000/video?video=" + params.video;
      this.rawvideoname = params.video;
      this.playlistid = params.playlistid;
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
  }
}
