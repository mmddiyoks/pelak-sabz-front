"use client";
import { useEffect } from "react";
import { userStore } from "@/context/userStore";
import { requestHandler } from "@/lib/axios/requestHandler";
import { Axios } from "@/lib/axios/axios";
import { UserStore } from "@/models/User";
import { Logger } from "@/lib/logger";
import { hasLogin } from "@/lib/auth";

const logger = Logger.get("AuthCheckHoc");

export function AuthChecker({ children }: { children: React.ReactNode }) {
    const { setILoading, setUser, user } = userStore();

    useEffect(() => {
        const fetchUser = async () => {
            setILoading(true);
            try {
                const data = await requestHandler<undefined, UserStore>(() =>
                    Axios.get("/Account/getcurrentuser")
                )();

                if (data.code === "success") {
                    setUser(data.data);
                }
            } catch (error) {
                logger.error("Error fetching user data:", error);
            } finally {
                setILoading(false);
            }
        };
        if (!hasLogin(user)) {
            fetchUser();
        }
    }, [user]);

    return children


}

