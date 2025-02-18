// /components/CreateInvoiceDialog/InvoicePreview/Template4.tsx
import React from 'react'
import { InvoicePreviewProps } from './index'

const Template4: React.FC<InvoicePreviewProps> = ({
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
    <div className="bg-white text-gray-800 rounded-lg shadow-lg">
      {/* ---- Code du Template 4 ---- */}
      <div className="p-6">
        {/* En-tête : Logo + infos entreprise (gauche) / Facture n° + date (droite) */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <img
              src={displayedLogo}
              alt="Logo"
              className="h-12 w-auto"
            />
            {/* Nom de l'entreprise + adresse */}
            <div>
              <div className="text-sm font-semibold">Nom de l'entreprise</div>
              <div className="text-xs text-gray-600">
                Adresse postale, Ville, Pays
              </div>
            </div>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="text-sm font-semibold">
              Facture n° {invoiceNumber}
            </div>
            <div className="text-xs text-gray-600">
              Date (émission):{' '}
              {new Date(invoiceDate).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>

        {/* Titre principal + message */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Nom de l’entreprise</h2>
          <p className="text-sm text-gray-600 mt-1">
            Ajoutez un message ici pour votre client.
          </p>
        </div>

        {/* 3 colonnes : Adresser la facture à / Détails / Paiement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Bloc "Adresser la facture à" */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500">
              Adresser la facture à
            </h3>
            <p className="text-sm mt-2 leading-5">
              {selectedClient ? (
                <>
                  {selectedClient}
                  <br />
                  Adresse courrier
                  <br />
                  Numéro de téléphone
                  <br />
                  Adresse postale
                  <br />
                  Code postal, Ville, Pays
                </>
              ) : (
                <span className="italic text-gray-400">
                  Sélectionnez un client
                </span>
              )}
            </p>
          </div>

          {/* Bloc "Détails" */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500">
              Détails
            </h3>
            <p className="text-sm mt-2 text-gray-700">
              Décrivez brièvement le travail ou le projet à accomplir.
            </p>
          </div>

          {/* Bloc "Paiement" */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500">
              Paiement
            </h3>
            <p className="text-sm mt-2 text-gray-700">
              Date d'échéance:{' '}
              {new Date(
                new Date(invoiceDate).setDate(
                  new Date(invoiceDate).getDate() + 30
                )
              ).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Tableau des articles */}
        <div className="mt-8">
          <table className="w-full">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Article
                </th>
                <th className="py-2 text-right text-xs font-semibold text-gray-600 uppercase">
                  Qté
                </th>
                <th className="py-2 text-right text-xs font-semibold text-gray-600 uppercase">
                  Prix
                </th>
                <th className="py-2 text-right text-xs font-semibold text-gray-600 uppercase">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                >
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

        {/* Sous-total, TVA, Total dû */}
        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>
                {total.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>TVA (20%)</span>
              <span>
                {tva.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1 border-t border-gray-300 pt-2">
              <span className="font-semibold">Total dû</span>
              <span className="font-semibold">
                {totalTTC.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Template4
