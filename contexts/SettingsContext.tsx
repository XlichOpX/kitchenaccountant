import { useUser } from "@supabase/auth-helpers-react";
import { message } from "antd";
import React, { ReactNode, useCallback } from "react";
import {
  getSettings,
  Settings,
  updateSettings as svUpdateSettings,
  UpdateSettingsOptions,
} from "services/settings";
import useSWR, { useSWRConfig } from "swr";

export const SettingsContext = React.createContext<
  | {
      settings: Settings | undefined;
      updateSettings: (settings: Settings) => Promise<void>;
    }
  | undefined
>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const { data: settings, error } = useSWR(user && "settings", getSettings);
  const { mutate } = useSWRConfig();

  const updateSettings = useCallback(
    async (settings: Settings) => {
      if (!user) return;
      try {
        await svUpdateSettings({ ...settings, user_id: user.id });
        mutate("settings");
      } catch (error) {
        throw error;
      }
    },
    [user, mutate]
  );

  if (error) {
    message.error("Ocurrió un error al obtener los ajustes");
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
