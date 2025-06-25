import { AppTopbar } from './../../../layout/component/app.topbar';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputComponent } from '../../../shared/input/input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [AppTopbar,RouterModule, InputComponent, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

}
