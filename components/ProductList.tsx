// components/ProductList.tsx

import React, { useEffect } from 'react'
import { useStore } from '../stores/useStore'

const ProductList: React.FC = () => {
  const products = useStore((state) => state.products)
  const fetchProducts = useStore((state) => state.fetchProducts)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div>
      <h1>Liste des Produits</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.nom_produit}</li>
        ))}
      </ul>
    </div>
  )
}

export default ProductList
