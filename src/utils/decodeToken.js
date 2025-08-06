const decodeToken = (token) => {
    try {
        const [, payload] = token.split(".");
        
        const decodedPayload = JSON.parse(decodeURIComponent(escape(window.atob(payload))));

        return decodedPayload;
    } catch (error) {
        console.error("Error al decodificar el token:", error.message);
        return null;
    }
};

export default decodeToken;
