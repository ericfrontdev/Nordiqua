import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus, FileText, Building2, Mail, Phone } from 'lucide-react'
import { Button } from './ui/button'
import { generateInvoiceNumber } from '@/lib/utils'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface InvoiceItem {
  description: string
  quantity: number
  price: number
}

export function CreateInvoiceDialog() {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<InvoiceItem[]>([
    { description: '', quantity: 1, price: 0 },
  ])
  const addInvoice = useInvoiceStore((state) => state.addInvoice)
  const [selectedClient, setSelectedClient] = React.useState('')
  const [invoiceDate, setInvoiceDate] = React.useState(
    new Date().toISOString().split('T')[0]
  )
  const invoiceNumber = React.useMemo(() => generateInvoiceNumber(), [])

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }])
  }

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'description' ? value : Number(value),
    }
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const tva = total * 0.2 // TVA à 20%
  const totalTTC = total + tva

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClient) {
      alert('Veuillez sélectionner un client')
      return
    }

    const newInvoice = {
      id: invoiceNumber,
      client: selectedClient,
      date: invoiceDate,
      amount: total,
      status: 'pending' as const,
    }

    addInvoice(newInvoice)
    setOpen(false)

    // Reset form
    setItems([{ description: '', quantity: 1, price: 0 }])
    setSelectedClient('')
    setInvoiceDate(new Date().toISOString().split('T')[0])
  }

  const exportPDF = async () => {
    const input = document.getElementById('invoice-preview')
    if (input) {
      const canvas = await html2canvas(input, {
        backgroundColor: '#ffffff', // Définir l'arrière-plan à blanc
        scale: 2, // Augmenter la résolution
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`facture_${invoiceNumber}.pdf`)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Trigger asChild>
        <Button className="whitespace-nowrap rounded-lg">
          <Plus className="h-4 w-4 mr-2 md:mr-2" />
          <span className="hidden md:inline">Nouvelle facture</span>
          <span className="md:hidden">Facture</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[95vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-4 md:p-6 shadow-lg z-50">
          <Dialog.Title className="text-xl font-semibold">
            Créer une nouvelle facture
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            Remplissez les informations ci-dessous pour créer une nouvelle
            facture.
          </Dialog.Description>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire */}
            <div>
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Numéro de facture
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={invoiceNumber}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    <option value="Entreprise ABC">Entreprise ABC</option>
                    <option value="Studio Design">Studio Design</option>
                    <option value="Tech Solutions">Tech Solutions</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Articles</h3>
                    <Button
                      type="button"
                      onClick={addItem}
                      variant="outline"
                      className="rounded-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Article
                    </Button>
                  </div>

                  <div className="mt-4 space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 md:gap-4"
                      >
                        <div className="col-span-12 md:col-span-6">
                          <input
                            type="text"
                            placeholder="Description"
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, 'description', e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="col-span-5 md:col-span-2">
                          <input
                            type="number"
                            placeholder="Quantité"
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, 'quantity', e.target.value)
                            }
                            min="1"
                            required
                          />
                        </div>
                        <div className="col-span-5 md:col-span-3">
                          <input
                            type="number"
                            placeholder="Prix unitaire"
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(index, 'price', e.target.value)
                            }
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeItem(index)}
                            className="w-full h-full text-red-600 hover:text-red-700 rounded-lg"
                            disabled={items.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg"
                    >
                      Annuler
                    </Button>
                  </Dialog.Close>
                  <Button
                    type="submit"
                    className="rounded-lg"
                  >
                    Créer
                  </Button>
                  <Button
                    type="button"
                    onClick={exportPDF}
                    className="rounded-lg"
                  >
                    Exporter en PDF
                  </Button>
                </div>
              </form>
            </div>

            {/* Prévisualisation */}
            <div className="hidden lg:block">
              <div
                className="sticky top-6"
                id="invoice-preview"
              >
                <div className="bg-white rounded-lg shadow-lg p-8">
                  {/* En-tête */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-4xl font-bold text-primary">
                        FACTURE
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {invoiceNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">
                        Votre Entreprise
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        123 rue de l'Innovation
                        <br />
                        75001 Paris
                        <br />
                        contact@votre-entreprise.fr
                      </div>
                    </div>
                  </div>

                  {/* Informations client */}
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

                  {/* Date et échéance */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-600 text-sm">
                        DATE DE FACTURATION
                      </div>
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

                  {/* Articles */}
                  <div className="mt-8">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
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
                            <td className="py-3 text-sm text-right">
                              {item.quantity}
                            </td>
                            <td className="py-3 text-sm text-right">
                              {item.price.toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                              })}
                            </td>
                            <td className="py-3 text-sm text-right">
                              {(item.quantity * item.price).toLocaleString(
                                'fr-FR',
                                { style: 'currency', currency: 'EUR' }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total */}
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

                  {/* Notes */}
                  <div className="mt-8 text-sm text-gray-600">
                    <div className="font-medium">Notes</div>
                    <div className="mt-1">
                      Merci pour votre confiance. Le paiement est dû sous 30
                      jours.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-lg opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
