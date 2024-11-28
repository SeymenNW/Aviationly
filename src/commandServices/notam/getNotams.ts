import type { Notam, NotamList } from "../../types/Notam";


export async function getNotamsByIcao(icaoValue:string):Promise<NotamList> {
    const response = await fetch("https://notams.aim.faa.gov/notamSearch/search", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'searchType=0' +
  `&designatorsForLocation=${icaoValue}` +
  '&designatorForAccountable=' +
  '&latDegrees=' +
  '&latMinutes=0' +
  '&latSeconds=0' +
  '&longDegrees=' +
  '&longMinutes=0' +
  '&longSeconds=0' +
  '&radius=10' +
  '&sortColumns=5+false' +
  '&sortDirection=true' +
  '&designatorForNotamNumberSearch=' +
  '&notamNumber=' +
  '&radiusSearchOnDesignator=false' +
  '&radiusSearchDesignator=' +
  '&latitudeDirection=N' +
  '&longitudeDirection=W' +
  '&freeFormText=' +
  '&flightPathText=' +
  '&flightPathDivertAirfields=' +
  '&flightPathBuffer=4' +
  '&flightPathIncludeNavaids=true' +
  '&flightPathIncludeArtcc=false' +
  '&flightPathIncludeTfr=true' +
  '&flightPathIncludeRegulatory=false' +
  '&flightPathResultsType=All+NOTAMs' +
  '&archiveDate=' +
  '&archiveDesignator=' +
  '&offset=0' +
  '&notamsOnly=false' +
  '&filters=' +
  '&minRunwayLength=' +
  '&minRunwayWidth=' +
  '&runwaySurfaceTypes=' +
  '&predefinedAbraka=' +
  '&predefinedDabra=' +
  '&flightPathAddlBuffer=' +
  '&recaptchaToken='

    });

    const responseText = await response.text();
    const notams:NotamList = JSON.parse(responseText);

    return notams;
}