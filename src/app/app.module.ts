import { DocsModule } from './docs/docs.module';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CESIUM_TOKEN } from './docs/any-demo/cesium/config/token';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, WorkspaceModule, LayoutModule, DocsModule, BrowserAnimationsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
