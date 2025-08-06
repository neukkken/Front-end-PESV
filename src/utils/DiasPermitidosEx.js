export const diasPermitidos = (dias) => {
    const hoy = new Date();
    const maxDate = new Date();
    maxDate.setDate(hoy.getDate() + dias);

    return {
        min: hoy.toISOString().split("T")[0],
        max: maxDate.toISOString().split("T")[0]
    };
};
