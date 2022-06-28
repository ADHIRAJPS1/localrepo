import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApiService } from './services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalDetailsResolver implements Resolve<boolean> {
  constructor(private apiservice: ApiService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const slug = route.paramMap.get('nSlug');
    return this.apiservice.getMeddicalTopicsDetails(slug).then(
      (res: any) => {
        return res;
      },
      (err) => {
        console.log('inside error', err);
      }
    );
  }
}
