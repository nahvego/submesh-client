import Vue from 'vue'
import Router from 'vue-router'
import Post from './views/Post.vue'
import PostList from './views/PostList.vue'
import Profile from './views/Profile.vue'
import SidebarSub from './views/SidebarSub.vue'
import SidebarHome from './views/SidebarHome.vue'
import NotFound from './views/NotFound.vue'
import NewPost from './views/NewPost.vue'
import NewSub from './views/NewSub.vue'

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
			path: '/s/:sub/new',
			name: 'new-post',
			components: {
				default: NewPost,
				sidebar: SidebarSub
			}
		},
		{
			path: '/s/:sub/edit/:post',
			name: 'edit-post',
			components: {
				default: NewPost,
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
			path: '/new-sub',
			name: 'new-sub',
			components: {
				default: NewSub,
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
