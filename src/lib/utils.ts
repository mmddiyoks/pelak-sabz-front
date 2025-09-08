import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import proj4 from "proj4";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const utmConvertor = (x: string, y: string, formatTochange: string) => {
  let point = {};

  const utmZone = 39;
  const isNorthernHemisphere = true; // Set to true for northern hemisphere, false for southern hemisphere
  // Define the UTM coordinates (easting, northing)
  const easting = +x; // Example easting value
  const northing = +y; // Example northing value
  // Define the UTM projection string
  const utmProjString =
    "+proj=utm +zone=" +
    utmZone +
    (isNorthernHemisphere ? " +north" : " +south");
  // Define the WGS84 projection string
  const wgs84ProjString = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
  // Define the EPSG:900913 projection string (Web Mercator)

  // Perform the conversion using Proj4js
  const utmCoords = [easting, northing];
  const wgs84Coords = proj4(utmProjString, wgs84ProjString, utmCoords);
  // The wgs84Coords variable now contains the latitude and longitude in WGS84 datum

  const utm = { lat: wgs84Coords[1], lon: wgs84Coords[0] };
  if (formatTochange == "utm") {
    return utm;
  }

  if (formatTochange == "900913") {
    // First, define the necessary projections using Proj4js
    proj4.defs(
      "EPSG:4326",
      "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"
    );
    proj4.defs(
      "EPSG:900913",
      "+title=Web Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs"
    );

    // Convert from EPSG:4326 (WGS 84) to EPSG:900913 (Web Mercator)
    const webMercatorCoords = proj4("EPSG:4326", "EPSG:900913", [
      utm?.lon,
      utm?.lat,
    ]);

    point = [webMercatorCoords[0], webMercatorCoords[1]];
    return point;
  }
};
