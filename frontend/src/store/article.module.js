import Vue from "vue";
import {
  ArticlesService,
  CommentsService,
  FavoriteService,
  PasswordsService
} from "@/common/api.service";
import {
  FETCH_ARTICLE,
  FETCH_COMMENTS,
  COMMENT_CREATE,
  COMMENT_DESTROY,
  FAVORITE_ADD,
  FAVORITE_REMOVE,
  ARTICLE_PUBLISH,
  ARTICLE_EDIT,
  ARTICLE_EDIT_ADD_TAG,
  ARTICLE_EDIT_REMOVE_TAG,
  ARTICLE_DELETE,
  ARTICLE_RESET_STATE,
  FETCH_PASSWORDS,
  PASSWORD_APPROVE,
  PASSWORD_CREATE,
  PASSWORD_DESTROY,
  PASSWORD_DISAPPROVE,
  PASSWORD_UNAPPROVE,
  PASSWORD_UNDISAPPROVE
} from "./actions.type";
import {
  RESET_STATE,
  SET_ARTICLE,
  SET_COMMENTS,
  SET_PASSWORDS,
  TAG_ADD,
  TAG_REMOVE,
  UPDATE_ARTICLE_IN_LIST
} from "./mutations.type";
// import { stat } from "fs";

const initialState = {
  article: {
    author: {},
    title: "",
    description: "",
    body: "",
    tagList: []
  },
  comments: [],
  passwords: []
};

export const state = { ...initialState };

export const actions = {
  async [FETCH_ARTICLE](context, articleSlug, prevArticle) {
    // avoid extronuous network call if article exists
    if (prevArticle !== undefined) {
      return context.commit(SET_ARTICLE, prevArticle);
    }
    const { data } = await ArticlesService.get(articleSlug);
    context.commit(SET_ARTICLE, data.article);
    return data;
  },
  async [FETCH_COMMENTS](context, articleSlug) {
    const { data } = await CommentsService.get(articleSlug);
    context.commit(SET_COMMENTS, data.comments);
    return data.comments;
  },
  async [COMMENT_CREATE](context, payload) {
    await CommentsService.post(payload.slug, payload.comment);
    context.dispatch(FETCH_COMMENTS, payload.slug);
  },
  async [COMMENT_DESTROY](context, payload) {
    await CommentsService.destroy(payload.slug, payload.commentId);
    context.dispatch(FETCH_COMMENTS, payload.slug);
  },
  async [FAVORITE_ADD](context, slug) {
    const { data } = await FavoriteService.add(slug);
    context.commit(UPDATE_ARTICLE_IN_LIST, data.article, { root: true });
    context.commit(SET_ARTICLE, data.article);
  },
  async [FAVORITE_REMOVE](context, slug) {
    const { data } = await FavoriteService.remove(slug);
    // Update list as well. This allows us to favorite an article in the Home view.
    context.commit(UPDATE_ARTICLE_IN_LIST, data.article, { root: true });
    context.commit(SET_ARTICLE, data.article);
  },
  [ARTICLE_PUBLISH]({ state }) {
    return ArticlesService.create(state.article);
  },
  [ARTICLE_DELETE](context, slug) {
    return ArticlesService.destroy(slug);
  },
  [ARTICLE_EDIT]({ state }) {
    return ArticlesService.update(state.article.slug, state.article);
  },
  [ARTICLE_EDIT_ADD_TAG](context, tag) {
    context.commit(TAG_ADD, tag);
  },
  [ARTICLE_EDIT_REMOVE_TAG](context, tag) {
    context.commit(TAG_REMOVE, tag);
  },
  [ARTICLE_RESET_STATE]({ commit }) {
    commit(RESET_STATE);
  },
  async [FETCH_PASSWORDS](context, articleSlug) {
    const { data } = await PasswordsService.get(articleSlug);
    context.commit(SET_PASSWORDS, data.passwords);
    return data.passwords;
  },
  async [PASSWORD_CREATE](context, payload) {
    await PasswordsService.post(payload.slug, payload.password);
    context.dispatch(FETCH_PASSWORDS, payload.slug);
  },
  async [PASSWORD_DESTROY](context, payload) {
    await PasswordsService.destroy(payload.slug, payload.passwordId);
    context.dispatch(FETCH_PASSWORDS, payload.slug);
  },
  async [PASSWORD_APPROVE](context, { slug, passwordId }) {
    const { data } = await PasswordsService.approve(slug, passwordId);
    context.commit(SET_ARTICLE, data.article);
  },
  async [PASSWORD_UNAPPROVE](context, { slug, passwordId }) {
    const { data } = await PasswordsService.unapprove(slug, passwordId);
    context.commit(SET_ARTICLE, data.article);
  },
  async [PASSWORD_DISAPPROVE](context, { slug, passwordId }) {
    const { data } = await PasswordsService.disapprove(slug, passwordId);
    context.commit(SET_ARTICLE, data.article);
  },
  async [PASSWORD_UNDISAPPROVE](context, { slug, passwordId }) {
    const { data } = await PasswordsService.undisapprove(slug, passwordId);
    context.commit(SET_ARTICLE, data.article);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_ARTICLE](state, article) {
    state.article = article;
  },
  [SET_COMMENTS](state, comments) {
    state.comments = comments;
  },
  [SET_PASSWORDS](state, passwords) {
    state.passwords = passwords;
  },
  [TAG_ADD](state, tag) {
    state.article.tagList = state.article.tagList.concat([tag]);
  },
  [TAG_REMOVE](state, tag) {
    state.article.tagList = state.article.tagList.filter(t => t !== tag);
  },
  [RESET_STATE]() {
    let f;
    for (f in state) {
      Vue.set(state, f, initialState[f]);
    }
  }
};

const getters = {
  article(state) {
    return state.article;
  },
  comments(state) {
    return state.comments;
  },
  passwords(state) {
    return state.passwords;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
