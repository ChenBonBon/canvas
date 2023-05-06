import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { VITE_WS_PROTOCOL, VITE_WS_URL, VITE_HTTP_PROTOCOL, VITE_HTTP_URL } =
    env;

  return {
    server: {
      proxy: {
        "/api/smave/subscriptions": {
          target: `${VITE_WS_PROTOCOL}://${VITE_WS_URL}`,
          changeOrigin: true,
          ws: true,
        },
        "/api": `${VITE_HTTP_PROTOCOL}://${VITE_HTTP_URL}`,
      },
    },
    plugins: [react()],
  };
});
