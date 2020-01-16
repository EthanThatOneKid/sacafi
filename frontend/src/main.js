import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

// Clipboard Library Setup > [Reference](https://github.com/Inndy/vue-clipboard2#it-doesnt-work-with-bootstrap-modals)
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

// Notification Library Setup > [Reference](https://se-panfilov.github.io/vue-notifications/docs/html/getting-started.html)
import VueNotifications from "vue-notifications";
import miniToastr from "mini-toastr";
miniToastr.init({
  types: {
    success: "success",
    error: "error",
    info: "info",
    warn: "warn"
  }
});
const toast = ({ title, message, type, timeout, cb }) =>
  miniToastr[type](message, title, timeout, cb);
Vue.use(VueNotifications, {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
});

// Image Uploader Library Setup > [Reference](https://github.com/kartoteket/vue-image-upload-resize#usage)
import ImageUploader from "vue-image-upload-resize";
Vue.use(ImageUploader);

import { CHECK_AUTH } from "./store/actions.type";
import ApiService from "./common/api.service";
import DateFilter from "./common/date.filter";
import ErrorFilter from "./common/error.filter";

// Resolve Leaflet Issues > [Reference](https://vue-leaflet.github.io/Vue2Leaflet/#/quickstart?id=system-wide-components)
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.config.productionTip = false;
Vue.filter("date", DateFilter);
Vue.filter("error", ErrorFilter);

ApiService.init();

// Ensure we checked auth before each page load.
router.beforeEach((to, from, next) =>
  Promise.all([store.dispatch(CHECK_AUTH)]).then(next)
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
