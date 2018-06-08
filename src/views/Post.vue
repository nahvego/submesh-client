<template>
	<div class="card">
		<div class="card-body">
			<div class="container">
				<div class="row">
					<div class="col-12 col-sm-1 p-2">
						Esto deberia estar horizontal si es pequeño?
					</div>
					<div class="col-12 col-sm-11">
						<h2>{{ post.title }}</h2>
						<hr class="m-0 mb-1">
						<p class="small m-0">Publicado por [link]u/{{ post.authorName }}[/link] <span data-toggle="tooltip" :title="post.creationDate | formatDate">{{ post.creationDate | formatDateShort }}</span></p>
						<hr class="mt-1 mb-2">
						{{ post.content }}
						[comentar]
						[comentarios en otra card]
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex';

export default {
	name: 'home',
	data: function() {
		return { post: {} }
	},
	components: {
		
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
			let self = this;
			this.$root.axios.get("/subs/" + this.$route.params.sub + "/posts/" + this.$route.params.post).then(function(response) {
				self.post = response.data;
			}).catch(function(error) {
				// TODO: Catch errors.
				console.log(error);
			});
		},
		log() {
			console.log('LOGGING IN');
			this.$store.commit('login', {"name":"pepe"});
		}
	},
	computed: {
		...mapGetters([ 'isLogged' ]),
		...mapState([ 'user' ])
	}
}
</script>
