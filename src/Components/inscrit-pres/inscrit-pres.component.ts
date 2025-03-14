import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-inscrit-pres',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './inscrit-pres.component.html',
  styleUrl: './inscrit-pres.component.css'
})
export class InscritPresComponent {
  selectedFiles: File[] = [];
  selectedProfilePicture: File | null = null;

  constructor (private _FormBuilder: FormBuilder) {
    console.log(this.pressData)
  }
  pressData: FormGroup = this._FormBuilder.group({
    nom:['',[Validators.required, Validators.minLength(2),Validators.maxLength(15),Validators.pattern(/^[a-zA-Z\s]*$/)]],
    prenom:['',[Validators.required, Validators.minLength(2),Validators.maxLength(15),Validators.pattern(/^[a-zA-Z\s]*$/)]],
    email:['',[Validators.required, Validators.email]],
    travail:['',[Validators.required, Validators.minLength(5),Validators.maxLength(15),Validators.pattern(/^[a-zA-Z\s]*$/)]],
    description:['',[Validators.required, Validators.minLength(20)]],
    password:['',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    confirmPassword:['', Validators.required],
    numTel:['',[Validators.required, Validators.pattern(/^\d{8}$/)]],
    numCin:['',[Validators.required, Validators.pattern(/^\d{8}$/)]],
    ville:['',Validators.required],
    adress:['',[Validators.required , Validators.pattern(/^[a-zA-Z0-9\s,'-]*$/)]],
    pdProfile:[null,Validators.required],
    fichierConfirmation:[null,Validators.required],
  },{ validators:this.passwordNotmatch })
  passwordNotmatch(form:AbstractControl) : null | {[key: string]: boolean}{
    const pass = form.get('password')?.value
    const repass = form.get('confirmPassword')?.value
    if (repass !== pass){
      return{passNotMatch: true}
    }else return null
  }
   onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfilePicture = file;
      this.pressData.patchValue({ pdProfile: file });
      this.pressData.get('pdProfile')?.markAsTouched();
    }
  }
  onFilesChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      alert('Vous ne pouvez sélectionner que 5 fichiers maximum.');
      return;
    }

    this.selectedFiles = Array.from(files); 
    this.pressData.patchValue({ fichierConfirmation: this.selectedFiles });
    this.pressData.get('fichierConfirmation')?.markAsTouched();
  }
  submitted = false;
  onSubmit() {
    this.submitted = true;
    if (this.pressData.invalid) {
      this.pressData.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    Object.keys(this.pressData.value).forEach((key) => {
      if (key !== 'fichierConfirmation' && key !== 'pdProfile') {
        formData.append(key, this.pressData.value[key]);
      }
    });
    if (this.selectedProfilePicture) {
      formData.append('pdProfile', this.selectedProfilePicture);
    }

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        formData.append('fichierConfirmation', file);
      });
    }

    console.log('FormData ready to send:', formData);
  }

  get nom (){return this.pressData.get('nom')}
  get prenom (){return this.pressData.get('prenom')}
  get email (){return this.pressData.get('email')}
  get travail (){return this.pressData.get('travail')}
  get description (){return this.pressData.get('description')}
  get numTel (){return this.pressData.get('numTel')}
  get numCin (){return this.pressData.get('numCin')}
  get password (){return this.pressData.get('password');}
  get confirmPassword (){return this.pressData.get('confirmPassword');}
  get ville (){return this.pressData.get('ville');}
  get adress (){return this.pressData.get('adress');}
  get pdProfile (){return this.pressData.get('pdProfile');}
  get fichierConfirmation (){return this.pressData.get('fichierConfirmation');}

 
  

}
