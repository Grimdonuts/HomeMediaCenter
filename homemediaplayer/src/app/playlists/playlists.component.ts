import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  videonames = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://192.168.1.19:3000/filenames').subscribe((res: string[]) => {
      res.forEach((data) => {
          this.videonames.push(data);
      });
    });
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
