import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoplayerComponent implements OnInit {
  @Input() video: any;
  videoname: string = "";
  rawvideoname: string = "";
  nextFile = "";
  previousFile = "";
  videoSubscription: any;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }


  ngOnInit() {
    this.videoSubscription = this.route.queryParams.subscribe(params => { this.videoname = "http://192.168.1.19:3000/video?video=" + params.video; this.rawvideoname = params.video; });
    this.http.get('http://192.168.1.19:3000/foldercheck?filename=' + this.rawvideoname).subscribe((res: string[]) => {
      res.forEach((data) => {
        this.previousFile = data["previous"];
        this.nextFile = data["next"];
        var video = document.getElementById('singleVideo');
        var routerr = this.router;
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
  }
}
