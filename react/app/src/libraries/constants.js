const LOCAL_URL = "http://localhost:80";
const API_URL = "https://backend.boxingboyz.com";

const PRODUCTION = true;

const SERVER_URL = PRODUCTION ? API_URL : LOCAL_URL;

export const ADDWALLET_URL = SERVER_URL + "/add-wallet-safe";
export const TEST_URL = SERVER_URL + "/test";
