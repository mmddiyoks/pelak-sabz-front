import proj4 from "proj4";

// Define EPSG:32639 projection
proj4.defs("EPSG:32639", "+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

export const convertTo32639 = (
  x: number,
  y: number
): { x: number; y: number } => {
  const result = proj4("EPSG:4326", "EPSG:32639", [x, y]);
  return {
    x: result[0],
    y: result[1],
  };
};

export const convertTo4326 = (
  x: number,
  y: number
): { x: number; y: number } => {
  const result = proj4("EPSG:32639", "EPSG:4326", [x, y]);
  return {
    x: result[0],
    y: result[1],
  };
};
