import { Link } from 'react-router-dom'
import { FileText, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-25 bg-white/80 backdrop-blur-sm border-b border-gray-100/20 z-50">
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-4"
        >
          <div className="bg-primary/10 p-3 rounded-lg">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nordiqua
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button
              variant="ghost"
              className="rounded-xl h-9 px-4 text-sm"
            >
              Se connecter
            </Button>
          </Link>
          <Link to="/register">
            <Button className="rounded-xl h-9 px-4 text-sm">
              Essayer gratuitement
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
