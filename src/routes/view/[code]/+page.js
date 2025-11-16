import { makeRequest } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
  const code = params.code;

  const response = await makeRequest(`api/data/${code}`, "GET", fetch);

  if (!response?.data || response?.data.error) {
    throw error(404, "Not found");
  }
  return {
    data:response?.data,
    code
  };
}
