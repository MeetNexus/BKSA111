import { Card, CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useTheme } from '../hooks/useTheme'
import Link from 'next/link'
import { FiBox, FiShoppingCart } from 'react-icons/fi'

export default function Home() {
  const theme = useTheme()

  return (
    <div className="p-8">
      <Card variant="colored" className="mb-8">
        <CardHeader>
          <h1 className="text-3xl font-bold text-bk-brown">
            Gestion des Stocks Burger King
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-bk-brown text-lg">
            Bienvenue dans l&apos;application de gestion des stocks pour Burger King.
            Utilisez les options ci-dessous pour accéder aux différentes fonctionnalités.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/products">
          <Card
            variant="default"
            hover={true}
            className="cursor-pointer h-full"
          >
            <CardContent className="flex items-center space-x-4 p-6">
              <FiBox className="w-8 h-8 text-bk-brown" />
              <div>
                <h2 className="text-xl font-bold text-bk-brown">Produits</h2>
                <p className="text-gray-600">
                  Gérez votre catalogue de produits et leurs conversions d&apos;unités
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/orders">
          <Card
            variant="default"
            hover={true}
            className="cursor-pointer h-full"
          >
            <CardContent className="flex items-center space-x-4 p-6">
              <FiShoppingCart className="w-8 h-8 text-bk-brown" />
              <div>
                <h2 className="text-xl font-bold text-bk-brown">Commandes</h2>
                <p className="text-gray-600">
                  Gérez vos commandes et suivez les stocks en temps réel
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}