export const formatRespuestasParaExcel = (data) => {
    // Obtener todas las preguntas únicas (por si cambia el orden)
    const allPreguntas = new Set();
    data.forEach((item) => {
        item.respuestas.forEach((r) => {
            allPreguntas.add(r.idPregunta.preguntaTexto);
        });
    });

    const preguntas = Array.from(allPreguntas);

    const rows = data.map((item) => {
        const fila = {
            usuario: `${item.idUsuario?.name || ''} ${item.idUsuario?.lastName || ''}`,
            placa: item.idVehiculo?.placa || '',
            fechaRespuesta: new Date(item.fechaRespuesta).toLocaleDateString(),
            estadoFormulario: item.estadoFormulario,
        };

        // Agregar cada pregunta como columna
        preguntas.forEach((preg) => {
            const respuesta = item.respuestas.find(
                (r) => r.idPregunta.preguntaTexto === preg
            );
            fila[preg] = respuesta ? (respuesta.respuesta ? '✅' : '❌') : '';
        });

        return fila;
    });

    return { rows, preguntas };
};