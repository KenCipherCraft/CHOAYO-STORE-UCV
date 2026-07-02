import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.page.html',
  styleUrls: ['./terminos.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, RouterModule]
})
export class TerminosPage {}