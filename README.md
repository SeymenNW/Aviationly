
<p  align="center">  <img  width="600"  src="https://i.imgur.com/X3w7Owk.png"/>  </p>

  
  

<h1  align="center">Aviationly</h1>  <p  align="center">Discord Bot that shows highly detailed Aviation & Airport Information. Written with Bun and TypeScript</p>

  
  

## What does it include?

-  **ICAO Code search**

-  **List of Airports**

-  **METAR Search**

-  **TAF Search (Coming soon)**

-  **NOTAM Search**

- And more is coming soon..

  

<br/>

To see a more detailed list of what it actually does, I refer to the commands list below.

  

## Commands

  

| Command         | Description                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------- |
| `/metar`        | Shows the latest METAR (Meteorological Terminal Aviation Routine Weather Report) for any airport in the world. |
| `/taf`          | Shows the latest TAF (Terminal Aerodrome Forecast) for any airport in the world. Although not implemented yet. |
| `/notam`        | Get the active and upcoming NOTAMs (Notice to Air Missions) for any airport.                      |
| `/notamdecoder` | Decode any NOTAM (Some NOTAM types are not compatible, but I'm working on it).                    |
| `/airport`      | Detailed information about airports all around the world.                                        |
| `/flight`       | Get the flight information for a real-life flight (Coming soon).                                 |
| `/bot`          | Provides information about the project, GitHub, and more.                                        |


  
  

More will be added gradually but this is the initial list of what will be available from v1.0. Some planned features are:
- [ ] NOTAM Change Tracker
- [ ] METAR Sync Updates
- [ ] Flight Information
- [ ] Upgraded decoder for NOTAMs
- [ ] FAA / ICAO options
- [ ] Open in Google/Bing/Yandex (whatever) Maps option. See exact location of NOTAMs, Airports and more.
- [ ] More details

Other than this there are a few stuff that needs to be changed in terms of project structure and maintainability. Which probably will be prioritized first.


## TypeScript & Bun
Aviationly is built with TypeScript & Bun. At the moment not everything has a type, interface or a class. But my plan is to incorporate these.
