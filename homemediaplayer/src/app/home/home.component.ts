import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  videonames$: Videos[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://192.168.1.18:3000/filenames').subscribe((res: string[])=> { res.forEach((data) => { this.videonames$.push({ video: data }); }); });
    console.log(this.videonames$);
  }
}

export class Videos {
  video: string;
}