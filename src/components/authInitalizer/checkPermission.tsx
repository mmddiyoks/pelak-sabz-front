import { userStore } from '@/context/userStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, ComponentType } from 'react';

interface Permission {
    name: string;
}

interface User {
    permissions?: Permission[];
}

function hasPermission(user: User | null, permissionName: string): boolean {
    return user?.permissions?.some((item: Permission) => item.name === permissionName) ?? false;
}

const CheckPermissions = (WrappedComponent: ComponentType, requiredPermission: string) => {
    return function ProtectedComponent(props: Record<string, unknown>) {
        const router = useRouter();
        const { user } = userStore() // Assume the user is passed as a prop

        useEffect(() => {

            if (!hasPermission(user, requiredPermission)) {
                router.replace('/403'); // Redirect to 403 page
            }
        }, [user, router]);

        // Render the page only if the user has permission
        return hasPermission(user, requiredPermission) ? (
            <WrappedComponent {...props} />
        ) : null;
    };
};

export default CheckPermissions;