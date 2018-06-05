<template>
	<div id="modal-alert" class="modal" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalLogin">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<form role="form" action="#" v-on:submit="doLogin($event)">
					<div class="modal-header bg-wave">
						<h4 class="modal-title">Login</h4>
					</div>
					<div class="modal-body">
						<div class="alert alert-danger d-none" role="alert"></div>
						<div class="form-group">
							<label for="username">Nombre</label>
							<input required type="text" class="form-control" id="username" pattern="^(?=(?![0-9]+$))[a-zA-Z0-9_-]{3,15}$" />
						</div>
						<div class="form-group">
							<label for="password">Contraseña</label>
							<input required type="password" class="form-control" id="password" />
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
  	name: 'alert-modal'
}
</script>
