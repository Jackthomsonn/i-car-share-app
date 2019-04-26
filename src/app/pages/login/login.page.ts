import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { takeUntil } from 'rxjs/operators';
import { StorageKeys } from 'src/app/enums/storage.enum';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthenticationProvider } from 'src/app/providers/authentication/authentication.provider';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage extends BaseComponent implements OnInit {
  public user: IUser;

  constructor(
    private authProvider: AuthenticationProvider,
    private router: Router,
    private storage: Storage
  ) {
    super();
  }

  public login() {
    this.authProvider.login(this.user)
      .pipe(takeUntil(this.destroyed))
      .subscribe(async (response: { accessToken: string, userId: string }) => {
        await this.storage.set(StorageKeys.ACCESS_TOKEN, response.accessToken);
        await this.storage.set(StorageKeys.USER_ID, response.userId);

        this.router.navigate(['tabs/feed']);
      });
  }

  private setupDefaultUserObject() {
    return {
      username: '',
      password: '',
      email: '',
      phoneNumber: undefined
    };
  }

  ngOnInit() {
    this.user = this.setupDefaultUserObject();
  }
}
