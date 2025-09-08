"use client";
import React, { useRef, useState, useEffect } from "react";
// import "./Map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import "ol/ol.css";
import { baseMaps } from "./BaseMaps";
import { cn } from "@/lib/utils";
import config from "@/data/config.json";

const Map = ({ children, zoom = 18, center, className }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedParcel, setSelectedParcel] = useState(null); // Initial value can be empty string
  const [codeInfo, setCodeInfo] = useState(null);

  // Function to update selectedParcel
  const handleParcelSelect = (newControll) => {
    setSelectedParcel(newControll);
  };
  const handleCodeSelect = (newControll) => {
    setCodeInfo(newControll);
  };
  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({
        zoom: zoom,
        center: mapCenter,
        extent: config.extend,
        projection: config.projection,
      }),
      layers: [baseMaps],
      controls: [],
      overlays: [],
    };

    let mapObject = new ol.Map(options);

    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, []);

  // zoom change handler
  useEffect(() => {
    if (!map) return;

    map.getView().setZoom(zoom);
  }, [zoom]);

  // center change handler
  useEffect(() => {
    if (!map) return;
    map.on("moveend", () => {
      setMapCenter(map.getView().getCenter());
    });
  }, [mapCenter]);

  return (
    <MapContext.Provider
      value={{
        map,
        handleParcelSelect,
        selectedParcel,
        handleCodeSelect,
        codeInfo,
      }}
    >
      <div ref={mapRef} className={cn("inset-0 reletive  ", className)}>
        {children}
      </div>
    </MapContext.Provider>
  );
};

export default Map;
