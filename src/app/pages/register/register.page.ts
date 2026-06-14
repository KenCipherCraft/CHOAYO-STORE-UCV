import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonInput, 
  IonButton, 
  IonIcon,
  IonText,
  IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, gift } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonInput, 
    IonButton, 
    IonIcon, 
    IonText,
    IonCheckbox,
    CommonModule, 
    ReactiveFormsModule,
    RouterModule
  ]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-outline';
  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-outline';

  constructor(private formBuilder: FormBuilder) { 
    // Registramos también el icono 'gift' que añadimos en el rediseño
    addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, gift });
    
    // Configuramos validaciones y añadimos la regla personalizada de contraseñas
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit() { }

  // Validador personalizado: Verifica si ambas contraseñas son idénticas
  passwordsMatch(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ noMatch: true });
      return { noMatch: true };
    } else {
      return null;
    }
  }

  togglePasswordMode() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  toggleConfirmPasswordMode() {
    this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
    this.confirmPasswordIcon = this.confirmPasswordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  registrar() {
    if (this.registerForm.valid) {
      console.log('Usuario listo para guardar en la base de datos:', this.registerForm.value);
    }
  }
}