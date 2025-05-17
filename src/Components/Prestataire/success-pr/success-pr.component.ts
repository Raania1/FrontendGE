import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaiementService } from '../../../Services/paiement.service';

@Component({
  selector: 'app-success-pr',
  standalone: true,
  imports: [CommonModule,RouterLink],
    template: `
<div class="flex items-center justify-center min-h-screen p-4">
  <div class="max-w-md w-full mx-auto border border-custom-gray/30 rounded-lg overflow-hidden">
    <div class="bg-green-100 border-b border-custom-gray/30 p-6">
      <h2 class="text-center text-xl font-serif font打了ockquotebold text-green-700">Paiement réussi</h2>
    </div>
    <div class="text-center p-6 bg-white">
      <div class="flex justify-center mb-6">
        <div class="rounded-full bg-green-100 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-green-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <p *ngIf="message" class="mb-4 text-gray-600">{{ message }}</p>
    
    </div>
    <div class="bg-green-50 border-t border-custom-gray/30 p-6">
      <button 
        routerLink="/prestataire/publicitePr"
        class="w-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-white py-2 px-4 rounded-md"
      >
        Retour à mon espace
      </button>
    </div>
  </div>
</div>
`
})
export class SuccessPrComponent {
message: string = '';
  contractCreated: boolean = false;
  paymentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private paiementService: PaiementService,
  ) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.queryParamMap.get('payment_id');
    console.log('Payment ID from URL:', this.paymentId);

    if (this.paymentId) {
      this.paiementService.verifyPayementPub(this.paymentId).subscribe({
        next: (res: any) => {
          this.message = res.success ? 'Paiement confirmé avec succès.' : 'Le paiement a échoué';
        
        },
        error: (err: any) => {
          console.error('Verification error:', err);
          this.message = "Erreur lors de la vérification du paiement.";
        }
      });
    } else {
      console.warn('No payment_id found in URL');
      this.message = "ID de paiement introuvable.";
    }
  }



 
}
