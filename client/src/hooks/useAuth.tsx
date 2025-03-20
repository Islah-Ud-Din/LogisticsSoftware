'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

const useAuth = () => {
    const { authToken } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!authToken) {
            router.push('/');
        }
    }, [authToken, router]);

    return authToken;
};

export default useAuth;
