

import { useEffect, useState } from "react";
import { getSlides, Slide } from "../lib/services/slide.service";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

export function useSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    async function fetchSlides() {
      setLoading(true);
      try {
        const data = await getSlides();
        setSlides(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch slides");
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, [isClient]);

  return { slides, loading, error };
}
