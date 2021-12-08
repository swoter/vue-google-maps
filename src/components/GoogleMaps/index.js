/*
 * @Descripttion: []
 * @Author: Iseven Monkey <iswoter@gmail.com>
 * @Date: 2021-12-08 08:59:19
 * @LastEditors: Iseven Monkey <iswoter@gmail.com>
 * @LastEditTime: 2021-12-08 10:04:20
 * @FilePath: /Volumes/workspace/swoter/im-google-map/src/components/GoogleMaps/index.js
 */
import VMap from "./components/VMap";
import VMarker from "./components/VMarker";

import googleMaps from "./utils/googleMaps";

export { VMap, VMarker };

export default {
  install(Vue, params = { apiKey: "", version: "", libraries: [] }) {
    googleMaps.load(params);
    Vue.component("v-map", VMap);
    Vue.component("v-marker", VMarker);
    Vue.prototype.$gMap = googleMaps;
  },
};
