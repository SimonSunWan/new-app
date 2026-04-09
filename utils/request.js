import config from "@/utils/env.js";
import { getToast } from "@/utils/toast.js";

const BASE_URL = config.API_BASE_URL;

class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "HttpError";
  }
}

const handleError = (error, showErrorMessage, reject) => {
  if (showErrorMessage) {
    let errorMessage = "请求失败";

    if (error instanceof HttpError) {
      errorMessage = error.message;
    }

    getToast()?.error(errorMessage);
  }

  reject(error instanceof HttpError ? error : new HttpError("网络错误", 500));
};

const request = (config) => {
  const {
    url,
    method = "GET",
    data,
    params,
    headers = {},
    showErrorMessage = true,
  } = config;

  let fullUrl = `${BASE_URL}${url}`;
  if (params) {
    const queryEntries = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null);

    if (queryEntries.length > 0) {
      const queryString = queryEntries
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
      fullUrl += `?${queryString}`;
    }
  }

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const token = uni.getStorageSync("accessToken");
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method: method.toUpperCase(),
      data: data,
      header: requestHeaders,
      success: (res) => {
        const { statusCode, data: responseData } = res;
        if (statusCode === 200) {
          resolve(responseData.data);
        } else {
          handleError(
            new HttpError(
              responseData?.message || "请求失败",
              responseData?.code || statusCode
            ),
            showErrorMessage,
            reject
          );
        }
      },
      fail: (err) => {
        handleError(new HttpError(err.errMsg || "网络错误", 500), showErrorMessage, reject);
      },
    });
  });
};

const api = {
  get(url, config = {}) {
    const { params, ...restConfig } = config;
    return request({ ...restConfig, url, method: "GET", params });
  },

  post(url, data, config = {}) {
    return request({ ...config, url, method: "POST", data });
  },

  put(url, data, config = {}) {
    return request({ ...config, url, method: "PUT", data });
  },

  delete(url, config = {}) {
    return request({ ...config, url, method: "DELETE" });
  },

  request(config) {
    return request(config);
  },
};

export { api, HttpError };
