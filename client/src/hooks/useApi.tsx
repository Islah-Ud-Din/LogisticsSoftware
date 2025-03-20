import useSWR from 'swr';
import axios from '@/lib/axios';

export const useApi = () => {
    const fetcher = async (url: string) => {
        const response = await axios.get(url);
        return response.data;
    };

    const useGetRequest = (url: string) => {
        const { data, error, isLoading } = useSWR(url, fetcher);
        return { data, error, isLoading };
    };

    const postRequest = async (url: string, data: unknown) => {
        const response = await axios.post(url, data);
        return response.data;
    };

    return {
        useGetRequest,
        postRequest,
    };
};
