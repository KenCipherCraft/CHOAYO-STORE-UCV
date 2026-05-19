import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonCheckbox,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonInput, 
    IonButton, 
    IonIcon, 
    IonCheckbox, 
    IonText,
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-outline';

  constructor(private formBuilder: FormBuilder, private router: Router) { 
    // Registramos el icono de ojo cerrado también
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
    
    // Configuramos las reglas de validación
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() { }

  // Función para revelar/ocultar contraseña
  togglePasswordMode() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  // Función que se ejecuta al darle al botón
  iniciarSesion() {
  if (this.loginForm.valid) {
    console.log('Simulando inicio de sesión exitoso...');
    // Navegamos a la pantalla principal
    this.router.navigate(['/home']);
  } else {
    console.log('Faltan datos o son incorrectos');
  }
}
}