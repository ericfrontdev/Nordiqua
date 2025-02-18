// /components/CreateInvoiceDialog/InvoicePreview/Template1.tsx

import React from 'react'
import { InvoicePreviewProps } from './index'

const Template1: React.FC<InvoicePreviewProps> = ({
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
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* ---- Code du Template 1 ---- */}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <img
            src={displayedLogo}
            alt="Logo"
            className="h-12 w-auto mr-4"
          />
          <div>
            <div className="text-4xl font-bold text-primary">FACTURE</div>
            <div className="mt-1 text-sm text-gray-600">{invoiceNumber}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold">Votre Entreprise</div>
          <div className="mt-1 text-sm text-gray-600">
            123 rue de l'Innovation
            <br />
            75001 Paris
            <br />
            contact@votre-entreprise.fr
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-gray-600 text-sm">FACTURER À</div>
        {selectedClient ? (
          <div className="mt-2">
            <div className="font-semibold">{selectedClient}</div>
            <div className="mt-1 text-sm text-gray-600">
              123 rue du Client
              <br />
              75002 Paris
              <br />
              client@example.com
            </div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-400 italic">
            Sélectionnez un client
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <div className="text-gray-600 text-sm">DATE DE FACTURATION</div>
          <div className="mt-1 font-medium">
            {new Date(invoiceDate).toLocaleDateString('fr-FR')}
          </div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">ÉCHÉANCE</div>
          <div className="mt-1 font-medium">
            {new Date(
              new Date(invoiceDate).setDate(
                new Date(invoiceDate).getDate() + 30
              )
            ).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white">
              <th className="py-2 text-left text-sm font-semibold text-gray-600">
                DESCRIPTION
              </th>
              <th className="py-2 text-right text-sm font-semibold text-gray-600">
                QTÉ
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
                <td className="py-3 text-sm">
                  {item.description || (
                    <span className="text-gray-400 italic">
                      Description de l'article
                    </span>
                  )}
                </td>
                <td className="py-3 text-sm text-right">{item.quantity}</td>
                <td className="py-3 text-sm text-right">
                  {item.price.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </td>
                <td className="py-3 text-sm text-right">
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
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <div className="text-sm text-gray-600">Sous-total</div>
          <div className="font-medium">
            {total.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
        </div>
        <div className="mt-2 flex justify-between">
          <div className="text-sm text-gray-600">TVA (20%)</div>
          <div className="font-medium">
            {tva.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
          <div className="text-lg font-semibold">Total TTC</div>
          <div className="text-lg font-bold text-primary">
            {totalTTC.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-600">
        <div className="font-medium">Notes</div>
        <div className="mt-1">
          Merci pour votre confiance. Le paiement est dû sous 30 jours.
        </div>
      </div>
    </div>
  )
}

export default Template1
