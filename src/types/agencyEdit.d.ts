export interface AgencyEditData {
    id: number;
    name: string;
    description: string;
    url: string;
    duration: number;
    advisor: AdvisorInterface[];
    locations: Array<{ type: string }>;
    status?: string | undefined;
}

interface AdvisorInterface {
    name: string;
    id: string;
}

export interface ConsultantInterface {
    consultantId: string;
    consultantName: string;
}

export interface AgencyEventTypes {
    id: number;
    title: string;
    slug: string;
    length: number;
    hidden: boolean;
    position: number;
    userId?: string | number;
    teamId: number;
    eventName: string;
    timeZone?: string;
    periodType: string;
    periodStartDate?: string;
    periodEndDate?: string;
    periodDays?: number;
    periodCountCalendarDays?: boolean;
    requiresConfirmation: boolean;
    recurringEvent?: Record<string, unknown>;
    disableGuests: boolean;
    hideCalendarNotes: boolean;
    minimumBookingNotice: number;
    beforeEventBuffer: number;
    afterEventBuffer: number;
    schedulingType: string;
    price: number;
    currency: string;
    slotInterval?: number;
    successRedirectUrl: string;
    description: string;
    locations: Array<{ type: string }>;
    metadata: string;
    type?: string;
    consultantIds?: string[];
    consultants?: ConsultantInterface[];
    isDefaultEvent?: boolean;
}

export interface AgencyEventTypeUpdate {
    title?: string;
    slug?: string;
    length?: number;
    minimumBookingNotice?: number;
    beforeEventBuffer?: number;
    afterEventBuffer?: number;
    description?: string;
    consultants: { consultantId: string }[];
}
