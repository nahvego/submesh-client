<template>
	<li class="list-group-item sm-post-list d-flex flex-row py-0 pl-0">
		<div class="sm-votes mr-3 align-middle flex-column d-flex text-center justify-content-center">
			<a class="fas fa-thumbs-up text-secondary"></a>
			<span class="my-2 font-weight-bold small" data-placement="right" data-toggle="tooltip" :title="post.score | formatNumber"> {{ post.score | formatNumberShort }}</span>
			<a class="fas fa-thumbs-down text-secondary"></a>
		</div>
		<div class="media py-2">
			<a href="/EXTERNAL LINK" target="_blank" class="blank-opt-out">
				<img :src="post.avatar" class="border border-light rounded" />
			</a>
			<div class="media-body ml-3">
				<h6 class="mb-0">
					<router-link class="font-weight-bold sm-post-link" :to="{name:'post', params: {sub: post.subUrlname, post: post.id, title: urlify(post.title)}}">{{ post.title }} </router-link>
				</h6>
				<a class="sm-post-more" target="_blank" :to="post.link" v-if="post.link">{{ post.link }}</a>
				<div class="sm-post-more">
					<router-link :to="{name:'sub', params: {sub: post.subUrlname }}"><b>/s/{{ post.subUrlname }}</b></router-link> Publicado por <router-link v-if="post.authorName" :to="{name:'profile', params: {user: post.authorName }}">{{ post.authorName }}</router-link><i v-else>[eliminado]</i> <span :title="post.creationDate | formatDate" data-toggle="tooltip" data-placement="top">{{ post.creationDate | formatDateShort }}</span>
				</div>
				<ul class="list-inline small text-muted list-separated mt-1">
					<li class="list-inline-item"><router-link :to="{hash: '#comments', name:'post', params: {sub: post.subUrlname, post: post.id, title: urlify(post.title)}}" class="text-muted"><i class="fas fa-comment-alt small mr-1"></i>{{ post.commentCount }} comentarios</router-link></li>
					<li class="list-inline-item">{{ post.upvotePercentage }}% upvotes</li>
					<li class="list-inline-item"> ??? </li>
				</ul>
			</div>
		</div>
	</li>
</template>

<script>

export default {
	name: 'post-list-item',
	props: ['post'],
	methods: {
		urlify: function(s) {
			return this.$options.filters.urlify(s);
		}
	}
}
</script>