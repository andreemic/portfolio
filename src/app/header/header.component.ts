import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { mobileNavAnimations } from '../animations/mobileNav.animation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: mobileNavAnimations
})
export class HeaderComponent implements OnInit {
  url: string;
  constructor(private router: Router) {
    router.events.subscribe((e:any) => {
      if (e instanceof NavigationEnd) {
        this.url = e.url;
      }
    });
    this.url = router.url;
  }
  menuOpen: boolean = false;
  showItems: boolean = false;

  menuToggle() {
    this.menuOpen = !this.menuOpen;
  }
  animationEnd() {
    //apply permanent css rule to items after animation ends
    this.showItems = this.menuOpen;
  }
  ngOnInit(): void {
  }
}
