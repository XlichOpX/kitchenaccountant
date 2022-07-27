import { useUser } from "@supabase/auth-helpers-react";
import { getMeasurementUnits } from "services/measurement_units";
import useSWR from "swr";

const useMeasurementUnits = () => {
  const { user } = useUser();

  const { data: measurementUnits = [], error } = useSWR(
    user && "measurement_units",
    () => getMeasurementUnits()
  );

  return {
    measurementUnits,
    error,
    isLoading: measurementUnits.length === 0 && !error,
  };
};

export default useMeasurementUnits;
