// hooks/useWeeklyPlans.js
import axios from 'axios';
import { useEffect, useState } from 'react';

const useWeeklyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/v1/meal/weekly-plan/upcoming');
        setPlans(res.data);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading };
};

export default useWeeklyPlans;
