import React, { Suspense, useContext, useEffect, useState } from 'react'
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text, Icon } from "ol/style";
import { GeoJSON } from "ol/format";
import { FeatureInfoUrlCreator } from "@/lib/map/map";
import { Cluster, TileWMS } from "ol/source";
import TileLayer from "ol/layer/Tile";
import MapContext from './MapContext';
import { AddressObject, useCode } from '@/context/CodeContext';
import { useRouter, useSearchParams } from 'next/navigation';
import config from "@/data/config.json"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Select from 'ol/interaction/Select';
import { Extent, Interaction } from 'ol/interaction';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import getByNosaziCode from '@/actions/getByNosaziCode';
import { Loader2Icon, QrCodeIcon, SearchIcon } from 'lucide-react';
import getAddress from '@/actions/getAddressAction';
import services from "@/data/services.json"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import getLayerApi from '@/actions/getLayersAction';
import proj4 from 'proj4';
import getNearestByTypeAction from '@/actions/getNearestAction';
import { Logger } from "@/lib/logger/index";
import { requestHandler } from '@/lib/axios/requestHandler';
import { Axios } from '@/lib/axios/axios';

const LoadingToast = () => {
    useEffect(() => {
        const toastId = toast.loading("در حال بارگذاری اطلاعات...", {
            duration: Infinity,
        });

        return () => {
            toast.dismiss(toastId);
        };
    }, []);

    return null;
};

export default function QueryHandler() {
    //==========================  get store Infos   ==========================
    const logger = Logger.get("QueryHandler");
    const {
        map
    } = useContext(MapContext);
    const { isLoading, info, setInfo } = useCode()

    // ==========================  get params
    const searchParams = useSearchParams();
    const key = searchParams?.get("key")
    const selected = searchParams?.get("selected")
    const coordinates = searchParams?.get("coordinates")
    const nesrest = searchParams?.get("nearest")
    // =========================   state management  ==========================
    const router = useRouter()
    const [showPlaque, setShowPlaque] = useState(false)
    const [vectorLoading, setVectorLoading] = useState(false)
    const [selectedParcel, setSelectedParcel] = useState<any>(null)
    const [isSearchingPelak, setIsSearchingPelak] = useState(false)
    const [serchedPelak, setSerchedPelak] = useState<AddressObject[]>([])
    // ========================== effects map ====================================
    //  manage layer added
    useEffect(() => {
        if (!map) {
            return;
        }

        map.addLayer(temp);
        map.on("click", async (event: MapBrowserEvent<PointerEvent>) => {
            try {
                const source = temp.getSource();
                if (source) {
                    source?.clear();
                    // Remove any hover interactions
                    map.getInteractions().forEach((interaction: Interaction) => {
                        if (interaction instanceof Select) {
                            map.removeInteraction(interaction);
                        }
                    });
                }
                const clickedCoordinate = event.coordinate;
                router.push(
                    `?selected=parcel&&coordinates=${clickedCoordinate[0] + "," + clickedCoordinate[1]
                    }`
                );
            } catch (err) {
                toast.error("جستجو ناموفق");
                console.error("Error fetching parcel data:", err);
            }
        });
        return () => map.removeLayer(temp);
    }, [map])

    // ============================== manage  key params ==============================
    useEffect(() => {
        if (!map) {
            return
        }
        // if (!isLoading && info?.plate_id && key && info?.plate_id == +key) {

        if (!isLoading && info?.plate_id && key && info?.plate_id == +key) {
            setVectorLoading(true)
            FeatureInfoUrlCreator(
                layer,
                [info.x, info.y],
                map.getView().getResolution(),
                config.projection
            ).then(async (data) => {
                hansleRemoveTemp()
                const parcelFeatures = new GeoJSON().readFeatures(data);
                temp.getSource()?.clear();
                temp.getSource()?.addFeatures(parcelFeatures);
                const extent = parcelFeatures[0].getGeometry();
                // Add highlight effect
                const highlightStyle = new Style({
                    fill: new Fill({
                        color: "rgba(37, 50, 137, 0.4)",
                    }),
                    stroke: new Stroke({
                        color: "rgba(37, 50, 137, 1)",
                        width: 4,
                        lineDash: [5, 5],
                    }),
                });
                parcelFeatures[0].setStyle(highlightStyle);

                // Fit map with animation
                map.getView().fit(extent, {
                    padding: [50, 50, 50, 50],
                    duration: 1000,
                    maxZoom: 18,
                });

                // Add hover effect
                const hoverInteraction = new Select({
                    layers: [temp],
                    style: new Style({
                        fill: new Fill({
                            color: "rgba(37, 50, 137, 0.5)",
                        }),
                        stroke: new Stroke({
                            color: "rgba(37, 50, 137, 1)",
                            width: 2,
                        }),
                    }),
                });
                map.addInteraction(hoverInteraction);

                setShowPlaque(true);

                // Cleanup hover interaction when component unmounts
                return () => {
                    map.removeInteraction(hoverInteraction);
                };
            }).catch((error) => {
                toast.error("خطا در دریافت اطلاعات پلاک");
                console.error("Error fetching parcel data:", error);
            }).finally(() => {
                setVectorLoading(false)
            });
        }



    }, [isLoading, key, info, map])
    // ============================== manage  parcel   params ==============================
    useEffect(() => {
        if (!map) {
            return
        }
        if (selected && coordinates) {
            setVectorLoading(true)
            const [x, y] = coordinates.split(',').map(Number);
            FeatureInfoUrlCreator(
                layer,
                [x, y],
                map.getView().getResolution(),
                config.projection
            ).then(async (data) => {
                const parcelFeatures = new GeoJSON().readFeatures(data);
                const address = await getAddress([x, y])
                setSelectedParcel({ ...parcelFeatures[0].getProperties(), address: address || "نامشخص" });
                temp.getSource()?.clear();
                temp.getSource()?.addFeatures(parcelFeatures);
                const extent = parcelFeatures[0].getGeometry();
                map.getView().fit(extent, {
                    padding: [50, 50, 50, 50],
                    duration: 1000,
                    maxZoom: 18,
                });
            }).catch((error) => {
                logger.error("Error fetching parcel data:", error);
                if (x && y) {
                    // Fallback: move map to x, y and zoom in
                    map.getView().setCenter([x, y]);
                    map.getView().setZoom(18);
                }
            }).finally(() => {
                setVectorLoading(false)
            });
        }
    }, [selected, coordinates, map])

    // ========================== manage   nesreesh key  ============================
    useEffect(() => {
        if (!map || !info) {
            return
        }
        if (nesrest) {


            handleLayer(nesrest)
            //@ts-ignore


        }
    }, [nesrest, map, info])
    async function handleLayer(nesrest: string) {
        const req = await getLayerApi(nesrest);
        const data = JSON.parse(req.data);


        // Parse the GeoJSON features into OpenLayers features
        const geoJSON = new GeoJSON();
        const features = geoJSON.readFeatures(data, {
            featureProjection: map.getView().getProjection(), // Make sure features are correctly projected
        });

        // Create a Cluster source
        const source = new Cluster({
            distance: 40, // Distance (in pixels) for clustering
            //@ts-ignore
            source: new VectorSource({
                features: features, // Use the parsed OpenLayers features
            }),
        });

        const clusterStyle = new Style({
            image: new Icon({
                src: services.publicServices.find(item => item.id == nesrest)?.imageSrc, // Use the image from the buttons                width: 40,
                height: 30,
                anchor: [0.5, 0.5], // Center the icon
                width: 30,
            }),
            text: new Text({
                text: '', // Placeholder text
                font: '12px sans-serif',
                fill: new Fill({ color: '#000' }), // Text color
                stroke: new Stroke({ color: '#fff', width: 2 }), // Outline for better visibility
                offsetY: -45, // Position text above the icon
            }),
        });

        // Style function to dynamically update the text based on cluster size
        const styleFunction = (feature: any) => {
            const size = feature.get('features').length;
            const textStyle = clusterStyle.getText();

            if (textStyle) {
                textStyle.setText(size.toString()); // Update the cluster size as text
            }

            return clusterStyle;
        };

        // Create the vector layer with the cluster source and custom style
        const vectorLayer = new VectorLayer({
            //@ts-ignore
            title: String(nesrest),
            source: source,
            style: styleFunction, // Apply the cluster style
        });
        if (vectorLayer) {
            map.removeLayer(vectorLayer)
        }
        // Add the layer to the map
        map.addLayer(vectorLayer);
        const lable = `${services.publicServices.find(item => item.id == nesrest)?.name}`
        if (lable && info?.x && info.y) {

            const data = await getNearestByTypeAction(nesrest, [info.x, info.y]);

            const { lat, lon } = data[0];

            const transformedCoordinates = proj4('EPSG:32639', 'EPSG:4326', [lon, lat]);

            router.push(
                `?selected=parcel&&coordinates=${transformedCoordinates[0]},${transformedCoordinates[1]}`
            );
        }


    }

    // ============================search pelak==============================================
    const searchPelak = async (code: string) => {
        setIsSearchingPelak(true)

        getByNosaziCode(code).then((items) => {
            if (items && items.length >= 1) {
                temp.getSource()?.clear();
                try {
                    if (items.length >= 1) {
                        handelSerachPelakResualt(items)
                        // setSerchedPelak(deleteAdditinalsItemsInReq(items, "plate_id"))
                    } else {
                        toast.error("پلاکی یافت نشد");
                    }
                } catch (err) {
                    console.log(err)
                    setSerchedPelak([])
                } finally {
                    setIsSearchingPelak(false);
                }
            } else {
                toast.error("پلاکی یافت نشد");
                setIsSearchingPelak(false);
            }
        });



    };
    const handelSerachPelakResualt = async (items: AddressObject[]) => {
        try {
            const promises = items.map(async (item: AddressObject) => {
                const req = await requestHandler(() => Axios.get(`/AsnafPlate/plate/${item.plate_id}`))()
                if (req.code == "success") {
                    return { ...item, additionalData: req.data };

                } else {
                    return { ...item, additionalData: null };
                }
            });

            const results = await Promise.all(promises);
            setSerchedPelak(results);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    //   ============================================================================
    const handleClose = () => {
        setShowPlaque(false);
        hansleRemoveTemp()
    };
    const handleCloseParcel = () => {
        setSelectedParcel(null);
        hansleRemoveTemp()
    };
    const hansleRemoveTemp = () => {
        temp.getSource()?.clear();
        // Remove any hover interactions
        map.getInteractions().forEach((interaction: Interaction) => {
            if (interaction instanceof Select) {
                map.removeInteraction(interaction);
            }
        });
    }
    if ((key || selected) && vectorLoading) {
        return <LoadingToast />;
    }

    if (!isLoading && key && showPlaque && !vectorLoading) {
        return (
            <Suspense fallback={null}>
                <AnimatePresence mode="wait" >
                    <motion.div
                        key="info-plaque"
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            duration: 0.3
                        }}
                        className={cn(
                            "absolute sm:max-w-2xl  mx-auto overflow-visible border-1 border-white/80 z-10 bottom-[100px] p-4 h-fit inset-x-2",
                            "bg-primary-gradient shadow-sm px-5 pt-6 rounded-xl",
                            "flex-col justify-between transition-transform"
                        )}
                    >
                        {/* top button */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                delay: 0.2
                            }}
                        >
                            <Button
                                onClick={handleClose}
                                variant="outline"
                                className={cn(
                                    "rounded-full absolute -top-20 bg-white/80 shadow-md",
                                    "right-1 h-[45px] w-[45px] text-neutral-400 p-0"
                                )}
                            >
                                <Image
                                    src="/images/icons/Close.svg"
                                    alt="close"
                                    width={18}
                                    height={18}
                                />
                            </Button>
                        </motion.div>


                        {/* info */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="flex w-full  justify-between"
                        >

                            {/* <div className="flex flex-col gap-1 w-full justify-center  items-start">
                                <p className="text-[16px] text-white sm:text-base  font-medium block">
                                    کد: {info?.plate_no ? info.plate_no : "نامشخص"}
                                </p>
                                <div className="flex flex-row gap-3">
                                    <span className="text-sm font-medium text-white ">
                                        نوع:  {info?.poi_type ? eval(info?.poi_type).map((item: number, index: number) => {
                                            return (
                                                <span key={`info-poi-type-${index}-${info?.plate_id}`}>
                                                 
                                                    {poiData[item]}
                                                    {index < eval(info?.poi_type).length - 1 ? "، " : ""}
                                                </span>
                                            )
                                        }) : 'نامشخص'}
                                    </span>
                                </div>
                            </div> */}
                            {/* @ts-ignore */}
                            {info?.additionalData && info?.additionalData?.activityType && info?.additionalData?.kargahName ? (
                                <div className="flex flex-col gap-1 w-full justify-center  items-start ">
                                    <p className="text-[16px] text-white sm:text-base  font-medium block ">
                                        پلاک :{info?.plate_no ? info.plate_no : "نامشخص"}
                                    </p>
                                    <div className="flex flex-col gap-1 my-2">
                                        <p className="text-sm font-medium text-white ">
                                            {/* @ts-ignore */}
                                            نوع فعالیت:  {info?.additionalData?.activityType}
                                        </p>
                                        <p className="text-sm font-medium text-white ">
                                            {/* @ts-ignore */}
                                            نام:  {info?.additionalData?.kargahName}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1 w-full justify-center  items-start">
                                    <p className="text-[16px] text-white sm:text-base  font-medium block">
                                        کد: {info?.plate_no ? info.plate_no : "نامشخص"}
                                    </p>
                                    <div className="flex flex-row gap-3">
                                        <span className="text-sm font-medium text-white ">
                                            نوع:  {info?.poi_type && Array.isArray(eval(info?.poi_type)) ? eval(info?.poi_type).map((item: number, index: number) => {
                                                return (
                                                    <span key={`info-poi-type-${index}-${info?.plate_id}`}>
                                                        {/*@ts-ignore*/}
                                                        {poiData[item]}
                                                        {index < eval(info?.poi_type).length - 1 ? "، " : ""}
                                                    </span>
                                                )
                                            }) : 'نامشخص'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                    delay: 0.6
                                }}
                            >
                                <QrCodeIcon className='h-12 w-12 text-white' />
                            </motion.div>


                        </motion.div>
                        {/* @ts-ignore */}
                        {info?.address_te && (
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.3, delay: 0.7 }}
                                className="text-white font-normal text-sm"
                            >
                                آدرس: {info?.address_te}
                            </motion.p>
                        )}


                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                            className="flex flex-row mt-2 gap-4  sm:gap-4"
                        >
                            <Button
                                asChild
                                variant="outline"
                                className={cn(
                                    "w-[120px] h-9 text-sm font-medium",
                                    "text-white bg-transparent duration-200 z-20 "
                                )}
                            >
                                <Link
                                    href={`https://gnaf2.post.ir/pdf/postalcodes/plate/${info?.plate_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    نمایش کد پستی
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className={cn(
                                    "w-[108px] h-9 text-sm font-medium",
                                    "bg-white hover:bg-gray-50",
                                    "text-neutral-500 transition-colors duration-200",
                                    "border border-gray-200"
                                )}
                            >
                                <Link href={`/?key=${info?.plate_id}`}>
                                    خدمات پلاک
                                </Link>
                            </Button>

                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </Suspense>

        );
    }
    if (selected && !vectorLoading && selectedParcel) {
        return (
            <Suspense fallback={null}>
                <AnimatePresence mode="wait" >
                    <motion.div
                        key="selected-parcel"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}

                        transition={{
                            type: "spring",
                            stiffness: 100,
                            duration: 0.3
                        }}
                        className={cn(
                            "absolute bottom-[100px] inset-x-2 sm:max-w-2xl z-20  mx-auto bg-white text-neutral-600",
                            "shadow-md rounded-xl text-sm sm:text-base",
                            "flex flex-col p-5 gap-4"
                        )}
                    >
                        {/* Close Button */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                delay: 0.2
                            }}
                        >
                            <Button
                                onClick={handleCloseParcel}
                                variant="outline"
                                className={cn(
                                    "rounded-full absolute -top-6 right-2",
                                    "bg-white shadow-md h-[45px] w-[45px]",
                                    "text-neutral-400 p-0 cursor-pointer"
                                )}
                            >
                                <Image
                                    src="/images/icons/Close.svg"
                                    alt="close"
                                    width={18}
                                    height={18}
                                />
                            </Button>
                        </motion.div>

                        {/* Info Content */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-row gap-3">
                                <p className="text-[14px] text-neutral-600 sm:text-base font-normal">
                                    کد نوسازی:
                                </p>
                                <label className="text-neutral-600 sm:text-base text-[14px]">
                                    {selectedParcel.code}
                                </label>
                            </div>
                            <p className="text-[14px] sm:text-base">
                                آدرس: {selectedParcel.address}
                            </p>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                            className="flex flex-row gap-4"
                        >
                            <Button
                                onClick={() => searchPelak(selectedParcel.code)}
                                disabled={isSearchingPelak}
                                className={cn(
                                    "bg-primary w-[120px] h-9",
                                    "text-sm font-medium ",
                                    "flex items-center gap-2"
                                )}
                            >
                                {isSearchingPelak ?
                                    <Loader2Icon className='animate-spin' /> : <SearchIcon />
                                }

                                جستجو پلاک
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Plaque List Drawer using shadcn */}
                    <Drawer open={serchedPelak && serchedPelak.length > 0} onOpenChange={() => setSerchedPelak([])}>
                        <DrawerContent className='bg-white border-none' >
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader>
                                    <DrawerTitle className="text-center">لیست پلاک‌ها</DrawerTitle>
                                </DrawerHeader>
                                <div className="p-4">
                                    <div className="space-y-3 flex flex-col gap-4  max-h-[220px]  overflow-y-scroll ">
                                        {serchedPelak?.map((plaque, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={cn(
                                                    "p-4 rounded-lg  bg-primary-gradient  flex flex-row justify-between items-center text-white cursor-pointer",
                                                    "transition-colors duration-200"
                                                )}
                                                onClick={() => {

                                                    setInfo(plaque);
                                                    localStorage.setItem("plate_info", JSON.stringify(plaque));
                                                    router.push(
                                                        `?key=${plaque.plate_id}`
                                                    );


                                                }}
                                            >
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-lg font-bold">
                                                        پلاک: {plaque.plate_no || 'نامشخص'}
                                                    </p>
                                                    {/* @ts-ignore */}
                                                    {plaque?.additionalData && plaque?.additionalData?.activityType && plaque?.additionalData?.kargahName ? (
                                                        <div className="flex flex-col gap-1 w-full justify-center  items-start mb-3">

                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-sm font-medium text-white ">
                                                                    {/* @ts-ignore */}
                                                                    نوع فعالیت:  {plaque?.additionalData?.activityType}
                                                                </p>
                                                                <p className="text-sm font-medium text-white ">
                                                                    {/* @ts-ignore */}
                                                                    نام:  {plaque?.additionalData?.kargahName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-1 w-full justify-center  items-start">
                                                            <div className="flex flex-row gap-3">
                                                                <span className="text-sm font-medium text-white ">
                                                                    نوع:  {info?.poi_type && Array.isArray(eval(info?.poi_type)) ? eval(info?.poi_type).map((item: number, index: number) => {
                                                                        return (
                                                                            <span key={`info-poi-type-${index}-${info?.plate_id}`}>
                                                                                {/*@ts-ignore*/}
                                                                                {poiData[item]}
                                                                                {index < eval(info?.poi_type).length - 1 ? "، " : ""}
                                                                            </span>
                                                                        )
                                                                    }) : 'نامشخص'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                                <QrCodeIcon className='w-10 h-10' />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <DrawerFooter>
                                    <DrawerClose asChild>
                                        <Button variant="default" className="w-full">بستن</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </AnimatePresence>
            </Suspense>
        );
    }
    return null;
}

//  map layer
const layer = new TileLayer({
    minZoom: 15,
    source: new TileWMS({
        url: "https://name.isfahan.ir/saeeserver/wms",
        params: { LAYERS: "monam:parcel" },
        serverType: "geoserver",
        projection: config.projection
    }),
});

const temp = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
        fill: new Fill({
            color: "rgba(37, 50, 137, 0.3)", // Semi-transparent primary color
        }),
        stroke: new Stroke({
            color: "rgba(37, 50, 137, 0.8)", // Solid primary color for border
            width: 3,
            lineDash: [5, 5], // Dashed line for better visibility
        }),
    }),
    zIndex: 1000, // Ensure it's above other layers
});


// export const buttons = [
//     {
//         id: 21,
//         label: 'پمپ بنزین',
//         icon: "/images/publicServices/gas-station.svg",
//         color: 'text-rose-500',
//         borderColor: 'border-rose-500',
//         image: 'https://tourismapp.isfahan.ir/assets/images/map/gas.png'
//     },
//     {
//         id: 28,
//         label: 'مساجد',
//         icon: "/images/publicServices/FaMosque.svg",
//         color: 'text-emerald-500',
//         borderColor: 'border-emerald-500',
//         image: "https://tourismapp.isfahan.ir/assets/images/map/masque.png"
//     },
//     {
//         id: 29,
//         label: 'پارکینگ',
//         icon: "/images/publicServices/parking.svg",
//         color: 'text-blue',
//         borderColor: 'border-blue',
//         image: "https://tourismapp.isfahan.ir/assets/images/map/parking.png"
//     },
//     {
//         id: 51,
//         label: 'دستشویی',
//         icon: "/images/publicServices/wc.svg",
//         color: 'text-rose-600',
//         borderColor: 'border-rose-600',
//         image: "https://tourismapp.isfahan.ir/assets/images/map/wc.png"
//     },
//     {
//         id: 40,
//         label: 'پایانه',
//         icon: "/images/publicServices/bus.svg",
//         color: 'text-amber',
//         borderColor: 'border-amber',
//         image: "https://tourismapp.isfahan.ir/assets/images/map/parking.png"
//     },
//     {
//         id: 18,
//         label: 'درمانگاه',
//         icon: "/images/publicServices/hospital.svg",
//         color: 'text-rose-700',
//         borderColor: 'border-rose-700',
//         image: "https://tourismapp.isfahan.ir/images/publicServices/darokhane.svg"
//     },
// ];