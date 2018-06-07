<template>
	<sidebar-home v-if="!isConcreteSub || !isLogged"></sidebar-home>
	<div class="card mb-3" v-else>
		<div class="card-header">
			<h6 class="m-0">{{ sub.name }}</h6>
		</div>
		<div class="card-body" id="sidebar-sub">
			<div class="row">
				<div class="col-sm border-right border-primary">
					{{ sub.subCount | formatNumberShort }} suscriptores
				</div>
				<div class="col-sm m-0">
					{{ sub.online | formatNumberShort }} online
				</div>
			</div>
			<p>{{ sub.description }}</p>
			<template v-if="isSubbed">
				<button type="button" class="btn btn-outline-primary btn-block" v-if="isSubbed" v-on:click="unsubscribe" onmouseenter="this.textContent='Desuscribirse';this.classList.add('btn-warning');this.classList.remove('btn-outline-primary')" onmouseleave="this.textContent='Suscrito';this.classList.add('btn-outline-primary');this.classList.remove('btn-warning')">Suscrito</button>
				<button type="button" class="btn btn-primary btn-block" v-if="!isSubbed">Nuevo Post</button>
			</template>
			<button type="button" class="btn btn-primary btn-block" v-on:click="subscribe" v-else>Suscribirse</button>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex';
import SidebarHome from './components/SidebarHome.vue'

export default {
	name: 'sidebar-sub',
	components: {
		SidebarHome
	},
	data: function() {
		return {
			memberCount: 0,
			subCount: 0,
			sub: {}
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
	computed: {
		...mapGetters([ 'isLogged' ]),
		...mapState([ 'user' ]),
		isConcreteSub: function() {
			return this._isConcreteSub;
		},
		isSubbed: function() {
			return this.isLogged && this.user.subscriptions.indexOf(this.sub.urlname) >= 0;
		}
	},
	methods: {
		openLoginModal: function() {
			$('#modal-login').modal();
		},
		openRegisterModal: function() {
			$('#modal-register').modal();
		},
		subscribe: function() {
			
		},
		unsubscribe: function() {

		},
		_isConcreteSub: function() {
			return this.$route.params.sub !== "me" && this.$route.params.sub !== "all" && this.$route.params.sub !== undefined;
		},
		load: function() {
			if(!this._isConcreteSub) return;
			let self = this;
			this.$root.axios.get('/subs/' + this.$route.params.sub).then(function(response) {
				self.sub = response.data;
			}).catch(function(error) {
				$('<div class="alert alert-danger">Error inesperado (' + error.response.status + ')</div>').appendTo('#sidebar-sub');
			})
		}
	}
}
</script>
