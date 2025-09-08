"use client";
import { ComponentType, useEffect } from "react";
import { userStore } from "@/context/userStore";
import { usePathname, useRouter } from "next/navigation";
import { requestHandler } from "@/lib/axios/requestHandler";
import { Axios } from "@/lib/axios/axios";
import { UserStore } from "@/models/User";
import { toast } from 'sonner'
import { Logger } from "@/lib/logger";
import { hasLogin } from "@/lib/auth";
import { Loader2 } from "lucide-react";

const logger = Logger.get("AuthHoc");

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithAuthComponent(props: P) {
    const { setILoading, setUser, user, isLoading } = userStore();
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
      const fetchUser = async () => {
        // Skip if on login page
        if (pathName?.includes("login")) {
          return;
        }

        // If user already exists in store and has roles, no need to fetch
        if (hasLogin(user)) {
          return;
        }

        setILoading(true);
        try {
          const data = await requestHandler<undefined, UserStore>(() =>
            Axios.get("/Account/getcurrentuser")
          )();

          if (data.code === "success") {
            setUser(data.data);
          } else {
            toast.error("لطفا وارد شوید");
            router.push("/login");
          }
        } catch (error) {
          logger.error("Error fetching user data:", error);
          toast.error("خطا در دریافت اطلاعات کاربر");
          router.push("/login");
        } finally {
          setILoading(false);
        }
      };

      fetchUser();
    }, [router, pathName, user]);

    // Return component if user has roles or is on login page
    if (hasLogin(user) || pathName?.includes("login")) {
      return <WrappedComponent {...props} />;
    }

    if (isLoading) {
      return (
        <div className="w-full h-full  flex  justify-center items-center">
          <Loader2 className="h-4 w-4  animate-spin" />
        </div>
      )
    }
  };
}

