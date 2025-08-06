export const handleDownload = async (factura, name) => {
    console.log(name)
    try {
        const response = await fetch(factura);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al descargar el archivo:", error);
    }
};