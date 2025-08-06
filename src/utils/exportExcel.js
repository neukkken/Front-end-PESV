import ExcelJs from 'exceljs';
import saveAs from 'file-saver';
import { formatRespuestasParaExcel } from './formatRespuestasParaExcel';
import { buildExcelColumns } from './buildExcelColumns';

export const exportExcel = async (data, colums, fileName) => {
    const workbook = new ExcelJs.Workbook();

    // Agrupar por mes-año
    const agrupado = {};
    data.forEach((item) => {
        const fecha = new Date(item.fechaRespuesta);
        const key = fecha.toLocaleString('es-CO', { month: 'long', year: 'numeric' });

        if (!agrupado[key]) agrupado[key] = [];
        agrupado[key].push(item);
    });

    // Recorrer cada grupo y crear una hoja
    for (const mes in agrupado) {
        const raw = agrupado[mes];
        const { rows, preguntas } = formatRespuestasParaExcel(raw);
        const columns = buildExcelColumns(preguntas);

        const sheet = workbook.addWorksheet(mes);
        sheet.columns = columns;

        rows.forEach(row => {
            sheet.addRow(row);
        });

        // Estilo encabezado
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2C3E50' },
            };
            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // ✅ Agregar filtro automático en fila 1
        const colCount = sheet.columnCount;
        const lastColLetter = String.fromCharCode(64 + colCount); // Ej: A, B, ..., Z
        sheet.autoFilter = {
            from: 'A1',
            to: `${lastColLetter}1`
        };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, fileName);
};