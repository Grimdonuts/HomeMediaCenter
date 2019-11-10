import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
 
import { AppComponent } from './app.component';
import { VgCoreModule } from 'videogular2/compiled/core';
import { VgControlsModule } from 'videogular2/compiled/controls';
import { HomeComponent } from './home/home.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
 
const appRoutes: Routes = [
    { path: 'videoplayer', component: VideoplayerComponent },
    { path: 'home', component: HomeComponent },
    { path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    }
  ];

@NgModule({
   declarations: [
       AppComponent,
       HomeComponent,
       VideoplayerComponent
   ],
   imports: [
       RouterModule.forRoot(appRoutes),
       BrowserModule,
       HttpClientModule,
       VgCoreModule,
       VgControlsModule
   ],
   providers: [],
   bootstrap: [ AppComponent ]
})
export class AppModule {
}