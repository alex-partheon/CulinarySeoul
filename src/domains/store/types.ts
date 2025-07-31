// TASK-003: 매장 도메인 타입 정의

export type StoreType = 'direct' | 'franchise' | 'partner';

export interface Store {
  id: string;
  brand_id: string;
  name: string;
  code: string;
  store_type: StoreType;
  address: StoreAddress;
  contact_info: StoreContactInfo;
  operating_hours: OperatingHours;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreRequest {
  brand_id: string;
  name?: string;
  code?: string;
  store_type?: StoreType;
  address?: StoreAddress;
  contact_info?: StoreContactInfo;
  operating_hours?: OperatingHours;
  is_active?: boolean;
}

export interface UpdateStoreRequest {
  name?: string;
  code?: string;
  store_type?: StoreType;
  address?: StoreAddress;
  contact_info?: StoreContactInfo;
  operating_hours?: OperatingHours;
  is_active?: boolean;
}

export interface StoreAddress {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  landmark?: string;
  building_info?: {
    floor?: string;
    unit?: string;
    building_name?: string;
  };
}

export interface StoreContactInfo {
  phone?: string;
  email?: string;
  fax?: string;
  manager?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  emergency_contact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
}

export interface OperatingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
  holidays?: HolidaySchedule[];
  timezone?: string;
}

export interface DaySchedule {
  is_open: boolean;
  open_time?: string; // HH:MM format
  close_time?: string; // HH:MM format
  break_time?: {
    start_time: string;
    end_time: string;
  };
  notes?: string;
}

export interface HolidaySchedule {
  date: string; // YYYY-MM-DD format
  name: string;
  is_open: boolean;
  special_hours?: {
    open_time?: string;
    close_time?: string;
  };
}

export type StoreCode = 'SeongSu' | string;