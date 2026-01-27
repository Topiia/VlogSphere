import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { vlogAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export const useVlogView = (vlogId) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !vlogId) return;

    // Check if already recorded in session
    const sessionKey = `view_recorded_${vlogId}`;
    if (sessionStorage.getItem(sessionKey)) return;

    // Record view (fire-and-forget, no refetch to prevent increment loop)
    vlogAPI
      .recordView(vlogId)
      .then(() => {
        sessionStorage.setItem(sessionKey, "true");
        // DO NOT invalidate queries here - prevents refetch that causes double increment
        // View count will update naturally when user navigates away and back
      })
      .catch((error) => {
        // Log errors silently - don't show error toasts for view tracking failures
        console.error("Failed to record view:", error);
      });
  }, [vlogId, isAuthenticated, queryClient]);
};
