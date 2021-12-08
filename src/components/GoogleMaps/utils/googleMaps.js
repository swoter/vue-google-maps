/*
 * @Descripttion: []
 * @Author: Iseven Monkey <iswoter@gmail.com>
 * @Date: 2021-12-08 08:44:52
 * @LastEditors: Iseven Monkey <iswoter@gmail.com>
 * @LastEditTime: 2021-12-08 10:06:18
 * @FilePath: /Volumes/workspace/swoter/im-google-map/src/components/GoogleMaps/utils/googleMaps.js
 */

class GoogleMaps {
  promise = null;

  get loaded() {
    return window.google && window.google.maps;
  }

  asyncJs(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");

      script.type = "text/javascript";
      script.src = url;
      script.onload = () => {
        resolve();
        script.remove();
      };
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });
  }

  queryString(params) {
    return Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");
  }

  load(params) {
    if (params.apiKey) {
      console.warn("apiKey is deprecated! Please use key");
      params.key = params.apiKey;
    }
    if (!this.loaded && !this.promise) {
      this.promise = this.asyncJs(
        `https://maps.googleapis.com/maps/api/js?${this.queryString(params)}`
      );
    }
    return this.promise;
  }
}

export default new GoogleMaps();
