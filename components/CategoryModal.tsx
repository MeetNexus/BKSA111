import { useState } from 'react'
import { Card, CardHeader, CardContent } from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'
import { createCategory } from '../services/categoryService'
import { toast } from 'react-hot-toast'

interface CategoryModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CategoryModal({ onClose, onSuccess }: CategoryModalProps) {
  const [categoryName, setCategoryName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error('Le nom de la catégorie est requis')
      return
    }

    setIsSubmitting(true)
    try {
      await createCategory(categoryName.trim())
      toast.success('Catégorie créée avec succès')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error)
      toast.error('Erreur lors de la création de la catégorie')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <h2 className="text-xl font-bold text-bk-brown">
            Nouvelle Catégorie
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Nom de la catégorie"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Entrez le nom de la catégorie"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={onClose}
                variant="secondary"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}