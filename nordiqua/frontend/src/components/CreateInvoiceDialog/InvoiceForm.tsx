// /components/CreateInvoiceDialog/InvoiceForm.tsx
import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import InvoiceItemRow from './InvoiceItemRow'
import { InvoiceItem } from './CreateInvoiceDialog'

interface InvoiceFormProps {
  invoiceNumber: string
  invoiceDate: string
  selectedClient: string
  selectedTemplate: string
  items: InvoiceItem[]
  logo: string | null
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClientChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onTemplateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  addItem: () => void
  updateItem: (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => void
  removeItem: (index: number) => void
  onSubmit: (e: React.FormEvent) => void
  exportPDF: () => void
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceNumber,
  invoiceDate,
  selectedClient,
  selectedTemplate,
  items,
  onLogoChange,
  onDateChange,
  onClientChange,
  onTemplateChange,
  addItem,
  updateItem,
  removeItem,
  onSubmit,
  exportPDF,
}) => {
  return (
    <form
      onSubmit={onSubmit}
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
            onChange={onDateChange}
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
          onChange={onClientChange}
          required
        >
          <option value="">Sélectionner un client</option>
          <option value="Entreprise ABC">Entreprise ABC</option>
          <option value="Studio Design">Studio Design</option>
          <option value="Tech Solutions">Tech Solutions</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Logo de la facture
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onLogoChange}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Modèle de facture
        </label>
        <select
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={selectedTemplate}
          onChange={onTemplateChange}
        >
          <option value="template1">Modèle 1</option>
          <option value="template2">Modèle 2</option>
          <option value="template3">Modèle 3</option>
          <option value="template4">Modèle 4</option>
          <option value="template5">Modèle 5</option>
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
            <InvoiceItemRow
              key={index}
              index={index}
              item={item}
              updateItem={updateItem}
              removeItem={removeItem}
              disableRemove={items.length === 1}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {}}
        >
          Annuler
        </Button>
        <Button type="submit">Créer</Button>
        <Button
          type="button"
          onClick={exportPDF}
        >
          Exporter en PDF
        </Button>
      </div>
    </form>
  )
}

export default InvoiceForm
