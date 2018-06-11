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
				<button type="button" class="btn btn-outline-primary btn-block" v-on:click="subscribeClickEvent" v-on:mouseenter="subscribeHoverEvent" v-on:mouseleave="subscribeOutEvent">Suscrito</button>
				<router-link class="btn btn-secondary btn-block" role="button" :to="{name:'new-post', params: {sub: sub.urlname}}">Nuevo Post</router-link>
			</template>
			<template v-else-if="isConcreteSub">
				<input type="button" value="Suscribirse" id="subagainbutton" class="btn btn-primary btn-block" v-on:click="subscribe">
			</template>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex';
import SidebarHome from './SidebarHome.vue'

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
			return this._isConcreteSub();
		},
		isSubbed: function() {
			return this.isLogged && this.user.subscriptions.indexOf(this.sub.urlname) >= 0;
		}
	},
	methods: {
		subscribe: function() {
			let self = this;
			this.$root.axios.post('/subs/' + this.sub.urlname + '/subscriptions').then(function(result) {
				self.$root.$store.commit('sub', self.sub.urlname);
				self.sub.subCount++;
			}).catch(e => {});
		},
		unsubscribe: function() {
			let self = this;
			this.$root.axios.delete('/subs/' + this.sub.urlname + '/subscriptions').then(function(result) {
				self.$root.$store.commit('unsub', self.sub.urlname);
				self.sub.subCount--;
			}).catch(e => {});
		},
		_isConcreteSub: function() {
			return this.$route.params.sub !== "me" && this.$route.params.sub !== "all" && this.$route.params.sub !== undefined;
		},
		load: function() {
			if(!this._isConcreteSub()) return;
			let self = this;
			this.$root.axios.get('/subs/' + this.$route.params.sub).then(function(response) {
				self.sub = response.data;
			}).catch(function(error) {
				$('<div class="alert alert-danger">Error inesperado (' + error.response.status + ')</div>').appendTo('#sidebar-sub');
			})
		},

// TODO: Fixear esta mierda
		subscribeClickEvent: function(e) {
			e.preventDefault();
			//this.subscribeOutEvent(e);
			this.unsubscribe();
		},
		subscribeHoverEvent: function(e) {
			e.preventDefault();
			$(e.target).removeClass('btn-outline-primary').addClass('btn-warning').text('Desuscribirse');
		},
		subscribeOutEvent: function(e) {
			e.preventDefault();
			$(e.target).removeClass('btn-warning').addClass('btn-outline-primary').text('Suscrito');
		}
	}
}
</script>
