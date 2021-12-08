<template>
  <div>
    <div style="min-height: 400px" :id="mapId">
      <div class="error-box" v-if="error">{{ error }}</div>
      <slot :map="map" v-if="showSlot && !error"></slot>
    </div>
  </div>
</template>

<script>
const mapEvents = [
  { event: "bounds_changed", emit: "bounds-changed" },
  { event: "center_changed", emit: "center-changed" },
  { event: "click", emit: "click" },
  { event: "dblclick", emit: "double-click" },
  { event: "drag", emit: "drag" },
  { event: "dragend", emit: "drag-end" },
  { event: "dragstart", emit: "drag-start" },
  { event: "heading_changed", emit: "heading-changed" },
  { event: "idle", emit: "idle" },
  { event: "maptypeid_changed", emit: "map-type-id-changed" },
  { event: "mousemove", emit: "mouse-move" },
  { event: "mouseout", emit: "mouse-out" },
  { event: "mouseover", emit: "mouse-over" },
  { event: "projection_changed", emit: "projection-changed" },
  { event: "resize", emit: "resize" },
  { event: "rightclick", emit: "right-click" },
  { event: "tilesloaded", emit: "tiles-loaded" },
  { event: "tilt_changed", emit: "tilt-changed" },
  { event: "zoom_changed", emit: "zoom-changed" },
];
import googleMaps from "../utils/googleMaps";
export default {
  name: "VMap",
  props: {
    apiOptions: {
      type: Object,
      default: () => ({}),
    },
    apiKey: {
      type: String,
      default: () => "",
    },
    mapId: {
      type: String,
      default: () => "map",
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Object,
      required: true,
    },
    zoom: {
      type: Number,
      default: () => 4,
    },
  },
  data() {
    return {
      map: null,
      showSlot: false,
      error: "",
      center: {},
    };
  },

  async created() {
    try {
      this.center = this.value;
      const apiOptions = {
        ...this.apiOptions,
        key: this.apiKey || this.apiOptions.key,
      };
      await googleMaps.load(apiOptions);
      this.initMap();
    } catch (e) {
      this.error = e.message;
    }
  },
  beforeMount() {
    let { lat, lng } = this.value;
    this.center = this.value;
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    if (isNaN(lat) && isNaN(lng)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          //locationSuccess If you get success
          (position) => {
            this.center = {
              lng: position.coords.longitude,
              lat: position.coords.latitude,
            };

            this.$emit("input", this.center);
          },
          //locationError  If the acquisition fails
          (error) => {
            const errorType = [
              "You refuse to share location information",
              "Can't get location information",
              "Get location information timed out",
            ];

            this.error = errorType[error.code - 1];
          }
        );
      } else {
        this.error =
          "Your device or browser does not support obtaining GPS coordinates";
      }
    }
  },
  methods: {
    initMap() {
      const { center, zoom } = this;
      this.map = new window.google.maps.Map(
        document.getElementById(this.mapId),
        {
          ...this.options,
          center,
          zoom,
        }
      );

      this.addListeners();
      this.getAddress();
      this.showSlot = true;
    },
    addListeners() {
      mapEvents.forEach((mappedEvent) => {
        this.map.addListener(mappedEvent.event, (event) => {
          this.$emit(mappedEvent.emit, { map: this.map, event });
        });
      });
    },
    getAddress() {
      if (!window.google) {
        console.error(
          `Get address error,could not find Google Maps Api service`
        );
        return;
      }

      let { lat, lng } = this.center;

      lat = parseFloat(lat);
      lng = parseFloat(lng);
      if (isNaN(lat) && isNaN(lng)) {
        console.error(
          `Get address error, longitude and latitude information is abnormal,latitude:${lat}, longitude:${lng}`
        );
        return;
      }

      const latlng = new window.google.maps.LatLng(lat, lng);
      let geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ latLng: latlng }, (results, status) => {
        if (results && status == window.google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            const address = results[1].formatted_address;
            console.log(`Location address: ${address}`);
            this.$emit("get-address", address);
          }
        } else {
          console.error(
            "Unable to obtain the address, it may be because Google cloud is not activated, please go to the console to check the cause of the error "
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.error-box {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: orangered;
  background-color: #fafafa;
}
</style>
