import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AppAuth } from 'src/app/services/app-auth.service';
import { Events } from './../../shared/app-events';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    public events: Events,
    public auth: AppAuth,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      $('.pgc-header-ul li a.pgc-nav-link').click(function () {
        $('.navbar-collapse').collapse('hide');
      });
    }
  }

  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 20;
  }

  gotoEditUser(u: any) {
    // console.log(u)
    this.router.navigate(['/edit-profile/' + u]);
  }

  logout() {
    localStorage.clear();
    this.events.publish('user:logout', false);
  }
}
