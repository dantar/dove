import { Component, OnInit } from '@angular/core';
import { JwtUserData } from 'src/app/model/dove.model';
import { AuthRestService } from 'src/app/services/auth-rest.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: '[app-login-form]',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  username: string;
  password: string;

  constructor(
    private shared: SharedDataService,
    private auth: AuthRestService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.username, this.password).subscribe((user: JwtUserData) => {
      this.shared.setUser(user);
    });
  }

}
