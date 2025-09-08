'use client';

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import useModalStore from "../../context/ModalStore";
import Image from "next/image";


const Modal: React.FC = () => {
    //@ts-ignore
    const { isOpen, title, body, closeModal } = useModalStore();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="justify-center 
          items-center 
          flex 
          overflow-hidden
          fixed 
          inset-0 
          z-50
          outline-none 
          focus:outline-none
          bg-neutral-800/70
         "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className=" 
                            flex 
                            flex-col
                            w-[95%]  
                            md:w-4/6
                            lg:w-3/6
                            xl:w-2/5 bg-white rounded-xl shadow-lg my-6
                            mx-auto 
                            h-[98%]
                            md:max-h-full
                            lg:h-auto
                            md:h-auto
                            "
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between p-4 border-b-rose-500">
                            <div className="flex items-center">
                                <h2 className={cn("text-xl font-semibold")}>{title}</h2>
                            </div>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                                <Image src="/images/icons/Close.svg" alt="close" width={18} height={18} />
                            </button>
                        </div>
                        <div className="p-4 h-full max-h-[95vh] sm:max-h-[85vh] overflow-y-auto ">{body}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
