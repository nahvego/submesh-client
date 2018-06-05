<template>
	<nav id="navbar-m" class="navbar navbar-expand-lg fixed-top navbar-light bg-light border-bottom">
		<a class="navbar-brand" href="#">Submesh</a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarLinks" aria-controls="navbarLinks" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarLinks">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item active">
					<router-link class="nav-link" to="/">Home</router-link>
				</li>
				<li class="nav-item">
					<router-link class="nav-link" to="/s/all">/s/all</router-link>
				</li>
				<li class="nav-item dropdown" v-if="isLogged && user.subscriptions.length">
					<a id="navbarSuscriptions" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Mis suscripciones</a>
					<div class="dropdown-menu" aria-labelledby="navbarSuscriptions">
						<!-- :key="sub.id" en el v-for-->
						<router-link :key="sub" v-for="sub in user.subscriptions" class="dropdown-item" :to="{name: 'sub', params: {sub}}">/s/{{sub}}</router-link>
					</div>
				</li>
			</ul>
			<ul class="navbar-nav ml-auto">
				<li class="nav-item dropdown" v-if="isLogged">
					<a id="navbarProfile" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{user.name}}</a>
					<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarProfile">
						<router-link class="dropdown-item" :to="{ name: 'profile', params: {user: user.name}}">Mi perfil</router-link>
						<a class="dropdown-item" :click="logout">Salir</a>
					</div>
				</li>
				<template v-else>
					<li class="nav-item">
						<a class="nav-link" v-on:click="openLoginModal()">Login</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" :click="openRegisterModal">Registro</a>
					</li>
				</template>
			</ul>
		</div>
		<!--<form class="form-inline my-1 my-lg-0">
			<input class="form-control" type="search" placeholder="Buscar">
			<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
		</form>-->
	</nav>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  	name: 'navbar',
	computed: {
		...mapGetters([ 'isLogged' ]),
		...mapState([ 'user' ])
	},
	methods: {
		openLoginModal: function() {
			$('#modal-login').modal();
		},
		openRegisterModal: function() {
			
		},
		logout: function() {

		}
	}
}
</script>
