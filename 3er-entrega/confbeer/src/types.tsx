export interface Conference {
  id: string;
  title: string;
  speaker: string;
  startTime: string;
  endTime: string;
  image: string;
  description: string;
  location: { latitude: number; longitude: number }; // nueva propiedad
}
