import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const STATUS_URL = 'https://api.apiaberta.pt/v1/status';
const POLL_INTERVAL = 30; // seconds

export function useStatus() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(POLL_INTERVAL);
  const [lastFetched, setLastFetched] = useState(null);

  const countdownRef = useRef(POLL_INTERVAL);
  const timerRef = useRef(null);
  const pollRef = useRef(null);

  const fetch = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const res = await axios.get(STATUS_URL, { timeout: 10000 });
      setData(res.data);
      setError(null);
      setLastFetched(new Date());
    } catch (err) {
      setError(err?.message || 'Unable to reach API');
      // Keep old data if we had any
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Countdown ticker
  const startCountdown = useCallback(() => {
    countdownRef.current = POLL_INTERVAL;
    setCountdown(POLL_INTERVAL);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      countdownRef.current -= 1;
      setCountdown(countdownRef.current);
      if (countdownRef.current <= 0) {
        countdownRef.current = POLL_INTERVAL;
        setCountdown(POLL_INTERVAL);
      }
    }, 1000);
  }, []);

  // Polling loop
  useEffect(() => {
    fetch(true);
    startCountdown();

    pollRef.current = setInterval(() => {
      fetch(false);
      startCountdown();
    }, POLL_INTERVAL * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetch, startCountdown]);

  return { data, error, loading, refreshing, countdown, lastFetched };
}
