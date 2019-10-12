// Initialize API URL; the root path
// Note: Realworld example API URL is "https://conduit.productionready.io/api"
const PROD_API_URL = "http://sacafi.com/api",
  DEV_API_URL = "http://127.0.0.1:3000/api";
export const API_URL =
  process.env.NODE_ENV === "production" ? PROD_API_URL : DEV_API_URL;
export default API_URL;
