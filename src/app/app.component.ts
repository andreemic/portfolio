import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { fadeAnimation } from './animations/fade.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {
  url: string;
  
  constructor(private router: Router, private renderer: Renderer2) {
    router.events.subscribe((e:any) => {
      if (e instanceof NavigationEnd) {
        this.url = e.urlAfterRedirects || e.url;
        
        this.updateBodyScroll(renderer, this.url);
      }
    });
    this.url = router.url;
    this.updateBodyScroll(renderer, this.url);
  }

  updateBodyScroll(renderer, url) {
    //disable scroll on '/' on mobile
    if (this.url == '/') {
      renderer.addClass(document.body, 'no-scroll');
    } else {
      renderer.removeClass(document.body, 'no-scroll');
    }
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute.url.value.join('/') : '';
  }

  title = "Mikhail's Portfolio";
}

