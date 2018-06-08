import Vue from 'vue'
import Router from 'vue-router'
import Post from './views/Post.vue'
import PostList from './views/PostList.vue'
import Profile from './views/Profile.vue'
import SidebarSub from './views/SidebarSub.vue'
import NotFound from './views/NotFound.vue'

import Placeholder from './views/components/Placeholder.vue';

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
				default: Post,
				sidebar: SidebarSub
			}
		},
		{
			path: '/u/:user',
			name: 'profile',
			components: {
				default: Profile,
				sidebar: Placeholder
			}
		},
		{
			path: '*',
			name: 'e404',
			component: NotFound
		}
	]
})
