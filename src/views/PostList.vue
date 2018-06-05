<template>
	<div class="card">
		<div class="card-header"><h4 class="mb-0">{{ sub }}</h4></div>
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
			// Es necesario devolver subUrlname!
			let requestRoute;
			if(this.$route.params === undefined && this.isLogged && this.user.subscriptions.length > 0) {
				this.sub = 'Tu homepage'
				// Personal personalizada
				requestRoute = '/subs/me/posts';
			} else if(this.$route.params === "all" || this.$route.params === undefined) {
				this.sub = '/s/all';
				// s/all
				requestRoute = '/subs/all/posts';
			} else {
				this.sub = '/s/' + this.$route.params.sub;
				//sub cocreto
				requestRoute = '/subs/' + this.$route.params.sub + '/posts';
			}
			this.$root.axios.get(requestRoute).then(function(response) {

			}).catch(function(error) {
				// TODO: Catch errors.
			});
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
