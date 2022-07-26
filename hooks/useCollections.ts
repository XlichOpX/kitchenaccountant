import { useUser } from "@supabase/auth-helpers-react";
import { useCallback } from "react";
import {
  createCollection,
  CreateCollectionOptions,
  getCollections,
} from "services/collections";
import useSWR, { useSWRConfig } from "swr";

const useCollections = () => {
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const { data: collections = [], error } = useSWR(user && "collections", () =>
    getCollections()
  );

  const addCollection = useCallback(
    async (collection: CreateCollectionOptions) => {
      if (!user) return;

      try {
        await createCollection({ ...collection, user_id: user.id });
        mutate("collections");
      } catch (error) {
        throw error;
      }
    },
    [mutate, user]
  );

  return {
    collections,
    addCollection,
    error,
    isLoading: collections.length === 0 && !error,
  };
};

export default useCollections;
