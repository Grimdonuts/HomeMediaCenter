import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {

  playlists = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://192.168.1.19:3000/playlists').subscribe((res: string[]) => {
      res.forEach((data) => {
          this.playlists.push(data);
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
}
