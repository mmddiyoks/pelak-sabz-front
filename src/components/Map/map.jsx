"use client";
import React, { useRef, useState, useEffect } from "react";
import MapContext from "./MapContext";
import * as ol from "ol";
import * as geom from "ol/geom";
import * as source from "ol/source";
import * as layer from "ol/layer";
import * as style from "ol/style";
import "ol/ol.css";
import { baseMaps } from "./BaseMaps";
import { cn } from "@/lib/utils";
import config from "@/data/config.json";
import { useTree } from "@/context/TreeContext";
import { convertTo4326 } from "@/lib/helper/coordinateConverter";
const Map = ({ zoom = 18, center, className }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedParcel, setSelectedParcel] = useState(null); // Initial value can be empty string
  const [codeInfo, setCodeInfo] = useState(null);
  const [treeLayer, setTreeLayer] = useState(null);
  const { tree } = useTree();

  // Function to update selectedParcel
  const handleParcelSelect = (newControll) => {
    setSelectedParcel(newControll);
  };
  const handleCodeSelect = (newControll) => {
    setCodeInfo(newControll);
  };

  // Function to create tree marker layer
  const createTreeLayer = (treeData) => {
    if (!treeData || !treeData.x || !treeData.y) return null;
    const convertedCoords = convertTo4326(treeData.x, treeData.y);
    // Create vector source for tree marker
    const vectorSource = new source.Vector();

    // Create point geometry from tree coordinates
    const treePoint = new geom.Point([convertedCoords.x, convertedCoords.y]);

    // Create feature for the tree
    const treeFeature = new ol.Feature({
      geometry: treePoint,
      type: "tree",
      treeData: treeData,
    });

    // Create white circle style for tree marker
    const treeStyle = new style.Style({
      image: new style.Circle({
        radius: 8,
        fill: new style.Fill({
          color: "green",
        }),
        stroke: new style.Stroke({
          color: "green",
          width: 3,
        }),
      }),
    });

    // Create buffer style (larger circle with low opacity)
    const bufferStyle = new style.Style({
      image: new style.Circle({
        radius: 20,
        fill: new style.Fill({
          color: "rgba(34, 197, 94, 0.2)", // Green with low opacity
        }),
        stroke: new style.Stroke({
          color: "rgba(34, 197, 94, 0.3)",
          width: 1,
        }),
      }),
    });

    // Apply styles to feature
    treeFeature.setStyle([bufferStyle, treeStyle]);

    // Add feature to source
    vectorSource.addFeature(treeFeature);

    // Create vector layer
    const vectorLayer = new layer.Vector({
      source: vectorSource,
      zIndex: 1000,
    });
    map.getView().fit(treeFeature.getGeometry().getExtent());
    return vectorLayer;
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

  // Tree layer management
  useEffect(() => {
    if (!map) return;

    // Remove existing tree layer if it exists
    if (treeLayer) {
      map.removeLayer(treeLayer);
    }

    // Create and add new tree layer if tree exists
    if (tree) {
      const newTreeLayer = createTreeLayer(tree);
      if (newTreeLayer) {
        map.addLayer(newTreeLayer);
        setTreeLayer(newTreeLayer);
      }
    } else {
      setTreeLayer(null);
    }

    // Cleanup function
    return () => {
      if (treeLayer) {
        map.removeLayer(treeLayer);
      }
    };
  }, [map, tree]);

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
      <div ref={mapRef} className={cn("inset-0 absolute  ", className)}></div>
    </MapContext.Provider>
  );
};

export default Map;
