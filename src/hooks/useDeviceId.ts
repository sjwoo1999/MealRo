
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'mealro_device_id';

export function useDeviceId() {
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        // 클라이언트 사이드에서만 실행
        const storedDeviceId = localStorage.getItem(DEVICE_ID_KEY);

        if (storedDeviceId) {
            setDeviceId(storedDeviceId);
        } else {
            const newDeviceId = uuidv4();
            localStorage.setItem(DEVICE_ID_KEY, newDeviceId);
            setDeviceId(newDeviceId);
        }
    }, []);

    return deviceId;
}
