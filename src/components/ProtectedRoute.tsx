import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/authStore';

type ProtectedRouteProps = {
    children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = useAuthStore((s) => s.token);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}


