// Base de datos de invitados y sus grupos familiares
const guestDatabase = {
    "juan-perez": {
        name: "Juan Pérez",
        familyMembers: [
            "Juan Pérez",
            "María Pérez",
            "Carlos Pérez (hijo)",
            "Ana Pérez (hija)"
        ],
        maxGuests: 4,
        ticketType: "family",
        whatsappContact: {
            name: "María (Organizadora)",
            phone: "5492657557205", // Formato: código país + número sin espacios
        }
    },
    "ana-garcia": {
        name: "Ana García",
        familyMembers: [
            "Ana García",
            "Pedro García",
            "Sofía García (hija)"
        ],
        maxGuests: 3,
        ticketType: "family",
        whatsappContact: {
            name: "Carlos (Organizador)",
            phone: "5492657557205",
        }
    },
    "luis-martinez": {
        name: "Luis Martínez",
        familyMembers: [
            "Luis Martínez"
        ],
        maxGuests: 1,
        ticketType: "individual",
        whatsappContact: {
            name: "María (Organizadora)",
            phone: "5492657557205",
        }
    },
    "carmen-lopez": {
        name: "Carmen López",
        familyMembers: [
            "Carmen López",
            "Roberto López"
        ],
        maxGuests: 2,
        ticketType: "family",
        whatsappContact: {
            name: "Carlos (Organizador)",
            phone: "5492657557205",
        }
    }
    // Agrega más invitados aquí siguiendo el mismo formato
};

// Función para obtener datos del invitado
function getGuestData(guestId) {
    return guestDatabase[guestId] || null;
}

// Función para obtener lista de todos los invitados principales
function getAllGuests() {
    return Object.keys(guestDatabase).map(id => ({
        id: id,
        name: guestDatabase[id].name
    }));
}

// Función para generar URL de WhatsApp
function generateWhatsAppURL(guestData, message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${guestData.whatsappContact.phone}?text=${encodedMessage}`;
}