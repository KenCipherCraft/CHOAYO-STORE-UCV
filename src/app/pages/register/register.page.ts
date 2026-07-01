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
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, gift, callOutline, checkmarkCircle } from 'ionicons/icons';
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
  mostrarModalExito: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) { 
    addIcons({gift,personOutline,mailOutline,callOutline,lockClosedOutline,eyeOutline,eyeOffOutline,checkmarkCircle});
    
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/) // al menos 1 letra y 1 número
      ]],
      confirmPassword: ['', [Validators.required]],
      aceptaTerminos: [false, Validators.requiredTrue]
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

  // Indica si los datos están completos pero falta aceptar términos,
  // para mostrar el mensaje de aviso en el HTML.
  get faltaAceptarTerminos(): boolean {
    const camposBasicos = ['fullName', 'email', 'telefono', 'password', 'confirmPassword'];
    const camposValidos = camposBasicos.every(c => this.registerForm.get(c)?.valid);
    const terminosAceptados = this.registerForm.get('aceptaTerminos')?.value;
    return camposValidos && !terminosAceptados;
  }

  // Muestra el error de contraseña solo si el usuario ya escribió algo
  get passwordInvalida(): boolean {
    const control = this.registerForm.get('password');
    return !!control && control.touched && control.invalid;
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
      this.mostrarModalExito = true;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3500);
    } else {
      this.errorMsg = 'No se pudo crear la cuenta. El correo ya puede estar registrado.';
    }
  }

}