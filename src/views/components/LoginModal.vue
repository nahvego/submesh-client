<template>
	<div id="modal-login" class="modal" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalLogin">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<form role="form" action="#" v-on:submit="doLogin($event)">
					<div class="modal-header bg-wave">
						<h4 class="modal-title">Login</h4>
					</div>
					<div class="modal-body">
						<div class="alert alert-danger d-none" role="alert"></div>
						<div class="form-group">
							<label for="i_username">Nombre</label>
							<input required type="text" class="form-control" id="i_username" pattern="^(?=(?![0-9]+$))[a-zA-Z0-9_-]{3,15}$" />
						</div>
						<div class="form-group">
							<label for="i_password">Contraseña</label>
							<input required type="password" class="form-control" id="i_password" />
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary loading-ready" id="login">Entrar</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  	name: 'login-modal',
	methods: {
		doLogin: function(e) {
			e.preventDefault();
			$('#login').prop('disabled', true);
			this.$root.login($('#i_username').val(), $('#i_password').val()).then(function(a) {
				$('#modal-login').modal('hide');
			})
			.catch(function(e) {
				$('#modal-login .alert').text(e).removeClass('d-none');
			}).then(function() {
				$('#login').prop('disabled', false);
			})
		}
	}
}
</script>
