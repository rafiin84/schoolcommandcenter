/**
 * Name fragments used to synthesize realistic (but entirely fictitious)
 * school names, contact names, and geographic sub-labels.
 */

export const VILLAGE_FRAGMENTS = [
  "Ambattur", "Andipatti", "Arani", "Avinashi", "Bhavani", "Chengam",
  "Cheyyar", "Dharapuram", "Gudiyatham", "Harur", "Ilayankudi", "Jayamkondam",
  "Kadayanallur", "Kallakurichi", "Kangeyam", "Kariapatti", "Kelamangalam",
  "Kilvelur", "Kodaikanal", "Koothanallur", "Kovilpatti", "Kulithalai",
  "Kumbakonam", "Lalgudi", "Mallapuram", "Mannargudi", "Mettupalayam",
  "Musiri", "Nannilam", "Odaipatti", "Oddanchatram", "Palladam", "Panruti",
  "Pattukkottai", "Peraiyur", "Perundurai", "Ponneri", "Polur", "Puduvayal",
  "Rasipuram", "Sankarapuram", "Sathankulam", "Sattur", "Sivakasi",
  "Srivaikuntam", "Suriyampalayam", "Thiruvaiyaru", "Thirukoilur",
  "Thottiyam", "Thuraiyur", "Tirukalukundram", "Udangudi", "Udumalaipettai",
  "Uthiramerur", "Vadamadurai", "Vandavasi", "Vedaranyam", "Vellakoil",
  "Virudhachalam", "Walajapet",
] as const;

export const BLOCK_MODIFIERS = [
  "North", "South", "East", "West", "Central", "Rural", "Urban", "Coastal",
] as const;

export const SCHOOL_TYPE_TEMPLATES = [
  (place: string) => `Government Higher Secondary School, ${place}`,
  (place: string) => `Government Girls Higher Secondary School, ${place}`,
  (place: string) => `Panchayat Union Middle School, ${place}`,
  (place: string) => `Panchayat Union Primary School, ${place}`,
  (place: string) => `Zilla Parishad High School, ${place}`,
  (place: string) => `Government Model School, ${place}`,
  (place: string) => `Corporation Higher Secondary School, ${place}`,
  (place: string) => `Government Boys Higher Secondary School, ${place}`,
  (place: string) => `Adi Dravidar Welfare School, ${place}`,
  (place: string) => `Municipal Middle School, ${place}`,
] as const;

export const FIRST_NAMES = [
  "Anitha", "Bala", "Chitra", "Dinesh", "Elango", "Gowri", "Hema", "Ilango",
  "Jaya", "Kamala", "Lakshmi", "Manoj", "Nirmala", "Om Prakash", "Pandiyan",
  "Radha", "Saravanan", "Thangam", "Uma", "Vasanth", "Yamuna", "Karthik",
  "Meena", "Rajesh", "Sudha", "Vijay", "Kavitha", "Muthu", "Priya", "Selvam",
] as const;

export const LAST_NAMES = [
  "Kumar", "Murugan", "Pillai", "Raman", "Subramaniam", "Natarajan", "Rani",
  "Devi", "Krishnan", "Gopal", "Shanmugam", "Velan", "Ramasamy", "Chezhian",
  "Balakrishnan", "Sundaram", "Palaniappan", "Ravichandran", "Annadurai",
] as const;

export const ADMIN_TITLES: Record<string, string[]> = {
  state: [
    "Principal Secretary, School Education",
    "State Project Director, Digital Learning Mission",
    "Director of School Education",
  ],
  district: [
    "Chief Educational Officer",
    "District Elementary Education Officer",
    "District Collector (Education Nodal)",
  ],
  block: [
    "Block Education Officer",
    "Assistant Educational Officer",
  ],
  school: [
    "Head Master",
    "Head Mistress",
    "Correspondent",
  ],
};

export function toTitleCase(value: string): string {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
