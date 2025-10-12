import { useEffect, useState } from 'react';
import DeviceClusterMap from './DeviceClusterMap';

interface ModalMapProps {
    isOpen: boolean;
    key?: string | number;
}

export default function ModalMap({ isOpen, key }: ModalMapProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure modal is fully rendered
            const timer = setTimeout(() => {
                setMounted(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setMounted(false);
        }
    }, [isOpen]);

    if (!isOpen || !mounted) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500">Loading map...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <DeviceClusterMap key={key} />
        </div>
    );
}
