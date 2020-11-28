import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {ServerUserResp} from '../auth.service';

@Component({
  selector: 'app-my-login-form',
  template: `
    <mat-card>
      <mat-card-title>Login</mat-card-title>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <p>
            <mat-form-field>
              <input
                type="text"
                matInput
                placeholder="Username"
                formControlName="username"
              />
            </mat-form-field>
          </p>

          <p>
            <mat-form-field>
              <input
                type="password"
                matInput
                placeholder="Password"
                formControlName="password"
              />
            </mat-form-field>
          </p>
          <span *ngIf="error"> {{ error | json }} </span>

          <div class="button">
            <button type="submit" mat-button>Login</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        margin: 100px 0px;
      }

      .mat-form-field {
        width: 100%;
        min-width: 300px;
      }

      mat-card-title,
      mat-card-content {
        display: flex;
        justify-content: center;
      }

      .error {
        padding: 16px;
        width: 300px;
        color: white;
        background-color: red;
      }

      .button {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class LoginFormComponent {
  @Input() error: ServerUserResp | null;
  @Output() submitEM = new EventEmitter();
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

}
