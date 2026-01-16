import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

const useFetch = <T, Args extends unknown[] = unknown[]>(cb: (...args: Args) => Promise<ApiResponse<T>>) => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Store callback in ref to avoid recreating fn on every render
    const cbRef = useRef(cb);
    cbRef.current = cb;

    const fn = useCallback(async (...args: Args) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await cbRef.current(...args);
            if (response && response.success) {
                setData(response.data);
            } else {
                setError(response.message || "An error occurred");
                toast.error(response.message || "An error occurred");
            }
        } catch (error) {
            setError(error instanceof Error ? String(error.message) : "An error occurred");
            toast.error(error instanceof Error ? String(error.message) : "An error occurred");
        } finally {
            setLoading(false);
        }
        
    }, []);

    return { data, loading, error, fn, setData };
}

export default useFetch;