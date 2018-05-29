<template>
	<div class="card mb-3">
		<div class="card-body">
			<template v-if="isLogged">
				<p>Bienvenido de nuevo <b>{{ user.name }}</b></p>
				<p>No sé cómo rellenar esto :)</p>
			</template>
			<template v-else>
				<p>¡Bienvenido!</p>
				<p class="small text-muted">¿Has pensado en unirte a la comunidad?</p>
				<p class="small text-muted">¡Somos {{ n }} miembros con {{ n }} subs!</p>
				<button class="btn btn-lg btn-block btn-primary">Identificarme</button>
				<button class="btn btn-lg btn-block btn-secondary">Registrarme</button>
			</template>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex';

export default {
  	name: 'sidebar-home',
	data: function() {
		let t = this;
		return {
			n: 123
		}
	},
	computed: {
		...mapGetters([ 'isLogged' ]),
		...mapState([ 'user' ])
	}
}
</script>
