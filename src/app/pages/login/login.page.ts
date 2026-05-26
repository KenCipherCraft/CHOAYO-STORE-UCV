import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonCheckbox } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonCheckbox, CommonModule, RouterModule]
})
export class LoginPage implements OnInit {
  
  passwordType: string = 'password';
  passwordIcon: string = 'eye-outline';

  // Inyectamos el Router para poder navegar
  constructor(private router: Router) { 
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  ngOnInit() { }

  togglePasswordMode() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  // Función que se disparará al presionar el botón
  ingresar() {
    // En el futuro, aquí enviaremos los datos a PostgreSQL para validar.
    // Por ahora, forzamos el acceso directo al sistema principal:
    this.router.navigate(['/tabs/home']);
  }
}