import React from 'react'
import {
  CreditCard,
  Users,
  FileText,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateInvoiceDialog } from '@/components/CreateInvoiceDialog/CreateInvoiceDialog'

const stats = [
  {
    name: "Chiffre d'affaires",
    value: '124 500 €',
    change: '+12.5%',
    changeType: 'positive',
    icon: TrendingUp,
    colors: {
      icon: ['#22c55e', '#16a34a'],
      value: ['#15803d', '#22c55e'],
      background: '#dcfce7',
    },
  },
  {
    name: 'Factures en attente',
    value: '12',
    change: '4 retards',
    changeType: 'negative',
    icon: FileText,
    colors: {
      icon: ['#f59e0b', '#d97706'],
      value: ['#b45309', '#f59e0b'],
      background: '#fef3c7',
    },
  },
  {
    name: 'Clients actifs',
    value: '45',
    change: '+2',
    changeType: 'positive',
    icon: Users,
    colors: {
      icon: ['#6366f1', '#4f46e5'],
      value: ['#4338ca', '#6366f1'],
      background: '#e0e7ff',
    },
  },
  {
    name: 'Taux de recouvrement',
    value: '94%',
    change: '+2.3%',
    changeType: 'positive',
    icon: CreditCard,
    colors: {
      icon: ['#8b5cf6', '#7c3aed'],
      value: ['#6d28d9', '#8b5cf6'],
      background: '#ede9fe',
    },
  },
]

export function Dashboard() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble de votre activité
          </p>
        </div>
        <CreateInvoiceDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="stat-card group"
            style={
              {
                '--icon-color-start': stat.colors.icon[0],
                '--icon-color-end': stat.colors.icon[1],
                '--value-color-start': stat.colors.value[0],
                '--value-color-end': stat.colors.value[1],
              } as React.CSSProperties
            }
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="stat-icon">
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 md:px-3 py-1 text-xs font-semibold ${
                    stat.changeType === 'positive'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </h3>
                <p className="stat-value text-2xl md:text-4xl">{stat.value}</p>
              </div>
            </div>
            <div
              className="absolute bottom-0 right-0 -mb-6 -mr-6 opacity-[0.07] transition-transform duration-300 group-hover:scale-110"
              style={{ color: stat.colors.icon[0] }}
            >
              <stat.icon className="h-24 w-24 md:h-32 md:w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-effect rounded-[2rem] overflow-hidden">
        <div className="p-4 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Activité récente
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl whitespace-nowrap"
            >
              Voir tout
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-100/20">
              <li className="py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className="stat-icon"
                      style={
                        {
                          '--icon-color-start': '#22c55e',
                          '--icon-color-end': '#16a34a',
                        } as React.CSSProperties
                      }
                    >
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Paiement reçu - Facture #INV-2024-001
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Il y a 2 heures
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 md:px-3 py-1 text-xs font-semibold text-emerald-600 whitespace-nowrap">
                      +2 500 €
                    </span>
                  </div>
                </div>
              </li>
              <li className="py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className="stat-icon"
                      style={
                        {
                          '--icon-color-start': '#ef4444',
                          '--icon-color-end': '#dc2626',
                        } as React.CSSProperties
                      }
                    >
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Retard de paiement - Facture #INV-2024-002
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Il y a 5 heures
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 md:px-3 py-1 text-xs font-semibold text-red-600 whitespace-nowrap">
                      En retard
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
