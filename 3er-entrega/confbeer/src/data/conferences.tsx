import { Conference } from "../types";

export const conferences: Conference[] = [
  {
    id: "1",
    title: "El arte de la IPA",
    speaker: "Juan Pérez",
    startTime: "10:00",
    endTime: "11:00",
    image: "https://placehold.co/200x120?text=IPA",
    description: "Cómo crear IPAs artesanales con aromas intensos y balance perfecto.",
    location: { latitude: -34.6037, longitude: -58.3816 } // Ej: Buenos Aires
  },
  {
    id: "2",
    title: "Maltas y secretos",
    speaker: "Laura Gómez",
    startTime: "11:15",
    endTime: "12:15",
    image: "https://placehold.co/200x120?text=Maltas",
    description: "Exploración de distintos tipos de maltas y su impacto en el cuerpo de la cerveza.",
    location: { latitude: -34.6040, longitude: -58.3820 }
  },
  {
    id: "3",
    title: "Cervezas de trigo",
    speaker: "Andrés Torres",
    startTime: "12:30",
    endTime: "13:30",
    image: "https://placehold.co/200x120?text=Trigo",
    description: "Técnicas y tradiciones detrás de las cervezas de trigo más populares.",
    location: { latitude: -34.6045, longitude: -58.3800 }
  },
  {
    id: "4",
    title: "Lúpulos del mundo",
    speaker: "Carolina Díaz",
    startTime: "14:30",
    endTime: "15:30",
    image: "https://placehold.co/200x120?text=Lupulo",
    description: "Conociendo los lúpulos internacionales y cómo usarlos en tus recetas.",
    location: { latitude: -34.6050, longitude: -58.3810 }
  },
  {
    id: "5",
    title: "Maduración en barrica",
    speaker: "Roberto Álvarez",
    startTime: "15:45",
    endTime: "16:45",
    image: "https://placehold.co/200x120?text=Barrica",
    description: "Cómo la madera aporta sabores únicos a las cervezas artesanales.",
    location: { latitude: -34.6055, longitude: -58.3825 }
  },
  {
    id: "6",
    title: "Cerveza sin alcohol",
    speaker: "María Fernández",
    startTime: "17:00",
    endTime: "18:00",
    image: "https://placehold.co/200x120?text=0%25",
    description: "Nuevas técnicas para producir cervezas sin alcohol sin perder calidad.",
    location: { latitude: -34.6060, longitude: -58.3830 }
  },
  {
    id: "7",
    title: "Microcervecerías sustentables",
    speaker: "Pablo Castro",
    startTime: "18:15",
    endTime: "19:15",
    image: "https://placehold.co/200x120?text=Eco",
    description: "Buenas prácticas de sustentabilidad aplicadas a la producción artesanal.",
    location: { latitude: -34.6065, longitude: -58.3840 }
  },
  {
    id: "8",
    title: "Maridajes perfectos",
    speaker: "Silvana López",
    startTime: "19:30",
    endTime: "20:30",
    image: "https://placehold.co/200x120?text=Food",
    description: "Cómo combinar estilos de cerveza con distintos platos y sabores.",
    location: { latitude: -34.6070, longitude: -58.3845 }
  },
  {
    id: "9",
    title: "Cerveza y levaduras salvajes",
    speaker: "Martín Ruiz",
    startTime: "20:45",
    endTime: "21:45",
    image: "https://placehold.co/200x120?text=Levadura",
    description: "Fermentaciones espontáneas y el fascinante mundo de las wild ales.",
    location: { latitude: -34.6075, longitude: -58.3850 }
  },
  {
    id: "10",
    title: "Tendencias 2025",
    speaker: "Ana Beltrán",
    startTime: "22:00",
    endTime: "23:00",
    image: "https://placehold.co/200x120?text=Trends",
    description: "Un vistazo a las nuevas tendencias en la cultura cervecera artesanal.",
    location: { latitude: -34.6080, longitude: -58.3855 }
  }
];
