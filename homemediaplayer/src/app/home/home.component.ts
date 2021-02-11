import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  videonames = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://192.168.1.19:3000/filenames').subscribe((res: string[]) => {
      res.forEach((data) => {
          this.videonames.push(data);
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
