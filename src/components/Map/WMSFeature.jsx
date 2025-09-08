"use client";
import { useContext, useEffect, useState } from "react";
import MapContext from "./MapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import { OPERATOR, getInfoByAttribute } from "@/lib/map/map";
import config from "@/data/config.json";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getByNosaziCode from "@/actions/getByNosaziCode";
const WMSFeature = ({ isFullScreen = false, pelakMap = false }) => {
  const {
    map,
    selectedParcel,
    handleCodeSelect,
    codeInfo,
  } = useContext(MapContext);
  const temp = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      fill: new Fill({
        color: "#253289",
      }),
      stroke: new Stroke({
        color: "black",
        width: 2,
      }),
    }),
  });

  useEffect(() => {
    try {
      if (key && !isLoading) {
        if (info.x && info.y) {
          console.log(info);
          // FeatureInfoUrlCreator(
          //   layer,
          //   [info.x, info.y],
          //   0.000029487837570437124,
          //   config.projection
          // ).then((data) => {
          //   const parcelFeatures = new GeoJSON().readFeatures(data);

          //   //@ts-ignore
          //   temp.getSource().addFeatures(parcelFeatures);

          //   // Get the extent of the clicked feature
          //   const extent = parcelFeatures[0].getGeometry();
          //   // Fit the map to the extent of the clicked feature
          //   map.getView().fit(extent, {
          //     padding: [50, 50, 50, 50],
          //     duration: 500,
          //   });
          // });
        }
      }
      // if (parcel) {
      //   //@ts-ignore
      //   const clickedCoordinate = coordinates;
      //   const currentView = map.getView();
      //   const currentResolution = currentView.getResolution();

      //   async function getData(clickedCoordinate) {
      //     let data = await FeatureInfoUrlCreator(
      //       layer,
      //       clickedCoordinate.split(","),
      //       currentResolution,
      //       config.projection
      //     ).then(async (data) => {
      //       const features = new GeoJSON().readFeatures(data);
      //       if (features.length > 0) {
      //         temp.getSource().addFeatures(features);
      //         const extent = features[0].getGeometry();
      //         map.getView().fit(extent, {
      //           padding: [50, 50, 50, 50],
      //           duration: 500,
      //         });
      //       }

      //       handleParcelSelect({
      //         ...features[0].getProperties(),
      //         address: address ? address : "",
      //       });
      //       return data;
      //     });
      //     return data;
      //   }
      //   getData(clickedCoordinate);
      // }
      // if (nosaziCode) {
      //   //@ts-ignore
      //   getByNosaziCode(nosaziCode).then((item) => {
      //     if (item && item.length >= 1) {
      //       FeatureInfoUrlCreator(
      //         layer,
      //         [item.x, item.y],
      //         0.000029487837570437124,
      //         config.projection
      //       ).then((data) => {
      //         const parcelFeatures = new GeoJSON().readFeatures(data);

      //         //@ts-ignore
      //         temp.getSource().addFeatures(parcelFeatures);

      //         // Get the extent of the clicked feature
      //         const extent = parcelFeatures[0].getGeometry();
      //         // Fit the map to the extent of the clicked feature
      //         map.getView().fit(extent, {
      //           padding: [50, 50, 50, 50],
      //           duration: 500,
      //         });
      //       });
      //     } else {
      //       toast.error("پلاکی یافت نشد");
      //     }
      //   });
      // }

      // if (!key || !nosaziCode || !parcel) {
      //   return;
      // }
    } catch (error) {
      toast.error("مشکلی پیش آمده !!!", error);
    }

    () => map.removeLayer(temp);
  }, [map, parcel, postalCode, nosaziCode, coordinates, isLoading]);
  useEffect(() => {}, [isLoading]);
  const [serchedPelak, setSerchedPelak] = useState();

  const searchPelak = (code) => {
    setIsSearchingPelak(true);
    getByNosaziCode(nosaziCode).then((item) => {
      if (item && item.length >= 1) {
        temp.getSource().clear();
        try {
          if (item[0]) {
            setSerchedPelak(item);
          } else {
            toast.error("پلاکی یافت نشد");
          }
        } catch (err) {
          handleCodeSelect(null);
        } finally {
          setIsSearchingPelak(false);
        }
      } else {
        toast.error("پلاکی یافت نشد");
        setIsSearchingPelak(false);
      }
    });

    try {
      getInfoByAttribute(
        config.baseOwsUrl,
        "points",
        "code_nosaz",
        OPERATOR.equal_to,
        code,
        "EPSG:4326",
        async (data) => {
          temp.getSource().clear();
          try {
            if (data[0]) {
              setSerchedPelak(data);
            } else {
              toast.error("پلاکی یافت نشد");
            }
          } catch (err) {
            handleCodeSelect(null);
          } finally {
            setIsSearchingPelak(false);
          }
        }
      );
    } catch (err) {
      toast.error("پلاکی یافت نشد");
      setIsSearchingPelak(false);
    }
  };

  let body = null;
  if (selectedParcel && parcel) {
    body = (
      <div
        className={`absolute  inset-x-0 bg-white text-neutral-600 shadow mx-3  rounded-md text-sm sm:text-medium flex flex-col p-5 gap-4 transition-transform ${
          !showParcel && "translate-y-72"
        } ${pelakMap ? "bottom-5" : "bottom-14"} `}
      >
        <div className="flex flex-row gap-3">
          <p className=" text-[14px] text-neutral-600 sm:text-base font-normal ">
            کد نوسازی :
          </p>
          <label className="text-neutral-600 sm:text-base  text-[14px]">
            {selectedParcel.code}
          </label>
        </div>
        <p className="sm:text-base  text-[14px]">
          آدرس :{selectedParcel.address}
        </p>
        <Button
          onClick={() => searchPelak(selectedParcel.code)}
          isLoading={false}
          className="bg-primary-500 w-[120px]  sm:text-base  text-[14px] h-fit z-20  text-white"
        >
          <Image
            src={"/images/icons/Search.svg"}
            alt="search"
            width={24}
            height={24}
          />
          جستجو پلاک
        </Button>
        <Button
          onClick={() => setShowParcel(false)}
          isLoading={false}
          className=" rounded-full bg-white absolute -top-6 left-2 shadow-md h-[45px] w-[45px] text-neutral-500  p-0"
        >
          <Image
            src={"/images/icons/Close.svg"}
            alt="search"
            className="h-[24px] w-[24px] text-center "
            width={24}
            height={24}
          />
          جستجو پلاک
        </Button>

        {/* {serchedPelak && (
          <PelaksModal
            data={serchedPelak}
            onEmpty={() => {
              toast.error("پلاکی پیدا نشد");
            }}
          />
        )} */}
      </div>
    );
  }
  if (isFullScreen && codeInfo && key) {
    body = (
      <div className="relative bottom-0 ">
        <Button
          onClick={() => setIsCodeInfo(false)}
          className={`rounded-full  absolute -top-[280px] bg-white  shadow-md  right-4  h-[45px] w-[45px] text-neutral-400 p-0 ${
            !isCodeInfo && "hidden"
          }`}
        >
          <Image
            src={"/images/icons/Close.svg"}
            alt="close"
            width={24}
            height={24}
          />
        </Button>
        <div
          className={`absolute -bottom-0 h-fit inset-x-0   bg-primary-500 shadow-sm  px-5 pt-6 rounded-xl  flex-col justify-between  pb-[75px]  transition-ransform  overflow-hidden  ${
            !isCodeInfo && "translate-y-96"
          } `}
        >
          <div className=" w-[500px] h-[500px] absolute   -right-[250px] sm:w-[800px]  sm:h-[800px]  sm:-right-[400px] lg:w-[2000px]  lg:h-[2000px]  lg:-right-[1000px] rounded-full bg-white/10 z-10 "></div>
          <div className="w-[300px] h-[300px]  absolute -right-[150px]  top-[100px]  sm:w-[600px]  sm:h-[600px] sm:-right-[300px] lg:w-[1800px]  lg:h-[1800px] lg:-right-[900px]    rounded-full bg-white/20 z-10"></div>

          <div className="flex w-full justify-between   ">
            <div className="flex flex-col justify-around items-start">
              <p className=" text-[16px] text-white sm:text-base font-medium block  ">
                کد: {codeInfo.plate_no ? codeInfo.plate_no : "نامشخص"}
              </p>
              <div className="flex flex-row gap-3">
                <p className=" text-[14px] text-white sm:text-base font-normal ">
                  کد نوسازی :
                </p>
                <label className="text-white">{codeInfo.code_nosaz}</label>
              </div>
            </div>

            <Image
              alt="logo-shahr-map"
              src={"/images/logo.png"}
              width={52}
              height={52}
              className="brightness-200 -translate-y-4"
            />
          </div>

          <p className="text-white font-normal text-sm">
            آدرس: {codeInfo.address}
          </p>
          <div className="flex flex-col justify-between  gap-2 mt-2">
            <div className="flex flex-row justify-between sm:justify-normal sm:gap-4 ">
              <Link
                href={`https://gnaf2.post.ir/pdf/postalcodes/plate/${codeInfo.plate_id}`}
                className=" w-[120px] text-white text-sm h-fit bg-secondary-500 z-20"
                text="نمایش کد پستی"
              />
              <Link
                href={`/?key=${codeInfo.plate_id}`}
                className="bg-white w-[108px] text-sm h-fit z-20  font-bold text-neutral-500 "
                text="خدمات پلاک"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return body;
};

export default WMSFeature;
