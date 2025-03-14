import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  constructor (private _FormBuilder: FormBuilder) {
      console.log(this.userData)
    }
    userData: FormGroup = this._FormBuilder.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    })
    submitted = false;
    onSubmit() {
      this.submitted = true;
      if (this.userData.invalid) {
        this.userData.markAllAsTouched(); 
        return;
      }
      console.log('Formulaire valide', this.userData.value);
    }
    get email (){return this.userData.get('email');}
    get password (){return this.userData.get('password');}
  
}
