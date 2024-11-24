<p align="center"> <img width="600" src="https://i.imgur.com/Bf0loOD.png"/> </p>


 <h1 align="center">Aviationly</h1> <p align="center">Discord Bot that shows highly detailed Aviation & Airport Information. Written with Bun and TypeScript</p>


## What does it include?
- **ICAO Code search**
- **List of Airports**
 - **METAR Search**
  - **TAF Search**
   - **NOTAM Search**
   - And more is coming soon..

     <br/>
To see a more detailed list of what it actually does, I refer to the commands list below.

## Commands

| Slash           | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `/metar`        | Shows the latest METAR (Meteorological Terminal Aviation Routine Weather Report) for any airport in the world. |
| `/taf`          | Shows the latest TAF (Terminal Aerodrome Forecast) for any airport in the world.                               |
| `/notam`        | Get the active and upcoming NOTAMs (Notice to Air Missions) for any airport                    |
| `/notamdecoder`      | Decode any Notam (Some Notam types are not compatible, but I'm working on it)                                                |
| `/icao`    | Shows detailed information about what the ICAO code is about. This can be for both Airports and FIRs (Flight Information Regions)         |
| `/flight`       | Get the flight information for a real life flight                                              |                                                               
| `/help`         | A small description of all commands in the application.                                                          |
| `/bot`         | Provides information about the project, GitHub and more.|


More will be added gradually but this is the initial list of what will be available from v1.0. 

## TypeScript & Bun
This project is built with TypeScript and Bun. From what I have seen online, it's not as common to use classes and interfaces in TypeScript, but coming from a C# background, I found it easier to implement it this way. I believe that using classes and interfaces enhances the project's structure and readability. However, this is a design choice I made, and it should be easy to adjust to align with your own coding standards.

Aviationly is built with TypeScript & Bun. As someone who has a C# background, it is much simpler for me to work with types, classes and interfaces when developing applications on the Node.js/Bun/Javascript platforms. At the moment not everything has a type, interface or a class. But my plan is to incorporate these. 

