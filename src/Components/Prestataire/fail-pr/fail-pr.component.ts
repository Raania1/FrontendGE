import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fail-pr',
  standalone: true,
  imports: [RouterLink],
    template: `
<div class="flex items-center justify-center min-h-screen p-4">
  <div class="max-w-md w-full mx-auto border border-custom-gray/30 rounded-lg overflow-hidden">
    <div class="bg-red-100 border-b border-custom-gray/30 p-6">
      <h2 class="text-center text-xl font-serif font-bold text-red-700">Paiement échoué </h2>
    </div>
    <div class="text-center p-6 bg-white">
      <div class="flex justify-center mb-6">
        <div class="rounded-full bg-red-100 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-red-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <p class="mb-4 text-gray-600">Votre paiement n'a pas pu être complété.</p>
    </div>
    <div class="bg-red-50 border-t border-custom-gray/30 p-6">
      <button
        routerLink="/payment"
        class="w-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded-md"
      >
        Réessayer le paiement 
      </button>
      <button
        routerLink="/prestataire/publicitePr"
        class="w-full mt-3 border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white py-2 px-4 rounded-md"
      >
        Retour à mon espace
      </button>
    </div>
  </div>
</div>
`
})
export class FailPrComponent {

}
 