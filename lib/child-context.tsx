import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { getMyChild } from "./children";
import type { Child } from "@/types/child";

type ChildContextValue = {
  child: Child | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const ChildContext = createContext<ChildContextValue | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!session) {
      setChild(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const next = await getMyChild();
      setChild(next);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  const value = useMemo<ChildContextValue>(
    () => ({ child, loading, refresh }),
    [child, loading, refresh],
  );

  return (
    <ChildContext.Provider value={value}>{children}</ChildContext.Provider>
  );
}

export function useChild(): ChildContextValue {
  const ctx = useContext(ChildContext);
  if (!ctx) throw new Error("useChild must be used within a ChildProvider");
  return ctx;
}
