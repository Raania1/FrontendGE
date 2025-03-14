import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-inscrit-condidat',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './inscrit-condidat.component.html',
  styleUrl: './inscrit-condidat.component.css'
})
export class InscritCondidatComponent {
  constructor (private _FormBuilder: FormBuilder) {
    console.log(this.organizeData)
  }
  organizeData: FormGroup = this._FormBuilder.group({
    nom:['',[Validators.required, Validators.minLength(2),Validators.maxLength(15),Validators.pattern(/^[a-zA-Z\s]*$/)]],
    prenom:['',[Validators.required, Validators.minLength(2),Validators.maxLength(15),Validators.pattern(/^[a-zA-Z\s]*$/)]],
    email:['',[Validators.required, Validators.email]],
    password:['',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    confirmPassword:['', Validators.required],
    numTel:['',[Validators.required, Validators.pattern(/^\d{8}$/)]],
    numCin:['',[Validators.required, Validators.pattern(/^\d{8}$/)]],
    ville:['',Validators.required],
    adress:['',[Validators.required , Validators.pattern(/^[a-zA-Z0-9\s,'-]*$/)]],
    pdProfile:[null,Validators.required],
  },{ validators:this.passwordNotmatch })
  passwordNotmatch(form:AbstractControl) : null | {[key: string]: boolean}{
    const pass = form.get('password')?.value
    const repass = form.get('confirmPassword')?.value
    if (repass !== pass){
      return{passNotMatch: true}
    }else return null

  }
  selectedProfilePicture: File | null = null;
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfilePicture = file;
      this.organizeData.patchValue({ pdProfile: file });
      this.organizeData.get('pdProfile')?.markAsTouched();
    }}

  submitted = false;
  onSubmit() {
    this.submitted = true;
    if (this.organizeData.invalid) {
      this.organizeData.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.keys(this.organizeData.controls).forEach((key) => {
      const controlValue = this.organizeData.get(key)?.value;
      if (key === 'pdProfile' && this.selectedProfilePicture) {
        formData.append(key, this.selectedProfilePicture);
      } else {
        formData.append(key, controlValue);
      }
    });

    console.log('Données du formulaire envoyées:', formData);
  }

  get nom (){return this.organizeData.get('nom');}
  get prenom (){return this.organizeData.get('prenom');}
  get email (){return this.organizeData.get('email');}
  get password (){return this.organizeData.get('password');}
  get confirmPassword (){return this.organizeData.get('confirmPassword');}
  get numTel (){return this.organizeData.get('numTel');}
  get numCin (){return this.organizeData.get('numCin');}
  get ville (){return this.organizeData.get('ville');}
  get adress (){return this.organizeData.get('adress');}
  get pdProfile (){return this.organizeData.get('pdProfile');}
}
