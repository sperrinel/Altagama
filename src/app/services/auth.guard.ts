import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Users } from '../modeles/users';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.usersService.isAuth == true) {
      let userEnCours: Users = this.usersService.getUser();
      if (this.usersService.isAuth == true && userEnCours.role == 'admin') {
        return true;
      }
    } else {
      this.router.navigate(['/notfound']);
    }
  }
}
