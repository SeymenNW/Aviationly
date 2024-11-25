import { integer, pgTable, text, varchar, real } from "drizzle-orm/pg-core";

// Define the "airport_data" table based on the AirportData type
export const airportsTable = pgTable('airports', {
  id: varchar('id', { length: 255 }).primaryKey(),         // Primary key, string with a max length of 255 characters
  ident: varchar('ident', { length: 50 }).notNull(),       // Identifier for the airport (e.g., ICAO code)
  type: varchar('type', { length: 50 }).notNull(),         // Type of airport (e.g., public, private)
  name: varchar('name', { length: 255 }).notNull(),       // Name of the airport
  latitude_deg: real('latitude_deg').notNull(),           // Latitude in degrees (real for single precision float)
  longitude_deg: real('longitude_deg').notNull(),         // Longitude in degrees (real for single precision float)
  elevation_ft: integer('elevation_ft').notNull(),         // Elevation in feet (integer)
  continent: varchar('continent', { length: 50 }).notNull(), // Continent code (e.g., 'NA' for North America)
  iso_country: varchar('iso_country', { length: 3 }).notNull(), // Country code (ISO 3166-1 alpha-3)
  iso_region: varchar('iso_region', { length: 5 }).notNull(),  // Region code (ISO 3166-2)
  municipality: varchar('municipality', { length: 100 }).notNull(), // Municipality (city/town)
  scheduled_service: varchar('scheduled_service', { length: 10 }).notNull(), // Scheduled service ('yes' or 'no')
  gps_code: varchar('gps_code', { length: 10 }),  // GPS code (nullable)
  iata_code: varchar('iata_code', { length: 10 }),  // IATA code (nullable)
  local_code: varchar('local_code', { length: 10 }), // Local code (nullable)
  home_link: varchar('home_link', { length: 255 }), // Home link URL (nullable)
  wikipedia_link: varchar('wikipedia_link', { length: 255 }), // Wikipedia link (nullable)
  keywords: text('keywords'),  // Keywords for the airport (nullable, stores long text)
});


       // const airportData: AirportData[] = cachedAirportData.data;

        // for (const airport of airportData) {
        //    await db.insert(airportsTable).values({
        //         id: airport.id,
        //         ident: airport.ident,
        //         type: airport.type,
        //         name: airport.name,
        //         latitude_deg: airport.latitude_deg,
        //         longitude_deg: airport.longitude_deg,
        //         elevation_ft: airport.elevation_ft,
        //         continent: airport.continent,
        //         iso_country: airport.iso_country,
        //         iso_region: airport.iso_region,
        //         municipality: airport.municipality,
        //         scheduled_service: airport.scheduled_service,
        //         gps_code: airport.gps_code,
        //         iata_code: airport.iata_code,
        //         local_code: airport.local_code,
        //         home_link: airport.home_link,
        //         wikipedia_link: airport.wikipedia_link,
        //         keywords: airport.keywords
        //     });
        // }