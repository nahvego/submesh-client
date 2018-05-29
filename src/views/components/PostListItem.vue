<template>
	<li class="list-group-item sm-post-list d-flex flex-row py-0 pl-0">
		<div class="sm-votes bg-light mr-3 align-middle flex-column d-flex text-center justify-content-center">
			<a class="oi oi-thumb-up text-secondary" aria-hidden="true"></a>
			<span class="my-2 font-weight-bold small" data-placement="right" data-toggle="tooltip" title="999.123">999k</span>
			<a class="oi oi-thumb-down text-secondary" aria-hidden="true"></a>
		</div>
		<div class="media py-2">
			<a href="/EXTERNAL LINK" target="_blank" class="blank-opt-out">
				<img src="http://via.placeholder.com/100x100" alt="IMAGEN" class="border border-light rounded" />
			</a>
			<div class="media-body ml-3">
				<h6 class="mb-0"><a href="#" class="font-weight-bold sm-post-link">3 tristes tigres comían trigo en un trigal</a></h6>
				<a href="#out" class="sm-post-more" target="_blank">link al enlace si es un enlace</a>
				<div class="sm-post-more"><a href="#"><b>s/tigres</b></a> Publicado por <a href="#">u/juanito</a> <span title="02/02/02 02:02 (GMT)" data-toggle="tooltip" data-placement="top">hace 2 horas</span></div>
				<ul class="list-inline small text-muted list-separated mt-1">
					<li class="list-inline-item"><a href="comments" class="text-muted"><span class="oi oi-comment-square small mr-1"></span>6 comentarios</a></li>
					<li class="list-inline-item">95% upvotes</li>
					<li class="list-inline-item">{{ post }}</li>
				</ul>
			</div>
		</div>
	</li>
</template>

<script>

export default {
	name: 'post-list-item',
	props: ['post']
}
</script>