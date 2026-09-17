/**
 * Base geographic reference points for Tamil Nadu's 38 districts.
 * Coordinates are approximate district-centroid values used only to place
 * districts sensibly on a schematic map — not survey-grade GIS data.
 * All operational metrics attached to these districts elsewhere in the
 * mock data layer are synthetic.
 */
export interface DistrictSeed {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export const DISTRICT_SEEDS: DistrictSeed[] = [
  { id: "ariyalur", name: "Ariyalur", latitude: 11.14, longitude: 79.08 },
  { id: "chengalpattu", name: "Chengalpattu", latitude: 12.69, longitude: 79.98 },
  { id: "chennai", name: "Chennai", latitude: 13.08, longitude: 80.27 },
  { id: "coimbatore", name: "Coimbatore", latitude: 11.02, longitude: 76.97 },
  { id: "cuddalore", name: "Cuddalore", latitude: 11.75, longitude: 79.75 },
  { id: "dharmapuri", name: "Dharmapuri", latitude: 12.13, longitude: 78.16 },
  { id: "dindigul", name: "Dindigul", latitude: 10.36, longitude: 77.98 },
  { id: "erode", name: "Erode", latitude: 11.34, longitude: 77.73 },
  { id: "kallakurichi", name: "Kallakurichi", latitude: 11.74, longitude: 78.96 },
  { id: "kanchipuram", name: "Kanchipuram", latitude: 12.84, longitude: 79.70 },
  { id: "kanyakumari", name: "Kanyakumari", latitude: 8.09, longitude: 77.47 },
  { id: "karur", name: "Karur", latitude: 10.96, longitude: 78.08 },
  { id: "krishnagiri", name: "Krishnagiri", latitude: 12.52, longitude: 78.21 },
  { id: "madurai", name: "Madurai", latitude: 9.93, longitude: 78.12 },
  { id: "mayiladuthurai", name: "Mayiladuthurai", latitude: 11.10, longitude: 79.65 },
  { id: "nagapattinam", name: "Nagapattinam", latitude: 10.77, longitude: 79.84 },
  { id: "namakkal", name: "Namakkal", latitude: 11.22, longitude: 78.17 },
  { id: "nilgiris", name: "The Nilgiris", latitude: 11.41, longitude: 76.70 },
  { id: "perambalur", name: "Perambalur", latitude: 11.23, longitude: 78.88 },
  { id: "pudukkottai", name: "Pudukkottai", latitude: 10.38, longitude: 78.82 },
  { id: "ramanathapuram", name: "Ramanathapuram", latitude: 9.37, longitude: 78.83 },
  { id: "ranipet", name: "Ranipet", latitude: 12.93, longitude: 79.33 },
  { id: "salem", name: "Salem", latitude: 11.66, longitude: 78.15 },
  { id: "sivaganga", name: "Sivaganga", latitude: 9.85, longitude: 78.48 },
  { id: "tenkasi", name: "Tenkasi", latitude: 8.96, longitude: 77.31 },
  { id: "thanjavur", name: "Thanjavur", latitude: 10.79, longitude: 79.14 },
  { id: "theni", name: "Theni", latitude: 10.01, longitude: 77.48 },
  { id: "thoothukudi", name: "Thoothukudi", latitude: 8.80, longitude: 78.13 },
  { id: "tiruchirappalli", name: "Tiruchirappalli", latitude: 10.79, longitude: 78.70 },
  { id: "tirunelveli", name: "Tirunelveli", latitude: 8.71, longitude: 77.76 },
  { id: "tirupathur", name: "Tirupathur", latitude: 12.50, longitude: 78.57 },
  { id: "tiruppur", name: "Tiruppur", latitude: 11.11, longitude: 77.34 },
  { id: "tiruvallur", name: "Tiruvallur", latitude: 13.14, longitude: 79.91 },
  { id: "tiruvannamalai", name: "Tiruvannamalai", latitude: 12.23, longitude: 79.07 },
  { id: "tiruvarur", name: "Tiruvarur", latitude: 10.77, longitude: 79.63 },
  { id: "vellore", name: "Vellore", latitude: 12.92, longitude: 79.13 },
  { id: "viluppuram", name: "Viluppuram", latitude: 11.94, longitude: 79.49 },
  { id: "virudhunagar", name: "Virudhunagar", latitude: 9.59, longitude: 77.96 },
];
