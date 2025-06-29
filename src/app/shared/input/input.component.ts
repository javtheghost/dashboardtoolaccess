import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './input.component.html',
})
export class InputComponent {
    @Input() label: string = '';
  @Input() icon: string = 'edit';
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() model: any;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() placeholder: string = '';
  @Input() inputmode: string = 'text';
  @Input() textarea: boolean = false;
  @Input() rows: number = 3;
  @Input() name: string = '';

    @Input() errorMessage: string = 'Este campo es obligatorio';

}
