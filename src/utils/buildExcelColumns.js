export const buildExcelColumns = (preguntas) => {
    const fixedColumns = [
        { header: 'Usuario', key: 'usuario', width: 20 },
        { header: 'Placa', key: 'placa', width: 15 },
        { header: 'Fecha de Respuesta', key: 'fechaRespuesta', width: 15 },
        { header: 'Estado Formulario', key: 'estadoFormulario', width: 20 },
    ];

    const dynamicColumns = preguntas.map((preg) => ({
        header: preg,
        key: preg,
        width: 50, // puedes ajustar según el texto
    }));

    return [...fixedColumns, ...dynamicColumns];
};