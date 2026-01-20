
import * as XLSX from 'xlsx';
import { InventoryRecord, Product } from '../types';

export const exportToExcel = (record: InventoryRecord, allProducts: Product[]) => {
  const dataRows = record.items.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    
    // Convert string date to Excel serial date (optional but requested)
    // Here we use JS Date objects which SheetJS handles well.
    const inventoryDate = new Date(record.date + 'T12:00:00'); 

    return {
      'Código do Material': product?.code || 'N/A',
      'Produto': product?.name || 'Unknown',
      'Unidade Padrão': product?.unit || 'UN',
      'Caixas': item.boxes,
      'Pacotes': item.packs,
      'Unidades Avulsas': item.units,
      'Total Consolidado': item.totalConsolidated,
      'Data do Inventário': inventoryDate,
      'Responsável': record.responsible
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(dataRows);
  
  // Set column widths for better readability
  const wscols = [
    { wch: 20 }, // Code
    { wch: 30 }, // Name
    { wch: 15 }, // Unit
    { wch: 10 }, // Boxes
    { wch: 10 }, // Packs
    { wch: 15 }, // Loose
    { wch: 18 }, // Total
    { wch: 18 }, // Date
    { wch: 25 }, // Resp
  ];
  worksheet['!cols'] = wscols;

  // Format the date column to DD/MM/YYYY
  // In SheetJS, date formatting is usually done via cell metadata or template
  // We'll rely on basic numeric date output and let the app define the format string.
  const dateColIdx = 7; // Index of 'Data do Inventário'
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const cellRef = XLSX.utils.encode_cell({ r: R, c: dateColIdx });
    if (worksheet[cellRef]) {
      worksheet[cellRef].z = 'dd/mm/yyyy'; // Excel format string
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventário');

  const fileName = `Inventario_${record.date}_${record.responsible.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
