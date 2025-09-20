import Group from "ol/layer/Group";

import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
export const baseMaps = new Group({
  title: "نقشه پایه",
  layers: [
    new TileLayer({
      source: new OSM(),
      title: "osm",
      // image: "api/v1/images/1e323334197641afa92210e23c529ed4.png",
      image: "QR/map/osm.png",
    }),
  ],
});
