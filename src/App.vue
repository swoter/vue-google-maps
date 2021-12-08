<template>
  <div id="app">
    <v-map
      ref="map"
      class="google-map"
      v-model="center"
      :zoom="18"
      @get-address="getAddress"
    >
      <template slot="">
        <v-marker :position="center" :info-window="address"></v-marker>
      </template>
    </v-map>
  </div>
</template>

<script>
import Vue from "vue";
import GoogleMaps from "./components/GoogleMaps";
Vue.use(GoogleMaps, {
  apiKey: "AIzaSyBRdVHMyM1ztP6gaioASSWa1lRjfLHLrgQ",
  version: "2.8",
  libraries: ["visualization"],
});
export default {
  name: "App",
  data() {
    return {
      center: { lat: -23.4070511, lng: -51.9428867 },
      address: "",
    };
  },
  computed: {},
  mounted() {},
  methods: {
    infoWindow() {
      return (
        "" +
        "<h1>Location Address</h1>" +
        `<p class='paragraph'>${this.address}</p>`
      );
    },
    getAddress(res) {
      this.address = res;
      console.log("getAddress res:", res);
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.google-map {
  width: 100%;
  min-height: 500px;
}
</style>
