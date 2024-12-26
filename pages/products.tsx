import { useEffect, useState } from 'react'
import { useProducts, useCategories } from '../hooks/useSupabase'
import { Product } from '../types/interfaces'
import CategoryModal from '../components/CategoryModal'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
import { updateProduct } from '../services/productService'
import { toast } from 'react-hot-toast'
import { useSorting } from '../hooks/useSorting'
import SortableTableHead from '../components/ui/SortableTableHead'

type TabType = 'visible' | 'hidden'

export default function ProductsPage() {
  const { data: products, isLoading, error, refetch } = useProducts()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('visible')
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const filteredProducts = products?.filter(
    (product) =>
      (activeTab === 'visible' ? !product.is_hidden : product.is_hidden) &&
      (product.nom_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.reference_produit.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const { sortedItems: sortedProducts, sortConfig, requestSort } = useSorting(
    filteredProducts,
    { key: 'reference_produit', direction: 'asc' }
  )

  const toggleProductVisibility = async (product: Product) => {
    const updatedProduct = { ...product, is_hidden: !product.is_hidden }
    try {
      await updateProduct(updatedProduct)
      await refetch()
      toast.success(
        updatedProduct.is_hidden 
          ? 'Produit masqué des commandes' 
          : 'Produit visible dans les commandes'
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit :', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <Card>
          <CardContent>Chargement des produits...</CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Card variant="colored">
          <CardContent>Erreur lors du chargement des produits : {error.message}</CardContent>
        </Card>
      </div>
    )
  }

  const visibleCount = products?.filter(p => !p.is_hidden).length || 0
  const hiddenCount = products?.filter(p => p.is_hidden).length || 0

  return (
    <div className="p-8">
      <Card variant="colored" className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-bk-brown">Gestion des Produits</h1>
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'visible' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('visible')}
          className="flex-1 sm:flex-none"
        >
          Produits Visibles ({visibleCount})
        </Button>
        <Button
          variant={activeTab === 'hidden' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('hidden')}
          className="flex-1 sm:flex-none"
        >
          Produits Masqués ({hiddenCount})
        </Button>
      </div>

      <Card variant="default">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  label="Référence"
                  sortKey="reference_produit"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
                <SortableTableHead
                  label="Nom"
                  sortKey="nom_produit"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
                <SortableTableHead
                  label="Catégorie"
                  sortKey="category_id"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
                <SortableTableHead
                  label="Unité de Stock"
                  sortKey="unite_stock"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
                <SortableTableHead
                  label="Visibilité dans les commandes"
                  sortKey="is_hidden"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.reference_produit}</TableCell>
                  <TableCell>{product.nom_produit}</TableCell>
                  <TableCell>
                    <Select
                      options={[
                        { value: '', label: 'Sélectionner une catégorie', disabled: true },
                        { value: 'new', label: '+ Nouvelle catégorie', disabled: false },
                        ...(categories?.map(cat => ({
                          value: cat.id!,
                          label: cat.name
                        })) || [])
                      ]}
                      value={product.category_id || ''}
                      onChange={async (e) => {
                        if (e.target.value === 'new') {
                          setShowCategoryModal(true)
                          return
                        }
                        const categoryId = e.target.value ? Number(e.target.value) : null
                        try {
                          await updateProduct({
                            ...product,
                            category_id: categoryId || undefined
                          })
                          toast.success('Catégorie mise à jour')
                          refetch()
                        } catch (error) {
                          toast.error('Erreur lors de la mise à jour de la catégorie')
                        }
                      }}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>{product.unite_stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.is_hidden ? 'secondary' : 'default'}>
                      {product.is_hidden ? 'Masqué' : 'Visible'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Conversion
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleProductVisibility(product)}
                        title={product.is_hidden ? 'Rendre visible' : 'Masquer'}
                      >
                        {product.is_hidden ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? 'Aucun produit trouvé pour cette recherche'
                      : activeTab === 'visible'
                      ? 'Aucun produit visible'
                      : 'Aucun produit masqué'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <h2 className="text-xl font-bold">
                Conversion des unités pour {selectedProduct.nom_produit}
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Nombre de sachets dans le colis"
                  type="number"
                  value={selectedProduct.unit_conversion?.number_of_packs || ''}
                  onChange={(e) => {
                    setSelectedProduct({
                      ...selectedProduct,
                      unit_conversion: {
                        ...selectedProduct.unit_conversion,
                        number_of_packs: Number(e.target.value),
                      },
                    })
                  }}
                />
                <Input
                  label="Nombre d'unités par sachet"
                  type="number"
                  value={selectedProduct.unit_conversion?.units_per_pack || ''}
                  onChange={(e) => {
                    setSelectedProduct({
                      ...selectedProduct,
                      unit_conversion: {
                        ...selectedProduct.unit_conversion,
                        units_per_pack: Number(e.target.value),
                      },
                    })
                  }}
                />
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setSelectedProduct(null)} variant="secondary">
                    Annuler
                  </Button>
                  <Button
                    onClick={async () => {
                      await updateProduct(selectedProduct)
                      setSelectedProduct(null)
                      refetch()
                    }}
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  )
}