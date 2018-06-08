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
import RegisterModal from './views/components/RegisterModal.vue';



import UrlifyPcge from 'urlify';
const urlify = UrlifyPcge.create({
	spaces: "-",
	nonPrintable: "-",
	trim: true,
	failureOutput: "---"
})

Vue.component('navbar', navbar);
Vue.component('app', App);
Vue.component('register-modal', RegisterModal);
Vue.component('login-modal', LoginModal);
Vue.component('alert-modal', AlertModal);

Vue.filter('formatNumber', function(n) {
	return new Intl.NumberFormat().format(n || 0);
});
Vue.filter('formatNumberShort', function(n) {
	n = n || 0;
	let str;
	if(n >= 1e6) {
		let div = n/1e6;
		str = div.toFixed(1);
		if(str.charAt(str.length-1) === '0') {
			str = str.slice(0, -2);
		}
		str = str + 'M';
	} else if(n >= 1e5) {
		let div = n/1e3;
		str = Math.floor(div).toString() + "k";
	} else if(n >= 1e3) {
		let div = n/1e3;
		str = div.toFixed(2);
		while(str.charAt(str.length-1) === '0') {
			str = str.slice(0, -1);
			if(str.charAt(str.length-1) === '.') {
				str = str.slice(0, -1);
				break;
			}
		}
		str = str + 'k';
	} else {
		str = n.toString();
	}
	return str;
});
Vue.filter('formatDate', function(d) {
	return d;
});
Vue.filter('formatDateShort', function(d) {
	let diff = (new Date().getTime() - d) / 1000; // seconds
	if(diff < 60)
		return "hace " + diff + " segundos";
	if(diff < 3600)
		return "hace " + +(diff/60) + " minutos";
	if(diff < 86400)
		return "hace " + Math.round(diff/3600) + " horas";
	if(diff < 172800)
		return "ayer";
	return "hace " + Math.floor(diff/86400) + " días";
});
Vue.filter('urlify', function(s) {
	return urlify(s);
});

const vm = new Vue({
  	router,
	store,
  	data: {
	  	interceptor: null
	},
	methods: {
		login: function(user, password) {
			console.log('loguando con ', user, password)
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
			this.axios.interceptors.response.eject(this.$data.interceptor);
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
			
			self.$data.interceptor = self.axios.interceptors.response.use(function(r) {
				//console.log("Axios interceptor (gut)", r);
				return r;
			}, function(error) {
				//console.log("AXIOS INTERCEPTOR!!!!", error.response.status);
				if(error.response.status === 401) {
					self.axios.post('/login', {
						refresh: localStorage.getItem('refresh')
					}).then(function(response) {
						localStorage.setItem('sess', response.data.token);
						localStorage.setItem('refresh', response.data.refresh);
						self.axios.defaults.headers['Authorization'] = error.config.headers['Authorization'] = "Bearer " + response.data.token;

						return self.axios.request(error.config);
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
		/*axiosInstance.interceptors.response.use(function(c) {
			console.log("Interceptor previo");
			return c;
			//c => c
		}, function(error) {
			if(error.response) {
				Promise.reject(error);
			} else {
				console.log("Error ocurred", error);
				alert("Error fatal");
			}
		});*/
		Vue.use(VueAxios, axiosInstance);
		

		let u = localStorage.getItem('user');
		if(null !== u) {
			this._completeLogin(JSON.parse(u));
		}
	}
}).$mount("#app");

// TODO: Error por defecto cuando no haya error.response