// /components/CreateInvoiceDialog/CreateInvoiceDialog.tsx

import React, { useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { generateInvoiceNumber } from '@/lib/utils'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import InvoiceForm from './InvoiceForm'
import InvoicePreview from '../InvoicePreview/index'

// Exemple d'interface (à adapter selon vos données)
interface Invoice {
  id: string
  client: string
  date: string
  amount: number
  status: 'pending' | 'paid' | 'overdue'
  // Ajoutez ici d'autres champs si nécessaire (ex: items)
}

export interface InvoiceItem {
  description: string
  quantity: number
  price: number
}

// Props du composant :
// - `invoice` (optionnelle) si on veut éditer une facture existante
// - `open` et `onOpenChange` pour contrôler l'ouverture du Dialog depuis l'extérieur
interface CreateInvoiceDialogProps {
  invoice?: Invoice
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateInvoiceDialog({
  invoice,
  open,
  onOpenChange,
}: CreateInvoiceDialogProps) {
  // Store
  const addInvoice = useInvoiceStore((state) => state.addInvoice)
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice) // Assurez-vous d'avoir cette méthode dans votre store

  // États du formulaire
  const [items, setItems] = React.useState<InvoiceItem[]>([
    { description: '', quantity: 1, price: 0 },
  ])
  const [selectedClient, setSelectedClient] = React.useState('')
  const [invoiceDate, setInvoiceDate] = React.useState(
    new Date().toISOString().split('T')[0]
  )
  const [invoiceNumber, setInvoiceNumber] = React.useState(() =>
    generateInvoiceNumber()
  )
  const [selectedTemplate, setSelectedTemplate] = React.useState('template1')
  const [logo, setLogo] = React.useState<string | null>(null)

  // Préremplir les champs si `invoice` est présent (mode édition)
  useEffect(() => {
    if (invoice) {
      setInvoiceNumber(invoice.id)
      setSelectedClient(invoice.client)
      setInvoiceDate(invoice.date)
      // Si vous gérez des items en base, vous pouvez aussi faire : setItems(invoice.items)
      // etc.
    } else {
      // Mode création : remettre des valeurs par défaut
      setInvoiceNumber(generateInvoiceNumber())
      setSelectedClient('')
      setInvoiceDate(new Date().toISOString().split('T')[0])
      setItems([{ description: '', quantity: 1, price: 0 }])
    }
  }, [invoice])

  // Calculs
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const tva = total * 0.2
  const totalTTC = total + tva

  // Gestion du logo
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

  // Ajout / suppression / mise à jour d'un article
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

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClient) {
      alert('Veuillez sélectionner un client')
      return
    }

    if (invoice) {
      // MODE ÉDITION : mettre à jour la facture existante
      updateInvoice({
        ...invoice,
        id: invoiceNumber,
        client: selectedClient,
        date: invoiceDate,
        amount: total,
      })
    } else {
      // MODE CRÉATION : créer une nouvelle facture
      const newInvoice = {
        id: invoiceNumber,
        client: selectedClient,
        date: invoiceDate,
        amount: total,
        status: 'pending' as const,
      }
      addInvoice(newInvoice)
    }

    // Fermer la modal
    onOpenChange(false)
  }

  // Export en PDF
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
      onOpenChange={onOpenChange}
    >
      {/* 
        Si vous souhaitez toujours afficher un bouton "Nouvelle facture" 
        lorsque invoice est vide, laissez-le. Sinon, vous pouvez le conditionner. 
      */}
      {!invoice && (
        <Dialog.Trigger asChild>
          <Button className="whitespace-nowrap rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Nouvelle facture</span>
            <span className="md:hidden">Facture</span>
          </Button>
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[95vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-4 md:p-6 shadow-lg z-50">
          <Dialog.Title className="text-xl font-semibold">
            {invoice ? 'Modifier la facture' : 'Créer une nouvelle facture'}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            {invoice
              ? 'Mettez à jour les informations de la facture.'
              : 'Remplissez les informations ci-dessous pour créer une nouvelle facture.'}
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
