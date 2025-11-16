// place files you want to import through the `$lib` alias in this folder.
import axios from "axios";

import { PUBLIC_BACKEND_URL } from '$env/static/public';

export async function makeRequest(endpoint, method, data = {}, headers = {}) {
  try {
    
    let url = `${PUBLIC_BACKEND_URL}/${endpoint}`;
    
    const config = { method, headers };
    if (method !== "GET") {
      config.data = data;
    }
    const response = await axios(url,config);
    
    return response;
  } catch (err) {
    return err?.response
  }
}