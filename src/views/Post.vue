<template>
	<main id="post-container" :data-post="post.id" :data-sub="post.subUrlname">
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
							<p class="small m-0">Publicado por <router-link v-if="post.authorID" :to="{name:'profile', params:{user:post.authorID}}">u/{{ post.authorName }}</router-link><i v-else>[eliminado]</i> <span data-toggle="tooltip" :title="post.creationDate | formatDate">{{ post.creationDate | formatDateShort }}</span></p>
							<hr class="mt-1 mb-2">
							<article v-html="parseContent(post.content)"></article>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="card my-3">
			<div class="new-comment form-group">
				<h6 class="ml-1"><strong>Nuevo comentario</strong></h6>
				<form action="#" @submit="newComment" class="text-right">
					<input type="hidden" name="replyTo" value="0">
					<textarea id="newComment_text" minlength="2" class="form-control mb-2" name="content"></textarea>
					<button type="submit" class="btn btn-primary loading-ready">Comentar</button>
				</form>
			</div>
			<a id="comments"></a>
			<div class="card-body" v-if="post.comments" @click="handleCommentClick">
				<div class="container" style="padding:1rem !important" id="comment-container">
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
			},
			commentList: []
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

						let remaining = self.post.comments.slice();
						let comm;
						while(comm = remaining.pop()) {
							self.commentList.push(comm);
							if(comm.replies.length > 0)
								//https://jsperf.com/spread-vs-array-concat-for-array-merging
								remaining = remaining.concat(comm.replies);
						}
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

			} else if(e.target.classList.contains('thumbs-up') || e.target.classList.contains('thumbs-down')) {
				this.$root.voteComment(e, this.commentList)
			} else if(e.target.classList.contains('open-reply')) {
				e.preventDefault();
				$(e.target).closest('.comment').children('.comment-right').children('.reply-form').removeClass('d-none');
			}
		},
		
		handleVoteClick (e) {
			if(!e.target.classList.contains('thumbs-up') && !e.target.classList.contains('thumbs-down'))
				return;

			this.$root.votePost(e, this.post);
		},

		newComment (e) {
			e.preventDefault();

			let sub = $(e.target).closest('[data-sub]').data('sub');
			let post = $(e.target).closest('[data-post]').data('post');

			let ins = {
				content: e.target.elements['content'].value
			}
			if(!!+e.target.elements['replyTo'].value)
				ins.replyTo = e.target.elements['replyTo'].value;
			
			this.$root.axios.post("/subs/" + sub + "/posts/" + post + "/comments", ins).then((response) => {
				if(ins.replyTo) {
					let comment = $('#comment-container').find('[data-comment="' + ins.replyTo + '"]').data('comment');
					this.commentList.filter(o => o.id == comment)[0].replies.unshift(response.data);
					this.commentList.push(response.data);
				} else {
					this.post.comments.unshift(response.data);
					this.commentList.push(this.post.comments[0]);
				}
				
			})
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