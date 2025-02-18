// /components/CreateInvoiceDialog/CreateInvoiceDialog.tsx
import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { generateInvoiceNumber } from '@/lib/utils'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import InvoiceForm from './InvoiceForm'
import InvoicePreview from '../InvoicePreview/index'

export interface InvoiceItem {
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
  const [selectedTemplate, setSelectedTemplate] = React.useState('template1')
  const [logo, setLogo] = React.useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
  const tva = total * 0.2
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

    // Réinitialisation du formulaire
    setItems([{ description: '', quantity: 1, price: 0 }])
    setSelectedClient('')
    setInvoiceDate(new Date().toISOString().split('T')[0])
  }

  const exportPDF = async () => {
    const input = document.getElementById('invoice-preview')
    if (input) {
      const canvas = await html2canvas(input, {
        backgroundColor: '#ffffff',
        scale: 2,
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

  const displayedLogo = logo || '/chemin/vers/logo_default.png'

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Trigger asChild>
        <Button className="whitespace-nowrap rounded-lg">
          <Plus className="h-4 w-4 mr-2" />
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
            <InvoiceForm
              invoiceNumber={invoiceNumber}
              invoiceDate={invoiceDate}
              selectedClient={selectedClient}
              selectedTemplate={selectedTemplate}
              items={items}
              logo={logo}
              onLogoChange={handleLogoChange}
              onDateChange={(e) => setInvoiceDate(e.target.value)}
              onClientChange={(e) => setSelectedClient(e.target.value)}
              onTemplateChange={(e) => setSelectedTemplate(e.target.value)}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
              onSubmit={handleSubmit}
              exportPDF={exportPDF}
            />

            {/* Prévisualisation */}
            <div className="hidden lg:block">
              <InvoicePreview
                invoiceNumber={invoiceNumber}
                invoiceDate={invoiceDate}
                selectedClient={selectedClient}
                items={items}
                total={total}
                tva={tva}
                totalTTC={totalTTC}
                selectedTemplate={selectedTemplate}
                displayedLogo={displayedLogo}
              />
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

export default CreateInvoiceDialog
