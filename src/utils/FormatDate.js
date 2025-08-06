export const FormatDate = (fecha) => {
    if (!fecha) return "";

    const opciones = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    };

    return new Date(fecha).toLocaleDateString("es-CO", opciones);
};
