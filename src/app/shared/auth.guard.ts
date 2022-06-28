import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AppAuth } from '../services/app-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AppAuth, private router: Router) { }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.auth.loginChk().then((res: boolean) => {
      if (!res) {
        this.router.navigate(['/createaccount/login'], {
          queryParams: { returnUrl: state.url },
        });
      }
      return res;
    });
  }
}
