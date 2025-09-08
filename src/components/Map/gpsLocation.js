"use client";
import { useContext } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { circular } from "ol/geom/Polygon";
import { fromLonLat } from "ol/proj";
import MapContext from "@/components/Map/MapContext";
import { LocateIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logger } from "@/lib/logger/index";
import { toast } from "sonner";

const GetDeviceLocation = () => {
  const { map } = useContext(MapContext);
  const logger = Logger.get("Map/gpsLocation");

  // Handler for location button
  const handleLocate = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported", {
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
      });
      logger.error("Geolocation not supported by this browser.");
      return;
    }
    try {
      // Check for permission using Permissions API
      if (navigator.permissions) {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        if (status.state === "denied") {
          toast({
            title: "Permission denied",
            description:
              "Location access is denied. Please enable it in your browser settings.",
          });
          logger.error("Geolocation permission denied.");
          return;
        }
      }
      // Request location (this will prompt if not granted)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!map) return;
          const coords = [pos.coords.longitude, pos.coords.latitude];
          const accuracy = circular(coords, pos.coords.accuracy);
          // Add the vector layer to the map
          const source = new VectorSource();
          const layer = new VectorLayer({ source });
          map.addLayer(layer);
          source.clear(true);
          source.addFeatures([
            new Feature(
              accuracy.transform("EPSG:4326", map.getView().getProjection())
            ),
            new Feature(new Point(fromLonLat(coords))),
          ]);
          map.getView().setCenter(fromLonLat(coords));
          map.getView().setZoom(15);
        },
        (error) => {
          toast({ title: "Location error", description: error.message });
          logger.error(`Geolocation error: ${error.message}`);
        },
        { enableHighAccuracy: true }
      );
    } catch (err) {
      toast({ title: "Error", description: "An unexpected error occurred." });
      logger.error(err);
    }
  };

  return (
    <Button
      variant={"outline"}
      id="locate-button"
      className="bg-white/80 border-1 border-neutral-300 text-gray-400 "
      onClick={handleLocate}
    >
      <LocateIcon className=" animate-spin" />
    </Button>
  );
};

export default GetDeviceLocation;
