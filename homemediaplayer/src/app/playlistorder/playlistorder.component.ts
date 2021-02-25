import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-playlistorder',
  templateUrl: './playlistorder.component.html',
  styleUrls: ['./playlistorder.component.scss']
})
export class PlaylistorderComponent implements OnInit {
  id: string = "";
  playlistName: string = "";
  playlistVideos: Array<string> = [];
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { this.id = params.id; });
    this.http.get('http://192.168.1.19:3000/playlist?id=' + this.id).subscribe((res: string[]) => {
        this.playlistName = res["playlistname"];
        this.playlistVideos = res["videos"];
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlistVideos, event.previousIndex, event.currentIndex);
  }
}
