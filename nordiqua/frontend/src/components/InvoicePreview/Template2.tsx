// /components/CreateInvoiceDialog/InvoicePreview/Template2.tsx
import React from 'react'
import { InvoicePreviewProps } from './index'

const Template2: React.FC<InvoicePreviewProps> = ({
  invoiceNumber,
  invoiceDate,
  selectedClient,
  items,
  total,
  displayedLogo,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* ---- Code du Template 2 ---- */}
      <div className="flex justify-center mb-4">
        <img
          src={displayedLogo}
          alt="Logo"
          className="h-24 w-auto"
        />
      </div>
      <div className="flex justify-center mb-12">
        <div>
          <div className="font-medium">Votre Entreprise</div>
          <div className="text-sm text-gray-600">
            123 rue de l'Innovation
            <br />
            75001 Paris
            <br />
            contact@votre-entreprise.fr
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="font-bold text-xl text-primary">FACTURE</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl">{invoiceNumber}</div>
          <div className="text-sm text-gray-600">
            {new Date(invoiceDate).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="text-gray-600 text-sm">FACTURER À</div>
        {selectedClient ? (
          <div className="mt-1">
            <div className="font-semibold">{selectedClient}</div>
            <div className="text-sm text-gray-600">
              123 rue du Client
              <br />
              75002 Paris
              <br />
              client@example.com
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic">
            Sélectionnez un client
          </div>
        )}
      </div>
      <div>
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b border-gray-300">
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
          <tbody className="divide-y divide-gray-300">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="py-2 text-sm">
                  {item.description || (
                    <span className="text-gray-400 italic">
                      Description de l'article
                    </span>
                  )}
                </td>
                <td className="py-2 text-sm text-right">{item.quantity}</td>
                <td className="py-2 text-sm text-right">
                  {item.price.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'CAD',
                  })}
                </td>
                <td className="py-2 text-sm text-right">
                  {(item.quantity * item.price).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'CAD',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end">
          <div className="text-right">
            <div className="text-lg text-gray-600">Total</div>
            <div className="text-xl font-bold text-primary">
              {total.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'CAD',
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <p>Merci pour votre confiance.</p>
        <p>Le paiement est dû sous 30 jours.</p>
      </div>
    </div>
  )
}

export default Template2
