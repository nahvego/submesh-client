<template>
	<div class="card">
		<div class="card-body" id="ns_body">
			<template v-if="isLogged">
				<form role="form" @submit="createSub">
					<h3>Crea una comunidad</h3>
					<p class="text-muted">Podrás administrar tu comunidad y personalizarla a tu gusto</p>
					<div class="alert alert-danger d-none"></div>
					<div class="form-group">
						<label for="ns_name">Nombre del sub</label>
						<div class="input-group">
							<input required type="text" name="ns_name" class="form-control" id="ns_name" minlength="3" maxlength="40" />
							<div class="invalid-feedback"></div>
						</div>
					</div>
					<div class="form-group">
						<label for="ns_urlname">URL del sub</label>
						<div class="input-group">
							<div class="input-group-prepend">
								<span class="input-group-text">s/</span>
							</div>
							<input required type="text" name="ns_urlname" class="form-control" id="ns_urlname" pattern="^(?=(?![0-9]+$))[a-zA-Z0-9_-]{4,20}$" @keyup="urlnameKeyUp" />
						</div>
						<small id="ns_urlname_help" class="form-text text-muted">Enlace de tu sub, caracteres de internet únicamente.</small>
						<div class="invalid-feedback"></div>
					</div>
					<div class="form-group">
						<label for="ns_desc">Descripción</label>
						<div class="input-group">
							<textarea required name="ns_desc" class="form-control" id="ns_desc" minlength="5" maxlength="500" />
						</div>
						<div class="invalid-feedback"></div>
					</div>
					<div class="d-flex justify-content-center"><button type="submit" class="btn btn-primary btn-lg loading-ready" id="ns_submit">Crear sub</button></div>
				</form>
			</template>
			<div class="alert alert-danger m-0" v-else>¡Debes iniciar sesión!</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex';

export default {
	name: 'new-sub',
	computed: {
		...mapGetters([ 'isLogged' ])
	},
	methods: {
		urlnameKeyUp (e) {
			e.target.value = e.target.value.toLowerCase()
		},
		createSub (e) {
			e.preventDefault();
			let ins = {
				name: e.target.elements['ns_name'].value,
				urlname: e.target.elements['ns_urlname'].value,
				description: e.target.elements['ns_desc'].value
			}

			$('#ns_submit').prop('disabled', true);
			this.$root.axios.post('/subs', ins).then((response) => {
				this.$root.$store.commit('sub', response.data.urlname);
				this.$root.$router.push("/s/" + response.data.urlname);
			}).catch((error) => {
				$('#ns_body').find('.alert').text(error.response.data.msg).removeClass('d-none').get(0).scrollIntoView(false);
			})
		} 
	}
}
</script>

<style scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>