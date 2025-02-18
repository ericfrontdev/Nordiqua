// /components/CreateInvoiceDialog/InvoiceItemRow.tsx
import React from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { InvoiceItem } from './CreateInvoiceDialog'

interface InvoiceItemRowProps {
  index: number
  item: InvoiceItem
  updateItem: (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => void
  removeItem: (index: number) => void
  disableRemove: boolean
}

const InvoiceItemRow: React.FC<InvoiceItemRowProps> = ({
  index,
  item,
  updateItem,
  removeItem,
  disableRemove,
}) => {
  return (
    <div className="grid grid-cols-12 gap-2 md:gap-4">
      <div className="col-span-12 md:col-span-6">
        <input
          type="text"
          placeholder="Description"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={item.description}
          onChange={(e) => updateItem(index, 'description', e.target.value)}
          required
        />
      </div>
      <div className="col-span-5 md:col-span-2">
        <input
          type="number"
          placeholder="Quantité"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={item.quantity}
          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
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
          onChange={(e) => updateItem(index, 'price', e.target.value)}
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
          disabled={disableRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default InvoiceItemRow
