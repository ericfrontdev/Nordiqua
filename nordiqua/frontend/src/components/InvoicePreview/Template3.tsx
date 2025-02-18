// /components/CreateInvoiceDialog/InvoicePreview/Template3.tsx
import React from 'react'
import { InvoicePreviewProps } from './index'

const Template3: React.FC<InvoicePreviewProps> = ({
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
    <div className="bg-white rounded-lg shadow-lg">
      {/* ---- Code du Template 3 ---- */}
      {/* Bande supérieure avec titre et date */}
      <div className="bg-[#F25D0A] text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
        <h1 className="text-3xl font-bold uppercase">Facture</h1>
        <div className="text-right text-sm uppercase">
          <div>
            Date :{' '}
            {new Date(invoiceDate).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <div>
            N° de facture :{' '}
            <span className="font-semibold">{invoiceNumber}</span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        {/* En-tête : Logo (facultatif) */}
        <div className="flex justify-end mb-4">
          <img
            src={displayedLogo}
            alt="Logo"
            className="h-12 w-auto"
          />
        </div>

        {/* Informations Client & Mode de paiement */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          {/* Bloc client */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold">
              {selectedClient || 'Nom du client'}
            </h2>
            <p className="text-sm text-gray-700 mt-1 leading-5">
              Les Vêtements d’Andrea <br />
              01 46 51 87 89 <br />
              12 rue de Varise, 75016 Paris
            </p>
          </div>

          {/* Bloc mode de paiement */}
          <div className="text-sm text-gray-700 md:text-right">
            <div className="font-bold uppercase">Mode de paiement</div>
            <div className="mt-1">
              N° d’acct : 4916 8418 9082 4339
              <br />
              Email : vetementsandrea@mail.canva
            </div>
          </div>
        </div>

        {/* Tableau des items */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left text-sm font-semibold text-gray-600">
                DESCRIPTION
              </th>
              <th className="py-2 text-center text-sm font-semibold text-gray-600">
                Qté
              </th>
              <th className="py-2 text-right text-sm font-semibold text-gray-600">
                PRIX
              </th>
              <th className="py-2 text-right text-sm font-semibold text-gray-600">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="py-2 text-sm">
                  {item.description || (
                    <span className="text-gray-400 italic">
                      Description de l'article
                    </span>
                  )}
                </td>
                <td className="py-2 text-sm text-center">{item.quantity}</td>
                <td className="py-2 text-sm text-right">
                  {item.price.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </td>
                <td className="py-2 text-sm text-right">
                  {(item.quantity * item.price).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Récapitulatif des montants */}
        <div className="flex justify-end">
          <div className="w-full max-w-sm">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sous-total</span>
              <span className="text-sm font-medium">
                {total.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-600">TVA (20%)</span>
              <span className="text-sm font-medium">
                {tva.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
            <div className="flex justify-between mt-3 border-t border-gray-300 pt-2">
              <span className="font-semibold">Total TTC</span>
              <span className="font-semibold text-[#F25D0A]">
                {totalTTC.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-8 text-sm text-gray-700">
          <p>41, rue Desaix, 75012 Paris • www.studioscréatifs.com</p>
        </div>
      </div>
    </div>
  )
}

export default Template3
