import { Component, OnInit } from '@angular/core';
import { AuthService, User, Credentials, ServerUserResp} from '../auth.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  user: User;
  loginError: ServerUserResp;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      // get current User
      this.auth.getUser().subscribe((user: User) => {
        this.user = user;
      });
    }
  }

  logOut(): void {
    this.auth.logout();
    this.user = null;
  }

  login(user: Credentials) {
    this.auth.login(user).subscribe(
      (res: any) => {
        this.user = res.user;
        this.loginError = null;
      },

      (err) => (this.loginError = err)
    );
  }
}
