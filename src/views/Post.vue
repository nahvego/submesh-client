<template>
	<main id="post-container" :data-post="post.id">
		<section class="card" id="post-section">
			<div class="card-body">
				<div class="container">
					<div class="row">
						<div class="col-12 col-sm-1 pr-2 py-2 post-vote-count pl-0" @click="handleVoteClick">
							<a class="fas fa-thumbs-up thumbs-up thumbs text-secondary d-sm-block" :class="{ 'voted': post.ownVote>0 }"></a>
							<span class="my-2 font-weight-bold small cursor d-md-block mx-1" data-placement="right" data-toggle="tooltip" :title="post.score | formatNumber"> {{ post.score | formatNumberShort }}</span>
							<a class="fas fa-thumbs-down thumbs-down thumbs text-secondary d-sm-block" :class="{ 'voted': post.ownVote<0 }"></a>
						</div>
						<div class="col-12 col-sm-11">
							<h2>{{ post.title }}</h2>
							<hr class="m-0 mb-1">
							<p class="small m-0">Publicado por [link]u/{{ post.authorName }}[/link] <span data-toggle="tooltip" :title="post.creationDate | formatDate">{{ post.creationDate | formatDateShort }}</span></p>
							<hr class="mt-1 mb-2">
							<article v-html="parseContent(post.content)"></article>
							[comentar]
							[comentarios en otra card]
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="card my-3">
			<div class="new-comment form-group">
				<h6 class="ml-1"><strong>Nuevo comentario</strong></h6>
				<form action="#" @submit="newComment" class="text-right">
					<textarea id="newComment_text" minlength="10" class="form-control mb-2"></textarea>
					<button type="submit" class="btn btn-primary loading-ready">Comentar</button>
				</form>
			</div>
			<div class="card-body" v-if="post.comments" @click="handleCommentClick">
				<div class="container" style="padding:1rem !important">
					<single-comment v-for="comment in post.comments" :key="comment.id" :comment="comment"></single-comment>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex';
import SingleComment from './components/Comment.vue'

export default {
	name: 'post',
	components: {
		SingleComment
	},
	data: function() {
		return {
			post: {
				title: "Cargando...",
				authorName: "autor",
				creationDate: new Date(),
				content: "",
				comments: []
			}
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
			let self = this;
			this.$root.axios.get("/subs/" + this.$route.params.sub + "/posts/" + this.$route.params.post).then(function(response) {
				self.post = response.data;

				self.$root.axios.get("/subs/" + self.$route.params.sub + "/posts/" + self.$route.params.post + "/comments").then(function(response) {
					
					self.$set(self.post, 'comments', response.data)
					self.$root.$nextTick(function() {
						$('[data-toggle="tooltip"]').tooltip();
					})
				}).catch(function(error) {
					console.log('Comentarios', error);
				});

			}).catch(function(error) {
				// TODO: Catch errors.
				if(error.status === 404)
					$('#post-section').html('<div class="alert alert-danger">Post no existe</div>');
				else
					console.log(error);
			});
		},
		parseContent (text) {
			return this.$root.$options.filters.parseContent(text);
		},

		handleCommentClick (e) {
			if(e.target.classList.contains('comment-line')) {
				let parent = $(e.target).closest('[data-comment]');
				parent.children('.comment').hide();
				parent.children('.collapse-title').removeClass('d-none');
			} else if(e.target.classList.contains('uncollapse')) {
				let parent = $(e.target).closest('[data-comment]');
				parent.children('.collapse-title').addClass('d-none');
				parent.children('.comment').show();

			}
		},
		
		handleVoteClick (e) {
			if(!e.target.classList.contains('thumbs-up') && !e.target.classList.contains('thumbs-down'))
				return;

			this.$root.votePost(e, this.post);
		},

		newComment () {
			e.preventDefault();
			console.log('TODO');
		}
	},
	computed: {
		...mapGetters([ 'isLogged' ]),
		...mapState([ 'user' ])
	}
}
</script>

<style scoped lang="scss">

@import "../scss/imports.scss";

.post-vote-count {

	text-align: center;
}

.new-comment {
	border-radius: inherit;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	background-color: #F5F5C1;
	@include gradient-y(#F5F5C1, #FFF, 75%);
	padding: $spacer*.5;
	padding-bottom: $spacer*2;
}
</style>