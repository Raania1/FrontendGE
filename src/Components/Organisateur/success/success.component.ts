import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaiementService } from '../../../Services/paiement.service';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../Services/contrat.service';
import { NavbarORComponent } from '../navbar-or/navbar-or.component';

@Component({
  selector: 'app-success',
  standalone: true, 
  imports: [CommonModule,RouterLink,NavbarORComponent],
  templateUrl:'./success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  message: string = '';
  contractCreated: boolean = false;
  paymentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private paiementService: PaiementService,
    private contractService: ContractService
  ) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.queryParamMap.get('payment_id');
    console.log('Payment ID from URL:', this.paymentId);

    if (this.paymentId) {
      this.paiementService.verifierPaiement(this.paymentId).subscribe({
        next: (res: any) => {
          this.message = res.success ? 'Paiement confirmé avec succès.' : 'Le paiement a échoué';
          if (res.success) {
            this.createContract(this.paymentId!);
          }
        },
        error: (err) => {
          console.error('Verification error:', err);
          this.message = "Erreur lors de la vérification du paiement.";
        }
      });
    } else {
      console.warn('No payment_id found in URL');
      this.message = "ID de paiement introuvable.";
    }
  }

  private createContract(paymentId: string): void {
    this.contractService.createContract(paymentId).subscribe({
      next: (response: any) => {
        console.log('Contract created:', response);
        this.contractCreated = true;
        this.message = 'Paiement confirmé et contrat généré avec succès.';
      },
      error: (err) => {
        console.error('Contract creation error:', err);
        this.message = 'Erreur lors de la création du contrat.';
      }
    });
  }

  downloadContract(): void {
    if (this.paymentId) {
      this.contractService.downloadContract(this.paymentId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `contract-${this.paymentId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Download error:', err);
          this.message = 'Erreur lors du téléchargement du contrat.';
        }
      }); 
    }
  }
}