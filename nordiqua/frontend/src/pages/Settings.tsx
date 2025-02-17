import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, Mail, Phone, Globe, CreditCard, Wallet, BellRing, Shield, Paintbrush, Languages, Receipt, ArrowUpRight, Check, AlertCircle, ChevronDown, X, Save, CreditCard as StripeIcon, GoalIcon as PaypalIcon, Clock, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/useAuthStore';

const quickSettings = [
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Gérez vos préférences de notifications',
    icon: BellRing,
    status: 'Activées',
    statusType: 'success',
  },
  {
    id: 'security',
    name: 'Sécurité',
    description: 'Double authentification et sécurité',
    icon: Shield,
    status: 'À configurer',
    statusType: 'warning',
  },
  {
    id: 'theme',
    name: 'Personnalisation',
    description: 'Thème et apparence',
    icon: Paintbrush,
    status: 'Thème clair',
    statusType: 'info',
  },
  {
    id: 'language',
    name: 'Langue',
    description: 'Préférences linguistiques',
    icon: Languages,
    status: 'Français',
    statusType: 'info',
  },
];

const settingsSections = [
  {
    id: 'company',
    title: 'Informations de l\'entreprise',
    icon: Building,
    description: 'Gérez les informations de votre entreprise',
    fields: [
      { id: 'name', icon: Building, label: 'Nom de l\'entreprise', type: 'text', value: 'InvoicePro SARL' },
      { id: 'email', icon: Mail, label: 'Email professionnel', type: 'email', value: 'contact@invoicepro.fr' },
      { id: 'phone', icon: Phone, label: 'Téléphone', type: 'tel', value: '+33 1 23 45 67 89' },
      { id: 'website', icon: Globe, label: 'Site web', type: 'url', value: 'www.invoicepro.fr' },
    ],
    colors: {
      icon: ['#6366f1', '#4f46e5'],
      value: ['#4338ca', '#6366f1'],
    },
  },
  {
    id: 'payment',
    title: 'Paramètres de paiement',
    icon: Wallet,
    description: 'Configurez vos méthodes de paiement',
    fields: [
      { 
        id: 'stripe',
        icon: StripeIcon,
        label: 'Paiement par carte (Stripe)',
        type: 'checkbox',
        checked: true,
        subfields: [
          { id: 'public_key', label: 'Clé publique Stripe', type: 'text', value: '' },
          { id: 'secret_key', label: 'Clé secrète Stripe', type: 'password', value: '' },
        ]
      },
      { 
        id: 'paypal',
        icon: PaypalIcon,
        label: 'PayPal',
        type: 'checkbox',
        checked: false,
        subfields: [
          { id: 'client_id', label: 'Client ID PayPal', type: 'text', value: '' },
          { id: 'secret', label: 'Secret PayPal', type: 'password', value: '' },
          { id: 'sandbox', label: 'Mode Sandbox', type: 'checkbox', checked: true },
        ]
      },
    ],
    colors: {
      icon: ['#22c55e', '#16a34a'],
      value: ['#15803d', '#22c55e'],
    },
  },
  {
    id: 'notifications',
    title: 'Notifications et pénalités',
    icon: Bell,
    description: 'Configurez les rappels et pénalités de retard',
    fields: [
      {
        id: 'reminders',
        icon: Clock,
        label: 'Rappels automatiques',
        type: 'checkbox',
        checked: true,
        subfields: [
          {
            id: 'first_days',
            label: 'Premier rappel (jours avant échéance)',
            type: 'number',
            value: '15',
            placeholder: 'Nombre de jours',
            min: 1,
            max: 30,
          },
          {
            id: 'second_days',
            label: 'Second rappel (jours avant échéance)',
            type: 'number',
            value: '7',
            placeholder: 'Nombre de jours',
            min: 1,
            max: 30,
          },
        ],
      },
      {
        id: 'penalties',
        icon: Receipt,
        label: 'Pénalités de retard',
        type: 'checkbox',
        checked: true,
        subfields: [
          {
            id: 'rate',
            label: 'Taux de pénalité annuel (%)',
            type: 'number',
            value: '10',
            placeholder: 'Taux en %',
            min: 0,
            max: 100,
            step: '0.1',
          },
          {
            id: 'grace_period',
            label: 'Délai de grâce (jours)',
            type: 'number',
            value: '3',
            placeholder: 'Nombre de jours',
            min: 0,
            max: 30,
          },
        ],
      },
    ],
    colors: {
      icon: ['#8b5cf6', '#7c3aed'],
      value: ['#6d28d9', '#8b5cf6'],
    },
  },
];

export function Settings() {
  const { user } = useAuthStore();
  const [isDangerZoneOpen, setIsDangerZoneOpen] = React.useState(false);
  const [editingSections, setEditingSections] = React.useState<Record<string, boolean>>({});
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [expandedPaymentMethods, setExpandedPaymentMethods] = React.useState<Record<string, boolean>>({});

  // Initialiser les données du formulaire
  React.useEffect(() => {
    const initialData: Record<string, any> = {};
    settingsSections.forEach(section => {
      initialData[section.id] = {};
      section.fields.forEach(field => {
        if (field.type === 'checkbox') {
          initialData[section.id][field.id] = field.checked;
          if (field.subfields) {
            field.subfields.forEach(subfield => {
              if (subfield.type === 'checkbox') {
                initialData[section.id][`${field.id}_${subfield.id}`] = subfield.checked;
              } else {
                initialData[section.id][`${field.id}_${subfield.id}`] = subfield.value;
              }
            });
          }
        } else {
          initialData[section.id][field.id] = field.value;
        }
      });
    });
    setFormData(initialData);
  }, []);

  const toggleEditMode = (sectionId: string) => {
    setEditingSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleInputChange = (sectionId: string, fieldId: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value
      }
    }));
  };

  const togglePaymentMethod = (methodId: string) => {
    setExpandedPaymentMethods(prev => ({
      ...prev,
      [methodId]: !prev[methodId]
    }));
  };

  const handleSave = (sectionId: string) => {
    // Ici, vous pouvez implémenter la logique de sauvegarde
    console.log('Saving section:', sectionId, formData[sectionId]);
    toggleEditMode(sectionId);
  };

  const renderField = (section: any, field: any) => {
    if (field.type === 'checkbox') {
      return (
        <div className="space-y-4">
          {editingSections[section.id] ? (
            // Mode édition - Afficher le switch
            <label className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer">
              <Switch
                checked={formData[section.id]?.[field.id] ?? field.checked}
                onCheckedChange={(checked) => {
                  handleInputChange(section.id, field.id, checked);
                  if (field.subfields) {
                    togglePaymentMethod(field.id);
                  }
                }}
                className="data-[state=checked]:bg-primary"
              />
              <div className="flex items-center gap-2">
                <field.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{field.label}</span>
              </div>
            </label>
          ) : (
            // Mode lecture - Afficher l'état sans le switch
            <div className="flex items-center gap-3 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <field.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{field.label}</span>
              </div>
              <div className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                formData[section.id]?.[field.id] ?? field.checked
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {formData[section.id]?.[field.id] ?? field.checked ? 'Activé' : 'Désactivé'}
              </div>
            </div>
          )}

          {/* Sous-champs pour les méthodes de paiement et notifications */}
          {field.subfields && (formData[section.id]?.[field.id] ?? field.checked) && (
            <div className="ml-14 space-y-4 p-4 bg-gray-50 rounded-xl">
              {field.subfields.map((subfield: any) => (
                <div key={subfield.id} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {subfield.label}
                  </label>
                  {subfield.type === 'checkbox' ? (
                    editingSections[section.id] ? (
                      <Switch
                        checked={formData[section.id]?.[`${field.id}_${subfield.id}`] ?? subfield.checked}
                        onCheckedChange={(checked) => 
                          handleInputChange(section.id, `${field.id}_${subfield.id}`, checked)
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                    ) : (
                      <div className={`text-sm ${
                        formData[section.id]?.[`${field.id}_${subfield.id}`] ?? subfield.checked
                          ? 'text-emerald-600'
                          : 'text-gray-600'
                      }`}>
                        {formData[section.id]?.[`${field.id}_${subfield.id}`] ?? subfield.checked ? 'Activé' : 'Désactivé'}
                      </div>
                    )
                  ) : (
                    <input
                      type={subfield.type}
                      value={formData[section.id]?.[`${field.id}_${subfield.id}`] ?? subfield.value}
                      onChange={(e) => 
                        handleInputChange(section.id, `${field.id}_${subfield.id}`, e.target.value)
                      }
                      disabled={!editingSections[section.id]}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                      placeholder={subfield.placeholder}
                      min={subfield.min}
                      max={subfield.max}
                      step={subfield.step}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative group">
        <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary/5 transition-colors">
          <field.icon className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="font-medium">{field.label}</div>
            {editingSections[section.id] ? (
              <input
                type={field.type}
                value={formData[section.id]?.[field.id] ?? field.value}
                onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                {formData[section.id]?.[field.id] ?? field.value}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Paramètres
          </h1>
          <p className="text-muted-foreground mt-2">Personnalisez votre expérience</p>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {quickSettings.map((setting) => (
          <div
            key={setting.id}
            className="glass-effect rounded-[2rem] p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="stat-icon" style={{
                '--icon-color-start': setting.statusType === 'success' ? '#22c55e' 
                  : setting.statusType === 'warning' ? '#f59e0b'
                  : '#6366f1',
                '--icon-color-end': setting.statusType === 'success' ? '#16a34a'
                  : setting.statusType === 'warning' ? '#d97706'
                  : '#4f46e5',
              } as React.CSSProperties}>
                <setting.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{setting.name}</h3>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                setting.statusType === 'success' ? 'bg-emerald-50 text-emerald-600'
                : setting.statusType === 'warning' ? 'bg-amber-50 text-amber-600'
                : 'bg-blue-50 text-blue-600'
              }`}>
                {setting.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {settingsSections.map((section) => (
          <div
            key={section.id}
            className="glass-effect rounded-[2rem] p-6 md:p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="stat-icon" style={{
                '--icon-color-start': section.colors.icon[0],
                '--icon-color-end': section.colors.icon[1],
              } as React.CSSProperties}>
                <section.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {section.fields.map((field) => (
                <div key={field.id} className="group">
                  {renderField(section, field)}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100/20">
              {editingSections[section.id] ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => toggleEditMode(section.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button 
                    className="flex-1 rounded-xl"
                    onClick={() => handleSave(section.id)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full rounded-xl"
                  onClick={() => toggleEditMode(section.id)}
                >
                  Modifier les paramètres
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="glass-effect rounded-[2rem] overflow-hidden border border-red-200/20">
        <button
          onClick={() => setIsDangerZoneOpen(!isDangerZoneOpen)}
          className="w-full p-6 md:p-8 flex items-center gap-4 text-left hover:bg-red-50/50 transition-colors"
        >
          <div className="stat-icon" style={{
            '--icon-color-start': '#ef4444',
            '--icon-color-end': '#dc2626',
          } as React.CSSProperties}>
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-red-600">Zone de danger</h2>
            <p className="text-sm text-muted-foreground">Actions irréversibles</p>
          </div>
          <ChevronDown className={`h-5 w-5 text-red-600 transition-transform ${isDangerZoneOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isDangerZoneOpen && (
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <div className="pt-6 md:pt-8 flex flex-col sm:flex-row gap-6 sm:gap-4">
              <Button variant="outline" className="flex-1 rounded-xl text-red-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                Supprimer toutes les données
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl text-red-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                Désactiver le compte
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}