import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ContactComponent } from './contact/contact.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HomeAnimationComponent } from './home-animation/home-animation.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { AdminComponent } from './admin/admin.component';
import { LoginFormComponent } from './admin/login-form.component';
import { PostPreviewComponent } from './post-preview/post-preview.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { QuillModule } from 'ngx-quill';
import { BlogOverviewComponent } from './blog-overview/blog-overview.component';
import { PostViewComponent } from './post-view/post-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    FooterComponent,
    HeaderComponent,
    ContactComponent,
    HomeAnimationComponent,
    ImpressumComponent,
    AdminComponent,
    LoginFormComponent,
    PostPreviewComponent,
    PostEditComponent,
    AdminOverviewComponent,
    BlogOverviewComponent,
    PostViewComponent,
  ],
  imports: [
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    QuillModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
