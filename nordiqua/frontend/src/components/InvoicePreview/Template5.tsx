// /components/CreateInvoiceDialog/InvoicePreview/Template5.tsx

import React from 'react'
import { InvoicePreviewProps } from './index'

const Template5: React.FC<InvoicePreviewProps> = ({
  invoiceNumber,
  invoiceDate,
  selectedClient,
  items,
  total,
  tva,
  totalTTC,
  displayedLogo,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-gray-900">
      {/* En-tête principale */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-300 pb-4">
        {/* Titre FACTURE */}
        <div>
          <h1 className="text-4xl font-bold tracking-wide uppercase">
            FACTURE
          </h1>
          {/* Numéro de facture & date de facture */}
          <div className="mt-2 text-sm text-gray-700">
            Facture n°{invoiceNumber} <br />
            {new Date(invoiceDate).toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Logo (facultatif) */}
        <div className="mt-4 md:mt-0">
          <img
            src={displayedLogo}
            alt="Logo"
            className="h-12 w-auto"
          />
        </div>
      </div>

      {/* Coordonnées (gauche = émetteur, droite = client) */}
      <div className="flex flex-col md:flex-row justify-between items-start mt-6 border-b border-gray-300 pb-4">
        {/* Bloc gauche : informations de l'émetteur (exemple) */}
        <div className="mb-6 md:mb-0">
          <p className="font-semibold uppercase">CÉLIA NAUDIN</p>
          <p className="text-sm text-gray-700 mt-1">
            125-456-7890 <br />
            hello@reallygreatsite.com <br />
            123 Anywhere St, Any City
          </p>
        </div>

        {/* Bloc droit : informations du client */}
        <div className="md:text-right">
          <p className="uppercase text-sm text-gray-500 font-semibold">
            À L’ATTENTION DE
          </p>
          {selectedClient ? (
            <p className="mt-1 text-gray-700">
              {selectedClient}
              <br />
              123-456-7890
              <br />
              info@reallygreatsite.com
              <br />
              Anywhere St, Any City
            </p>
          ) : (
            <p className="mt-1 italic text-gray-400">Sélectionnez un client</p>
          )}
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left">
              <th className="py-2 w-1/2">DESCRIPTION</th>
              <th className="py-2 w-1/6 text-right">PRIX</th>
              <th className="py-2 w-1/6 text-right">QUANTITÉ</th>
              <th className="py-2 w-1/6 text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <td className="py-3">
                  {item.description || (
                    <span className="italic text-gray-400">
                      Description de l'article
                    </span>
                  )}
                </td>
                <td className="py-3 text-right">
                  {item.price.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">
                  {(item.quantity * item.price).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sous-total, TVA, Total */}
      <div className="flex justify-end mt-6">
        <div className="w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Sous total</span>
            <span>
              {total.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>TVA (20%)</span>
            <span>
              {tva.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2 font-semibold">
            <span>Total</span>
            <span>
              {totalTTC.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Informations de paiement + remerciements */}
      <div className="mt-6 border-t border-gray-300 pt-4 text-sm">
        <p>
          Paiement à l’ordre de : <strong>Célia Naudin</strong> <br />
          N° de compte 0123 4567 8901 2345
        </p>
        <p className="mt-6 text-center font-semibold">
          MERCI DE VOTRE CONFIANCE
        </p>
      </div>
    </div>
  )
}

export default Template5
