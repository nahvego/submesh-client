<template>
	<div key="modal-alert" id="modal-alert" class="modal" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalAlert">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header bg-wave">
					<h4 class="modal-title"> {{ title }}</h4>
				</div>
				<div class="modal-body">{{ body }}</div>
				<form @submit="yieldPrompt">
					<div class="modal-footer" v-html="buttons"></div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
	  name: 'alert-modal',

	  data: function() {
		  return {
			  title: 'Alerta',
			  body: '',
			  mode: 'alert',
			  okBtn: 'OK',
			  cancelBtn: 'Cancelar',
			  callback: () =>{}
		  }
	  },

	  methods: {
		  yieldPrompt (e) {
			  e.preventDefault();
			  $('#modal-alert').modal('hide');
			  this.callback();
		  }
	  },

	  computed: {
		  buttons () {
			  if(this.mode === 'alert') {
				  return '<button type="button" class="btn btn-primary" data-dismiss="modal" key="close">' + this.okBtn + '</button>';
			  } else if(this.mode === 'prompt') {
				  return '<button type="submit" class="btn btn-danger">' + this.okBtn + '</button>' +
				  '<button type="button" class="btn btn-secondary" data-dismiss="modal" key="close">' + this.cancelBtn + '</button>';
			  }
		  },
		  classes () {
			  return {};
		  }
	  },
	  
	  created () {
		  this.$root.$bus.$on('alert.modal', (payload) => {
			  console.log(payload)
			  this.title = payload.title || 'Error';
			  this.body = payload.body || 'Oops';
			  this.mode = payload.mode || 'alert';
			  this.okBtn = payload.okBtn || 'OK';
			  this.cancelBtn = payload.cancelBtn || 'Cancelar'
			  this.callback = payload.callback || (() => {})

			  $('#modal-alert').modal();
		  })
	  }
}
</script>
