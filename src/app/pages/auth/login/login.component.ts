import { Component } from '@angular/core';
import { TopbarWidget } from "../../landing/components/topbarwidget.component";
import { AppTopbar } from "../../../layout/component/app.topbar";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/input/input.component';

@Component({
  selector: 'app-login',
  imports: [TopbarWidget, AppTopbar, RouterModule, FormsModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

password: string = '';
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
