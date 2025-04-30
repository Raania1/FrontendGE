import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../Services/message.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FooterComponent, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm!: FormGroup;
  submitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;
  constructor(
    private formBuilder: FormBuilder,
    private contactService: MessageService
  ) {
    this.contactForm = this.formBuilder.group({
      NomComplet: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      Sujet: ['', Validators.required],
      Message: ['', [Validators.required, Validators.minLength(10)]]
    });
   }


   get f() { 
    return this.contactForm.controls as {
      NomComplet: any;
      email: any;
      Sujet: any;
      Message: any;
    }; 
  }

 onSubmit() {
  this.submitted = true;
  this.successMessage = null; 
  this.errorMessage = null;

  if (this.contactForm.invalid) {
    return;
  }

  this.isLoading = true;
    
    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = "Votre message a été envoyé avec succès !";
        this.contactForm.reset();
        this.submitted = false;
        setTimeout(() => {
          this.successMessage = null;
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de l\'envoi du message:', error);
        this.errorMessage = "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard.";
        setTimeout(() => {
          this.errorMessage = null;
        }, 1500);
      }
    });
  
  
}
}
