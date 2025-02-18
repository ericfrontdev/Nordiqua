// /components/CreateInvoiceDialog/InvoicePreview/index.tsx

import React from 'react'
import Template1 from './Template1'
import Template2 from './Template2'
import Template3 from './Template3'
import Template4 from './Template4'
import Template5 from './Template5'
import { InvoiceItem } from '../CreateInvoiceDialog/CreateInvoiceDialog'

// Les mêmes props que vous utilisiez dans InvoicePreview
export interface InvoicePreviewProps {
  invoiceNumber: string
  invoiceDate: string
  selectedClient: string
  items: InvoiceItem[]
  total: number
  tva: number
  totalTTC: number
  selectedTemplate: string
  displayedLogo: string
}

const InvoicePreview: React.FC<InvoicePreviewProps> = (props) => {
  const { selectedTemplate } = props

  return (
    <div
      id="invoice-preview"
      className="sticky top-6"
    >
      {selectedTemplate === 'template1' && <Template1 {...props} />}
      {selectedTemplate === 'template2' && <Template2 {...props} />}
      {selectedTemplate === 'template3' && <Template3 {...props} />}
      {selectedTemplate === 'template4' && <Template4 {...props} />}
      {selectedTemplate === 'template5' && <Template5 {...props} />}
    </div>
  )
}

export default InvoicePreview
