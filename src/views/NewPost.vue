<template>
	<div class="card">
		<div class="card-body" id="np_body">
			<template v-if="sub">
				<template v-if="isLogged">
					<template v-if="isSubbed">
						<form action="#" @submit="publish">
							<div class="alert alert-danger d-none" role="alert" id="np_alert"></div>
							<div class="form-group">
								<label for="np_title">Título</label>
								<input type="text" class="form-control" id="np_title" minlength="5" maxlength="50" v-model="post.title">
								<small id="np_title_help" class="form-text text-muted">Título descriptivo del post.</small>
							</div>
							<div class="form-group">
								<label for="np_link">Enlace</label>
								<input type="url" class="form-control" id="np_link" v-model="post.link">
								<small id="np_link_help" class="form-text text-muted">Enlace sobre el que comentas. Opcional.</small>
							</div>
							<div class="form-group">
								<label for="np_image">Imagen descriptiva</label>
								<input type="url" class="form-control" id="np_image" pattern="\.(png|jpg|gif|jpeg)(\?.*)?$" maxlength="255" v-model="post.image">
								<small id="np_image_help" class="form-text text-muted">Imágen que aparece al lado de tu post. Se seleccionará una por defecto de ser necesario.</small>
							</div>
							<div class="form-group">
								<label for="np_content">Contenido del post</label>
								<wysiwyg v-model="post.content"></wysiwyg>
							</div>
							<div class="d-flex justify-content-center"><button type="submit" class="btn btn-primary btn-lg loading-ready" id="np_submit">Publicar</button></div>
						</form>
					</template>
					<div class="alert alert-warning m-0" v-else>Debes estar suscrito al sub para publicar</div>
				</template>
			</template>
			<div class="alert alert-danger m-0" v-else>¡No existe el sub!</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex';

export default {
	name: 'home',
	data: function() {
		return {
			sub: null,
			post: {
				title: "",
				link: "",
				image: "",
				content: ""
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
			this.$root.axios.get("/subs/" + this.$route.params.sub).then(function(response) {
				self.sub = response.data;
			}).catch(function(error) {
				// Sub no existe, por defecto.
			});
		},
		publish (e) {
			e.preventDefault();
			$('#np_submit').prop('disabled', true);

			let self = this;
			let postData = Object.assign({}, this.post);
			if(postData.image.length === 0)
				delete postData.image;
			if(postData.link.length === 0)
				delete postData.link;

			this.$root.axios.post("/subs/" + this.$route.params.sub + "/posts", postData).then(function(response) {
				self.$root.$router.push("/s/" + self.$route.params.sub + "/" + response.data.id + "/" + self.$root.$options.filters.urlify(response.data.title));
			}).catch(function(error) {
				let errStr = error.response.data.msg;
				if(error.response.data.errors !== undefined) {
					let arr = [];
					for(let obj of error.response.data.errors) {
						switch(obj.field) {
							case 'title':
								arr.push('<strong>Título</strong>: Entre 5 y 50 carácteres');
								break;
							case 'link':
								arr.push('<strong>Enlace</strong>: Enlace inválido (¿Has incluído el protocolo?)');
								break;
							case 'image':
								arr.push('<strong>Imagen</strong>: Imágen inválida (GIF, PNG, JPG o JPEG)');
								break;
							case 'content':
								arr.push('<strong>Contenido</strong>: Al menos 10 carácteres');
								break;
						}
					}
					errStr = arr.join('<br>')
				}
				$('#np_alert').html(errStr).removeClass('d-none').get(0).scrollIntoView(false);
				$('#np_submit').prop('disabled', false);
			});
		}
	},
	computed: {
		...mapGetters([ 'isLogged' ]),
		...mapState([ 'user' ]),
		isSubbed () {
			return this.sub && this.isLogged && this.user.subscriptions.indexOf(this.$route.params.sub) >= 0;
		}
	}
}
</script>

<style scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>