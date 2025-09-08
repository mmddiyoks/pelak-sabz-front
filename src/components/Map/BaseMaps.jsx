import Group from "ol/layer/Group";
import { TileWMS } from "ol/source";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import config from "@/data/config.json";
export const baseMaps = new Group({
  title: "نقشه پایه",
  layers: [
    new TileLayer({
      source: new OSM(),
      title: "osm",
      // image: "api/v1/images/1e323334197641afa92210e23c529ed4.png",
      image: "QR/map/osm.png",
      visible: false,
    }),
    new TileLayer({
      title: "توریسم",
      visible: true,
      // image: "api/images/33966bf35f5d42428f2d27e3ae87a34f.png",
      image: "QR/map/turism.png",
      source: new TileWMS({
        url: "https://name.isfahan.ir/saeeserver/wms",
        projection: config.projection,
        params: {
          LAYERS: [
            "monam:parcel",
            "monam:roads",
            "monam:boostan",
            "monam:water",
            // "monam:region",
          ],
        },
      }),
    }),
  ],
});
