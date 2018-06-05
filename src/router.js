import Vue from 'vue'
import Router from 'vue-router'
import PostList from './views/PostList.vue'
import Profile from './views/Profile.vue'
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
			path: '/s/:sub?',
			alias: '/',
			name: 'sub',
			components: {
				default: PostList,
				sidebar: SidebarSub
			}
		},
		{
			path: '/s/:sub/:post/:title?',
			name: 'post',
			components: {
				default: PostList,
				sidebar: SidebarSub
			}
		},
		{
			path: '/u/:user',
			name: 'profile',
			components: {
				default: Profile,
				sidebar: SidebarHome
			}
		},
		{
			path: '*',
			name: 'e404',
			component: NotFound
		}
	]
})
