import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null
	},
	getters: {
		isLogged: state => {
			return state.user !== null;
		}
	},

	mutations: {
		login (state, u) {
			console.log("Logging:", u);
			state.user = u;
		},
		logout (state) {
			state.user = null;
		},
		sub (state, sub) {
			state.user.subscriptions.push(sub);
		},
		unsub (state, u) {
			state.user.subscriptions.splice(state.user.subscriptions.indexOf(u), 1);
		}
	}
})