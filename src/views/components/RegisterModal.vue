<template>
	<div id="modal-register" class="modal" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalRegiser">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<form role="form" action="#" v-on:submit="doRegister($event)">
					<div class="modal-header bg-wave">
						<h4 class="modal-title">Registro</h4>
					</div>
					<div class="modal-body">
						<div class="alert alert-primary" role="alert">Podrás completar tu perfil tras registrarte</div>
						<div class="form-group">
							<label for="reg_username">Nombre de usuario</label>
							<div class="input-group">
								<input required type="text" name="username" class="form-control" id="reg_username" pattern="^(?=(?![0-9]+$))[a-zA-Z0-9_-]{3,15}$" v-on:keyup="checkUser" />
								<div class="input-group-append">
									<span class="input-group-text pointer is-invalid" title='Entre 3 y 15 carácteres alfanuméricos, "-" y "_"' data-toggle="tooltip" data-placement="top">?</span>
								</div>
								<div class="invalid-feedback"></div>
							</div>
						</div>
						<div class="form-group">
							<label for="reg_email">Correo electrónico</label>
							<input required type="email" class="form-control" id="reg_email" v-on:keyup="checkEmail" />
						</div>
						<div class="form-group">
							<label for="reg_password">Contraseña</label>
							<input required type="password" class="form-control" id="reg_password" />
						</div>
						<div class="form-group">
							<label for="reg_password2">Confirmar contraseña</label>
							<input required type="password" class="form-control" id="reg_password2" v-on:keyup="checkPwd" />
							<div class="invalid-feedback"></div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary loading-ready" id="reg">Registrarme</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>

export default {
  	name: 'register-modal',
	methods: {
		doRegister: function(e) {
			e.preventDefault();
			let self = this;
			$('#reg').prop('disabled', true);
			this.$root.axios.post('/users', {
				name: $('#reg_username').val(),
				email: $('#reg_email').val(),
				password: $('#reg_password').val(),
			}).then(function(response) {
				$('#reg').removeClass('loading-ready')
				$('#modal-register .alert').removeClass('alert-primary alert-danger').addClass('alert-success').text('El registro se ha completado. Confirma tu correo electrónico antes de loguearte.');
			}).catch(function(error) {
				$('#reg').prop('disabled', false);
				self.showAlert(error.response.data.msg || error.message);
			})
		},
		showAlert: function(msg) {
			$('#modal-register .alert').removeClass('alert-primary').addClass('alert-danger').text(msg);
		},

		checkUser: function(e) {
			if($('#reg_username').val().length < 3) return;


			let self = this;
			$('#reg_username').removeClass('is-valid is-invalid');
			this.$root.axios.get('/users/' + $('#reg_username').val(), {
				validateStatus: function(status) {
					return status == 404;
				}
			}).then(function(r) {
				$('#reg_username').addClass('is-valid');
			}).catch(function(error) {
				if(error.response.status === 200) {
					$('#reg_username').addClass('is-invalid');
					self.showError('username', 'Nombre de usuario en uso');
				} else {
					self.showAlert(error.response.data.msg || "Error desconocido");
				}
			})
		},
		
		checkEmail: function(e) {
			console.log('checkEmail');
		},

		checkPwd: function(e) {
			console.log("checkPwd", $('#reg_password').val(), $('#reg_password2').val())
			if($('#reg_password').val() != $('#reg_password2').val()) {
				document.getElementById('i_password2').setCustomValidity('Las contraseñas no coinciden');
				this.showError('password2', "Las contraseñas no coinciden");
			} else {
				document.getElementById('i_password2').setCustomValidity('');
				this.hideError('password2');
			}
		},

		showError: function(elID, msg) {
			$('#reg_' + elID).addClass('is-invalid').siblings('.invalid-feedback').text(msg).show();
		},
		hideError: function(elID) {
			$('#reg_' + elID).removeClass('is-invalid').siblings('.invalid-feedback').hide();
		}

		
	},
	mounted: function() {
		$('[data-toggle="tooltip"]').tooltip();
	}
}
</script>
