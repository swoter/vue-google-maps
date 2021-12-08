<template>
  <div class="p-absolute"></div>
</template>

<script>
export default {
  name: "VMarker",
  props: {
    position: {
      type: Object,
      required: true,
    },
    infoWindow: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      markerRef: null,
      infoWindowRef: null,
    };
  },
  watch: {
    position: {
      handler(coords) {
        console.log("coords:", coords);
        if (!coords) return;
        const { lat, lng } = coords;
        const latlng = new google.maps.LatLng(lat, lng);
        this.markerRef.setPosition(latlng);
      },
      deep: true,
    },
    infoWindow() {
      this.addInfoWindow();
    },
  },
  created() {
    const { position, options, $parent } = this;
    this.markerRef = new window.google.maps.Marker({
      ...options,
      position,
      map: $parent.map,
    });
    if (this.infoWindow) {
      this.addInfoWindow();
    } else {
      this.markerRef.addListener("click", () => this.$emit("click"));
    }
  },

  mounted() {
    console.log("this is marker");
  },
  methods: {
    addInfoWindow() {
      this.infoWindowRef = new window.google.maps.InfoWindow({
        content: this.infoWindow,
      });
      this.markerRef.addListener("click", () => {
        this.infoWindowRef.open(map, this.markerRef);
      });
    },
  },
  destroyed() {
    this.markerRef.setMap(null);
  },
};
</script>

<style lang="scss" scoped>
.p-absolute {
  position: absolute;
}
</style>
