import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { StorageKeys } from '../enums/storage.enum';
import { AuthenticationProvider } from '../providers/authentication/authentication.provider';
import { UserProvider } from './../providers/user/user.provider';

@Injectable()
export class IsAuthorised implements CanActivate {
  constructor(
    private userProvider: UserProvider,
    private authenticationProvider: AuthenticationProvider,
    private router: Router,
    private storage: Storage) { }

  private async performAuthorisationCheck() {
    const userId = await this.storage.get(StorageKeys.USER_ID);
    const user = await this.userProvider.getUserInformation(userId).toPromise();

    this.userProvider.userInformation.next(user);
    this.authenticationProvider.isAuthenticated.next(true);

    return true;
  }

  private handleUnauthorisedAccess() {
    this.router.navigate(['login']);
    this.authenticationProvider.isAuthenticated.next(false);

    return false;
  }

  canActivate() {
    try {
      return this.performAuthorisationCheck();
    } catch (error) {
      return this.handleUnauthorisedAccess();
    }
  }
}
