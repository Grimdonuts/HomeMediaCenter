import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
 
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { CreateplaylistComponent } from './createplaylist/createplaylist.component';
 
const appRoutes: Routes = [
    { path: 'videoplayer', component: VideoplayerComponent },
    { path: 'home', component: HomeComponent },
    { path: 'upload', component: UploadComponent },
    { path: 'playlists', component: PlaylistsComponent },
    { path: 'createplaylist', component: CreateplaylistComponent },
    { path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    }
  ];

@NgModule({
   declarations: [
       AppComponent,
       HomeComponent,
       VideoplayerComponent,
       UploadComponent,
       PlaylistsComponent,
       CreateplaylistComponent
   ],
   imports: [
       RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
       BrowserModule,
       HttpClientModule
   ],
   providers: [],
   bootstrap: [ AppComponent ]
})
export class AppModule {
}