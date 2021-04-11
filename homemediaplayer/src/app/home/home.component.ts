import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  videonames = [];
  lastWatched: string = "";
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://192.168.1.19:3000/filenames').subscribe((res: string[]) => {
      res.forEach((data) => {
        this.videonames.push(data);
      });
    });
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    var c = ca[0];
    if (c.indexOf("lastWatchedURL=") == 0) {
      this.lastWatched = c.substring("lastWatchedURL=".length, c.length);
    }
  }

  accordionclick($event) {
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

  navigateToLast() {
    window.location.href = this.lastWatched;
  }
}
