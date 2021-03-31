import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-createplaylist',
  templateUrl: './createplaylist.component.html',
  styleUrls: ['./createplaylist.component.scss']
})
export class CreateplaylistComponent implements OnInit {
  videonames = [];
  playlistid: string = "";
  playlistName: string = "";
  playlistSubscription: any;
  playlistVideos: Array<string> = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.http.get('http://192.168.1.19:3000/filenames').subscribe((res: string[]) => {
      res.forEach((data) => {
        this.videonames.push(data);
      });
    });
    this.playlistSubscription = this.route.queryParams.subscribe(params => {
      this.playlistid = params.playlistid;
    });
    if (this.playlistid !== "") {
      this.http.get('http://192.168.1.19:3000/playlist?id=' + this.playlistid).subscribe((res: string[]) => {
        this.playlistName = res["playlistname"];
        this.playlistVideos = res["videos"];
        document.getElementById("playlistname")["value"] = this.playlistName;
        document.getElementById("playlistid")["value"] = this.playlistid;
        document.getElementById("createButton")["value"] = "Modify";
        res["videos"].forEach((videoName) => {
          document.getElementById(videoName)["checked"] = true;
          document.getElementsByClassName(document.getElementById(videoName).className)[0]["checked"] = true;
        });
      });
    }
  }

  checkDescendants($event) {
    let classList = document.getElementsByClassName($event.target.className);
    for (let i = 0; i < classList.length; ++i) {
      classList[i]["checked"] = $event.target.checked;
    }
  }

  checkParent($event) {
    let classList = document.getElementsByClassName($event.target.className);
    classList[0]["checked"] = $event.target.checked;
    for (let i = 0; i < classList.length; ++i) {
      if (classList[i]["checked"]) {
        classList[0]["checked"] = true;
      }
    }
  }
}
