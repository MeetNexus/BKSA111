import * as XLSX from 'xlsx'
import { WeekData, Product } from '../types/interfaces'
import { upsertWeekData } from '../services/weekService'
import { upsertProducts } from '../services/productService'
import { EXCEL_COLUMNS } from './excel/constants'
import { columnToIndex, getColumnValue, parseConsumptionValue } from './excel/columnUtils'
import { isValidProduct, validateExcelRow } from './excel/validation'
import { toast } from 'react-hot-toast'

export async function importConsumptionDataFromExcel(file: File, weekData: WeekData): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!file || !weekData) {
      reject(new Error('File and week data are required'))
      return
    }

    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        if (!workbook.SheetNames.length) {
          throw new Error('Le fichier Excel est vide')
        }

        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 })

        if (jsonData.length <= 1) {
          throw new Error('Le fichier ne contient pas de données')
        }

        // Skip header row
        const dataRows = jsonData.slice(1)
        
        const consumptionData: { [reference_produit: string]: number } = {}
        const products: Product[] = []

        // Get column indices
        const consumptionIdx = columnToIndex(EXCEL_COLUMNS.CONSUMPTION.letter)
        const codeDestinationIdx = columnToIndex(EXCEL_COLUMNS.CODE_DESTINATION.letter)
        const referenceIdx = columnToIndex(EXCEL_COLUMNS.REFERENCE.letter)
        const nameIdx = columnToIndex(EXCEL_COLUMNS.NAME.letter)
        const unitIdx = columnToIndex(EXCEL_COLUMNS.UNIT.letter)

        let validRowCount = 0

        for (const row of dataRows) {
          if (!validateExcelRow(row)) continue

          const product: Partial<Product> = {
            reference_produit: getColumnValue(row, referenceIdx),
            nom_produit: getColumnValue(row, nameIdx),
            code_destination: getColumnValue(row, codeDestinationIdx),
            unite_stock: getColumnValue(row, unitIdx),
            is_hidden: false
          }

          if (!isValidProduct(product)) continue

          // Get and parse consumption value
          const consumptionValue = row[consumptionIdx]
          const consommationPar1000 = parseConsumptionValue(consumptionValue)

          if (!isNaN(consommationPar1000)) {
            consumptionData[product.reference_produit!] = consommationPar1000
            products.push(product as Product)
            validRowCount++
          }
        }

        if (validRowCount === 0) {
          throw new Error('Aucune donnée valide trouvée dans le fichier')
        }

        // Update weekData with consumption_data
        const updatedWeekData: WeekData = {
          ...weekData,
          consumption_data: {
            ...weekData.consumption_data,
            ...consumptionData
          }
        }

        // Save data to database
        await Promise.all([
          upsertWeekData(updatedWeekData),
          upsertProducts(products)
        ])

        toast.success(`${validRowCount} produits importés avec succès`)
        resolve()
      } catch (error: any) {
        console.error("Erreur lors du traitement du fichier Excel :", error)
        reject(new Error(error.message || "Erreur lors du traitement du fichier"))
      }
    }

    reader.onerror = (error) => {
      console.error('Erreur lors de la lecture du fichier Excel :', error)
      reject(new Error("Erreur lors de la lecture du fichier"))
    }

    reader.readAsArrayBuffer(file)
  })
}