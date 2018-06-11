<template>
	<div class="card">
		<div class="card-header"><h4 class="mb-0">{{ sub }}</h4></div>
		<ul class="list-group list-group-flush" v-if="posts.length > 0" v-on:click="handlePLClick">
			<post-list-item v-for="post in posts" :post="post" :key="post.id"></post-list-item>
		</ul>
		<div v-else class="alert alert-warning m-3" role="alert">No hay posts que mostrar</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex';
import PostListItem from './components/PostListItem.vue';

export default {
	name: 'home',
	components: {
		PostListItem
	},
	data: function() {
		return {
			posts: [],
			sub: "Cargando..."
		}
	},
	watch: {
		'$route.params.sub': function(sub) {
			this.load();
		},
		'user': function(user) {
			if(null === user) {
				// logout
				this.posts.forEach(post => {
					post.ownVote = undefined; // UGH
				})
			} else {
				// recargamos para cargar votos y esa mierda
				this.load();
			}
		}
	},
	created () {
		// Init
		// AL usar => THIS es el correcto
		this.$root.$bus.$on('url.update', () => {
			this.load();
		})

		// Carga
		this.load();
	},
	methods: {
		load() {
			// Es necesario devolver subUrlname!
			let requestRoute;
			if(this.$route.params.sub === undefined && this.isLogged && this.user.subscriptions.length > 0) {
				this.sub = 'Tu homepage'
				// Personal personalizada
				requestRoute = '/subs/me/posts';
			} else if(this.$route.params === "all" || this.$route.params.sub === undefined) {
				this.sub = '/s/all';
				// s/all
				requestRoute = '/subs/all/posts';
			} else {
				this.sub = '/s/' + this.$route.params.sub;
				//sub cocreto
				requestRoute = '/subs/' + this.$route.params.sub + '/posts';
			}
			let self = this;
			this.$root.axios.get(requestRoute).then(function(response) {
				self.posts = response.data;
			}).catch(function(error) {
				// TODO: Catch errors.
				console.log(error);
			});
		},

		handlePLClick (e) {
			if(!e.target.classList.contains('thumbs-up') && !e.target.classList.contains('thumbs-down'))
				return;

			this.$root.votePost(e, this.posts);
		}
	},
	computed: {
		...mapGetters([ 'isLogged' ]),
		...mapState([ 'user' ])
	}
}
</script>
