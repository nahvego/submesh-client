<template>
	<section :data-comment="comment.id">
		<div class="row comment">
			<div class="col-1 p-0 m-0 comment-vote-count mt-3 d-flex flex-column justify-content-center text-center">
				<a class="fas fa-thumbs-up thumbs-up thumbs text-secondary" :class="{ 'voted': comment.ownVote>0 }"></a>
				<span class="my-2 font-weight-bold small cursor my-2" data-placement="right" data-toggle="tooltip" :title="comment.score | formatNumber"> {{ comment.score | formatNumberShort }}</span>
				<a class="fas fa-thumbs-down thumbs-down thumbs text-secondary" :class="{ 'voted': comment.ownVote<0 }"></a>
				<div class="comment-line border-left"></div>
			</div>
			<div class="col p-0 m-0">
				<ul class="list-inline small list-separated text-muted m-0">
					<li class="list-inline-item my-1">
						<router-link v-if="comment.authorName" :to="{name: 'profile', params: { user: comment.authorName }}">{{ comment.authorName }}</router-link>
						<i v-else>[eliminado]</i>
					</li>
					<li class="list-inline-item">{{ comment.score | formatNumber }}</li>
					<li class="list-inline-item cursor" :title="comment.creationDate | formatDate" data-toggle="tooltip">{{ comment.creationDate | formatDateShort }}</li>
				</ul>
				<div v-html="parseContent(comment.content)"></div>
				<ul class="list-inline small list-separated text-muted m-0">
					<li class="list-inline-item"><a href="#" @click="reply" class="text-muted">Responder</a></li>
					<li class="list-inline-item">Compartir</li>
				</ul>
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

export default {
	name: 'single-comment',
	props: ['comment'],
	methods: {
		reply (e) {
			e.preventDefault();
		},
		parseContent (text) {
			return this.$root.$options.filters.parseContent(text);
		}
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