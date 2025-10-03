declare global {
  interface Window {
    env: Record<string, string>;
  }
}

export const getEnvVar = (key: string): string => {
  // In development, use import.meta.env
  if (import.meta.env.DEV) {
    return import.meta.env[key] || "";
  }

  // In production, use window.env
  return window.env?.[key] || "";
};

// Create specific getters for each env variable

export const getDockerBaseUrl = () => getEnvVar("VITE_DOCKER_BASE_URL");
export const getWebSocketUrl = () => getEnvVar("VITE_WEB_SOCKET_URL");
