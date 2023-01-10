export interface SimpleTenant {
    id: number;
    name: string;
    subdomain: string;
    adminEmails: string[];
    licensing: {
        allowedNumberOfUsers: number;
    };
}
