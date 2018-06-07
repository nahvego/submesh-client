<template>
	<div class="card mb-3">
		<div class="card-body" id="sidebar-sub">
			<template v-if="isLogged">
				<p>Bienvenido de nuevo <b>{{ user.name }}</b></p>
				<p>Puedes personalizar esta página suscribiéndote a subs que te interesen o</p>
				<button class="btn btn-lg btn-block btn-primary">Crear un nuevo sub</button>
			</template>
			<template v-else>
				<p>¡Bienvenido!</p>
				<p class="small text-muted">¿Has pensado en unirte a la comunidad?</p>
				<p class="small text-muted">¡Somos {{ memberCount | formatNumber }} miembros con {{ subCount | formatNumber }} subs!</p>
				<button class="btn btn-lg btn-block btn-primary" v-on:click="openLoginModal">Identificarme</button>
				<button class="btn btn-lg btn-block btn-secondary" v-on:click="openRegisterModal">Registrarme</button>
			</template>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex';

export default {
  	name: 'sidebar-home',
	computed: {
		...mapGetters([ 'isLogged' ]),
		...mapState([ 'user' ])
	},
	methods: {
		openLoginModal: function() {
			$('#modal-login').modal();
		},
		openRegisterModal: function() {
			$('#modal-register').modal();
		}
	}
}
</script>
