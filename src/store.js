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
		},

		isAllowedTo: (state, perm, sub, optionalID) => {
			return state.user !== null && (state.user.id == optionalID || state.user.permissions.indexOf(perm) >= 0 || (sub && state.user.subPermissions[sub] && state.user.sub_permissions[sub].permissions.indexOf(perm)));
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