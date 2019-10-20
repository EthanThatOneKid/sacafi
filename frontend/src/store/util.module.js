// import Vue from "vue";
import { OsmService } from "@/common/api.service";
import { FETCH_OSM } from "./actions.type";
import {} from "./mutations.type";

export const actions = {
  [FETCH_OSM](context, location) {
    return OsmService.get(location);
  }
};

export default {
  actions
};
