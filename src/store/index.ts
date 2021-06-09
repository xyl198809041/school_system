
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

// define your typings for the store state
export interface State {
  base_url: string
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export default createStore<State>({
  state: {
    base_url:'https://local.api.hzsgz.com/'
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
