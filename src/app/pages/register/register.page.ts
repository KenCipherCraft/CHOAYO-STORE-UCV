import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonInput, 
  IonButton, 
  IonIcon,
  IonText,
  IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, gift, callOutline } from 'ionicons/icons';
import { SupabaseService } from '../../services/supabase.service';

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
  errorMsg: string = '';
  successMsg: string = '';
  cargando: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) { 
    addIcons({gift,personOutline,mailOutline,callOutline,lockClosedOutline,eyeOutline,eyeOffOutline});
    
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit() { }

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

  async registrar() {
  this.errorMsg = '';
  this.successMsg = '';

  if (this.registerForm.invalid) return;

  this.cargando = true;

  const { fullName, email, password, telefono } = this.registerForm.value;
  const resultado = await this.supabaseService.registrar(email, password, fullName, telefono);

  this.cargando = false;

  if (resultado) {
    this.successMsg = '¡Cuenta creada! Bienvenido a LoyalApp 🎉';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3500);
  } else {
    this.errorMsg = 'No se pudo crear la cuenta. El correo ya puede estar registrado.';
  }
}
  
}