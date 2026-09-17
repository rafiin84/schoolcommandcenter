import type { AdministrativeLevel } from "./common";

export interface LeadershipContact {
  id: string;
  name: string;
  title: string;
  administrativeLevel: AdministrativeLevel;
  districtId: string | null;
  blockId: string | null;
  schoolId: string | null;
  responsibility: string;
  email: string;
  phone: string;
  avatarUrl: string;
  availabilityLabel: string;
}
