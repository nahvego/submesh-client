import Vue from 'vue'
import Router from 'vue-router'
import PostList from './views/PostList.vue'
import SidebarHome from './views/SidebarHome.vue'
import SidebarSub from './views/SidebarSub.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	linkExactActiveClass: 'active',
	linkActiveClass: 'active-partial',
	routes: [
		{
			path: '/',
			name: 'home',
			components: {
				default: PostList,
				sidebar: SidebarHome
			}
		},
		{
			path: '/s/:sub',
			name: 'sub',
			components: {
				default: PostList,
				sidebar: SidebarSub
			}
		},
		{
			path: '*',
			name: 'e404',
			component: NotFound
		}
	]
})
