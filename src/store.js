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
			console.log(u);
			state.user = u;
		},
		logoff (state) {
			state.user = null;
		}
	}
})