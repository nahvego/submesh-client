import Vue from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import PostList from './views/PostList.vue'
import router from './router.js'
import store from './store.js'

import navbar from './views/components/NavBar.vue';
import AlertModal from './views/components/AlertModal.vue';
import LoginModal from './views/components/LoginModal.vue';

Vue.component('navbar', navbar);
Vue.component('app', App);
Vue.component('login-modal', LoginModal);
Vue.component('alert-modal', AlertModal);

Vue.filter('formatNumber', function(n) {
	return n;
});
Vue.filter('formatNumberShort', function(n) {
	return n;
});
Vue.filter('formatDate', function(n) {
	return n;
});
Vue.filter('formatDateShort', function(n) {
	return n;
});
Vue.filter('urlify', function(t) {
	return t;
});

const vm = new Vue({
  	router,
	store,
  	data: {
	  	interceptor: null
	},
	methods: {
		login: function(user, password) {
			let self = this;
			return new Promise(function(res, rej) {
				self.axios.post('/login', {
					user,
					password
				}).then(function(response) {
					let userObj = {
						name: response.data.name,
						id: response.data.userID,
						subscriptions: response.data.subscriptions
					}
					localStorage.setItem('user', JSON.stringify(userObj));
					localStorage.setItem('sess', response.data.token);
					localStorage.setItem('refresh', response.data.refresh);
					self._completeLogin(userObj);

					res();
				}).catch(function(error) {
					if(error.response.data.msg === undefined)
						rej("Error desconocido (" + error.response.status + ")")
					else
						rej(error.response.data.msg);
				})
			});
		},
		logout: function(force) {
			this.$store.commit('logout');
			delete this.axios.defaults.headers['Authorization'];
			this.axios.interceptors.request.eject(this.$data.interceptor);
			localStorage.removeItem('user');
			localStorage.removeItem('sess');
			localStorage.removeItem('refresh');
			this.$router.push('/');
			if(force) {
				this.alert("Hubo un problema grave al detectar tu información de sesión.")
			}
		},
		alert: function(err) {
			alert(err);
			return;
			if(typeof err === "string") {
				// solo dejamos elc uerpo con msg
			} else if(err instanceof HTMLElement) {
			} else {
				// Cogemos titulo cuerpo y botones?
			}
			$('#modal-alert').modal();
		},

		_completeLogin: function(userObj, token) {
			let self = this;
			token = token || localStorage.getItem('sess');
			self.$store.commit('login', userObj);

			self.axios.defaults.headers['Authorization'] = "Bearer " + token;
			
			self.$data.interceptor = self.axios.interceptors.response.use(r => r, function(error) {
				console.log("AXIOS INTERCEPTOR!!!!", error.response.status);
				if(error.response.status === 401) {
					self.axios.post('/login', {
						refresh: localStorage.getItem('refresh')
					}).then(function(response) {
						localStorage.setItem('sess', response.data.token);
						localStorage.setItem('refresh', response.data.refresh);
						self.axios.defaults.headers['Authorization'] = error.config.headers['Authorization'] = "Bearer " + response.data.token;

						return self.axios(error.config);
					}).catch(function(err) {
						// Es necesario desloguear al usuario
						self.logout(true);
					})
				} else {
					return Promise.reject(error);
				}
			})
		}
	},
	created: function() {
		let axiosInstance = axios.create({
			baseURL: 'http://localhost:8000/api/v1'
		});
		axiosInstance.defaults.headers['Content-Type'] = "application/json";
		axiosInstance.interceptors.request.use(function(config) {
			if(config.data === undefined)
				config.data = {};
			return config;
		}, Promise.reject)
		Vue.use(VueAxios, axiosInstance);
		

		let u = localStorage.getItem('user');
		if(null !== u) {
			this._completeLogin(JSON.parse(u));
		}
	}
}).$mount("#app");