import Papa from "papaparse";
import type { AirportData } from "../../types/AirportData";
import type { CachedData } from "../../types/CachedData";


let cachedAirportData:CachedData | null = null;
const CACHE_EXPIRY = 10 * 60 * 60 * 1000; // updates every 10hrs btw


//In the future this will load to db and then delete and what not
setInterval(async () => {
    await getAirportsList();
},CACHE_EXPIRY);


async function getAirportsList(): Promise<AirportData[]> {

    if (cachedAirportData && (Date.now() - cachedAirportData.timestamp) < CACHE_EXPIRY) {
        console.log("USING CACHED DATA");
        
        return cachedAirportData.data;
    }

    const csvUrl = 'https://raw.githubusercontent.com/davidmegginson/ourairports-data/refs/heads/main/airports.csv';
    console.log(csvUrl);
    

 const response = await fetch(csvUrl);
 const csvData = await response.text();

 let airportData: AirportData[] = [];
 Papa.parse(csvData, {
     header: true,
     skipEmptyLines: true,
     complete: (result) => {
         airportData = result.data as AirportData[];
     }});


     console.log("CACHING NEW DATA!");
     
     cachedAirportData = {
        
        timestamp: Date.now(),
        data: airportData
    };

     return airportData;
}

export default getAirportsList;