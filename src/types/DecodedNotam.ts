export type DecodedNotam = {
    header: {
        id: string;
        series: string;
        number: string;
        year: string;
        type: string;
        typeDesc: string;
    };
    qualification: {
        line: string;
        location: string;
        code: {
            code: string;
            entity: string;
            status: string;
            area: string;
            subArea: string;
            subject: string;
            condition: string;
            modifier: string;
        };
        traffic: {
            code: string;
            description: string;
        }[];
        purpose: {
            code: string;
            description: string;
        }[];
        scope: {
            code: string;
            description: string;
        }[];
        coordinates: {
            lat: number;
            lng: number;
            radius: number;
        };
        limits: {
            lower: string;
            upper: string;
        };
    };
    schedule: {
        activityStart: string; // ISO 8601 date string
        validityEnd: string;   // ISO 8601 date string
        elements: string[];
    };
    content: {
        text: string;
    };
    limits: {
        lower: string;
        upper: string;
    };
};
