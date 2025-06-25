import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() control!: FormControl;
  @Input() id: string = '';
}
