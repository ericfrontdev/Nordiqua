import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  "Création de factures professionnelles",
  "Gestion des clients simplifiée",
  "Suivi des paiements en temps réel",
  "Tableaux de bord personnalisables",
  "Export PDF et Excel",
  "Support client dédié"
];

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-20 pb-20 md:pt-32 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Simplifiez votre facturation
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              La solution de facturation moderne pour les entreprises qui veulent gagner du temps et se concentrer sur l'essentiel.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto rounded-xl text-lg">
                  Commencer gratuitement
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl text-lg">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Tout ce dont vous avez besoin pour votre facturation
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Une suite complète d'outils pour gérer vos factures efficacement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-effect rounded-[2rem] p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="text-lg font-medium">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-effect rounded-[2rem] p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à simplifier votre facturation ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Rejoignez des milliers d'entreprises qui font confiance à Nordiqua
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button size="lg" className="rounded-xl text-lg">
                  Essayer gratuitement
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}