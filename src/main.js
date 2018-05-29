import Vue from 'vue'
import App from './views/PostList.vue'
import router from './router.js'
import store from './store.js'


const vm = new Vue({
  	router,
  //render: h => h(App),
	store,
  	data: {
	  	test: "TEST!!"
  }
}).$mount("#app");


console.log('vue');