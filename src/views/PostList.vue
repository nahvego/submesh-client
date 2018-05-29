<template>
	<div class="card">
		<div class="card-header"><h4 class="mb-0">/s/sub<span v-if="isLogged">Test</span><a v-on:click="log()">LOGin!</a></h4></div>
		<ul class="list-group list-group-flush">
			<post-list-item v-for="post in posts" :post="post" :key="post.id"></post-list-item>
		</ul>
	</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex';
import PostListItem from './components/PostListItem.vue';

export default {
	name: 'home',
	components: {
		PostListItem
	},
	data: function() {
		return {
			posts: [{id:1,"title":"TITULO PLACEHOLDER"}]
		}
	},
	watch: {
		'$route.params.sub': function(sub) {
			this.load();
		}
	},
	created () {
		this.load();
	},
	methods: {
		load() {
			console.log(">>>", this.$options.components)
			this.posts = [{id:2,"title":"PLACEHOLDER 2"},{id:3,"title":"PLACEHOLDER 3"}];
		},
		log() {
			console.log('LOGGING IN');
			this.$store.commit('login', {"name":"pepe"});
		}
	},
	computed: {
		...mapGetters([ 'isLogged' ])
	}
}
</script>
