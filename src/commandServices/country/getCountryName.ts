import Papa from "papaparse";
import type { Country } from "../../types/Country";
import type { CachedData } from "../../types/CachedData";

let cachedCountryData: CachedData | null = null;
const CACHE_EXPIRY = 10 * 60 * 60 * 1000; // Updates every 10 hours

// Periodically update the cache
setInterval(async () => {
  await getCountryNames();
}, CACHE_EXPIRY);

export async function getCountryNames(): Promise<Country[]> {
  if (cachedCountryData && (Date.now() - cachedCountryData.timestamp) < CACHE_EXPIRY) {
    console.log("USING CACHED DATA");
    return cachedCountryData.data as Country[];
  }

  const csvUrl = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/refs/heads/main/countries.csv";
  console.log("FETCHING NEW DATA:", csvUrl);

  const response = await fetch(csvUrl);
  const csvData = await response.text();

  let countryData: Country[] = [];
  Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      countryData = result.data as Country[];
    },
  });

  console.log("CACHING NEW DATA!");
  cachedCountryData = {
    timestamp: Date.now(),
    data: countryData,
  };

  return countryData;
}

async function getCountry(countryCode:string): Promise<Country>{


    const countryList:Country[] = await getCountryNames();


    const matchingCountry = countryList.find(cc => cc.code == countryCode);

   //@ts-ignore
return matchingCountry;



}


export default getCountry;
