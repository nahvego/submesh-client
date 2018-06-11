<template>
	<section :data-comment="comment.id">
		<div class="row comment">
			<div class="col-1 p-0 m-0 comment-vote-count mt-3 d-flex flex-column justify-content-center text-center">
				<a class="fas fa-thumbs-up thumbs-up thumbs text-secondary" :class="{ 'voted': comment.ownVote>0 }"></a>
				<span class="my-2 font-weight-bold small cursor my-2" data-placement="right" data-toggle="tooltip" :title="comment.score | formatNumber"> {{ comment.score | formatNumberShort }}</span>
				<a class="fas fa-thumbs-down thumbs-down thumbs text-secondary" :class="{ 'voted': comment.ownVote<0 }"></a>
				<div class="comment-line border-left"></div>
			</div>
			<div class="col p-0 m-0 comment-right">
				<ul class="list-inline small list-separated text-muted m-0">
					<li class="list-inline-item my-1">
						<router-link v-if="comment.authorName" :to="{name: 'profile', params: { user: comment.authorName }}">{{ comment.authorName }}</router-link>
						<i v-else>[eliminado]</i>
					</li>
					<li class="list-inline-item">{{ comment.score | formatNumber }}</li>
					<li class="list-inline-item cursor" :title="comment.creationDate | formatDate" data-toggle="tooltip">{{ comment.creationDate | formatDateShort }}</li>
				</ul>
				<div v-html="parseContent(comment.content)" v-if="comment.content"></div>
				<div v-else><i>[Eliminado]</i></div>
				<ul class="list-inline small list-separated text-muted m-0">
					<li class="list-inline-item"><a href="#" class="open-reply text-muted">Responder</a></li>
					<li class="list-inline-item">Compartir</li>
					<li class="list-inline-item" v-if="isAllowedTo('remove-comments', sub, comment.authorID)">Borrar</li>
				</ul>
				<form action="#" @submit="reply" class="mt-2 reply-form d-none text-right">
					<input type="hidden" name="replyTo" :value="comment.id">
					<textarea id="newComment_text" minlength="2" class="form-control mb-2" name="content"></textarea>
					<button type="submit" class="btn btn-primary loading-ready">Comentar</button>
				</form>
				<div class="container replies-container" v-if="comment.replies.length > 0">
					<single-comment v-for="reply in comment.replies" :key="reply.id" :comment="reply" :sub="sub"></single-comment>
				</div>
			</div>
		</div>
		<ul class="list-inline small list-separated text-muted m-0 d-none collapse-title">
			<li class="list-inline-item mr-1">
				<i class="fas fa-plus-circle uncollapse"></i>
			</li>
			<li class="list-inline-item my-1">
				<router-link v-if="comment.authorName" :to="{name: 'profile', params: { user: comment.authorName }}">{{ comment.authorName }}</router-link>
				<i v-else>[eliminado]</i>
			</li>
			<li class="list-inline-item">{{ comment.score | formatNumber }}</li>
			<li class="list-inline-item cursor" :title="comment.creationDate | formatDate" data-toggle="tooltip">{{ comment.creationDate | formatDateShort }}</li>
		</ul>
	</section>
</template>

<script>
import SingleComment from './Comment.vue'
import { mapGetters } from 'vuex'

export default {
	name: 'single-comment',
	props: ['comment', 'sub'],
	components: {
		SingleComment
	},
	methods: {
		reply (e) {
			this.$parent.newComment(e);
		},
		parseContent (text) {
			return this.$root.$options.filters.parseContent(text);
		}
	},
	computed: {
		...mapGetters([ 'isAllowedTo' ])
	}
}
</script>

<style scoped lang="scss">
@import "../../scss/imports.scss";

.comment section {
	font-size: 90%;
}

.uncollapse {
	cursor: pointer;

	&:before {
		position: relative;
		top: 2px;
	}

	&:hover:before {
		color: $blue;
	}
}

$comment-line-color: #E1E3E6;
$comment-line-color-hover: #94B7EB;

.comment-line {
	margin: 10px auto;
	height: auto;
	width: .2rem;
	background-color: $comment-line-color;
	flex-grow: 1;
	cursor: pointer;
}

.comment-line:hover {
	background-color: $comment-line-color-hover;
}
</style>

<style>
.comment .container {
	padding: 0;
}
</style>