import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ApiService } from './services/api.service';


@Injectable({
  providedIn: 'root'
})
export class CauseDetailsResolver implements Resolve<boolean> {
  constructor(private apiservice: ApiService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const storySlug = route.paramMap.get('storyslug');
    return this.apiservice.getStoryDetails(storySlug).then(
      (res: any) => {
        return res;
      },
      (err) => {
        console.log('inside error', err);
      }
    );
  }
}
