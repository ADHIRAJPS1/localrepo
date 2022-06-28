import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AppAuth } from '../services/app-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanActivate {
  constructor(private auth: AppAuth, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth.isAuthenticated.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((isAuthenticated) => {
        if (isAuthenticated) {
          // Directly open inside area
          this.router.navigateByUrl('/dashboard');
          return false;
        } else {
          // Simply allow access to the login
          return true;
        }
      })
    );
  }
}
