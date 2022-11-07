import { reactive } from 'vue';

export const useRequest = (address) => {
  const metadata = reactive({
    text: null,
    json: null,
    status: null,
    success: null,
    loading: null,
  });

  let controller = null;

  const send = async (options = {}) => {
    if (controller) controller.abort();
    controller = new AbortController();
    const {signal} = controller;

    const {type: method = "GET", query = {}, data = {}} = options;
    const body = (/GET/i).test(method) ? null : JSON.stringify(data);

    let response = null;
    let text = null;

    try {
      metadata.loading = true;
      response = await fetch(`${address}?${new URLSearchParams(query)}`, {method, body, signal, cache: "no-cache"});
      text = await response.text();
    }
    catch(error) {}
    metadata.loading = false;

    metadata.text = text || null;
    metadata.json = text ? JSON.parse(text) : null;
    metadata.status = response?.status || null;
    metadata.success = response?.ok || false;

    return metadata;
  }

  return { metadata, send }
}
