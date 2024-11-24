export type AirportData = {
    id: string;
    ident: string;
    type: string;
    name: string;
    latitude_deg: number;
    longitude_deg: number;
    elevation_ft: number;
    continent: string;
    iso_country: string;
    iso_region: string;
    municipality: string;
    scheduled_service: string;
    gps_code: string | null;
    iata_code: string | null;
    local_code: string | null;
    home_link: string | null;
    wikipedia_link: string | null;
    keywords: string | null;
};
