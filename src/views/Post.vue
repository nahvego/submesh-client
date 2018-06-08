<template>
	<div>PLACEHOLDER!</div>
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
		}
	},
	created () {
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
				self.posts.forEach(function(el) {
					el.creationDate = new Date(el.creationDate);
				})
			}).catch(function(error) {
				// TODO: Catch errors.
				console.log(error);
			});
		},
		log() {
			console.log('LOGGING IN');
			this.$store.commit('login', {"name":"pepe"});
		},

		handlePLClick (e) {
			if(!e.target.classList.contains('thumbs-up') && !e.target.classList.contains('thumbs-down'))
				return;

			let vote = e.target.classList.contains('thumbs-up') ? 1 : -1;
			let isNewVote = !e.target.classList.contains('voted');
			let postID = $(e.target).closest("[data-post]").data('post');
			let post = this.posts.filter(o => o.id == postID)[0];
			console.log(vote);

			this.$root.axios.request({
				method: (isNewVote ? "POST" : "DELETE"),
				url: "/subs/" + post.subUrlname + "/posts/" + postID + "/votes",
				data: { vote }
			}).then(function(response) {
				$(e.target).toggleClass('voted');
				if(isNewVote)
					$(e.target).siblings('.thumbs').removeClass('voted');
				Object.assign(post, { score: response.data.total });
			}).catch(e=>{});
		}
	},
	computed: {
		...mapGetters([ 'isLogged' ]),
		...mapState([ 'user' ])
	}
}
</script>
