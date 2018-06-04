import Vue from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import PostList from './views/PostList.vue'
import router from './router.js'
import store from './store.js'

import navbar from './views/components/NavBar.vue';
import LoginModal from './views/components/LoginModal.vue';

Vue.component('navbar', navbar);
Vue.component('app', App);
Vue.component('login-modal', LoginModal);

const vm = new Vue({
  	router,
	store,
  	data: {
	  	test: "TEST!!"
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
					self.$store.commit('login', userObj);
					localStorage.setItem('user', JSON.stringify(userObj));
					localStorage.setItem('sess', response.data.token);
					localStorage.setItem('refresh', response.data.refresh);

					res();
				}).catch(function(error) {
					if(error.response.data.msg === undefined)
						rej("Error desconocido (" + error.response.status + ")")
					else
						rej(error.response.data.msg);
				})
			});
		}
	},
	created: function() {
		console.log('vue');
		Vue.use(VueAxios, axios.create({
			baseURL: 'http://localhost:8000/api/v1',
			headers: {
				'Content-Type': 'application/json'
			}
		}));
	}
}).$mount("#app");