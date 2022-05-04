<script setup lang="ts">
// @ts-nocheck
console.log(
	'process.env.VUE_APP_GITHUB_TOKEN',
	process.env.VUE_APP_GITHUB_TOKEN
);
console.log('VUE_APP_GITHUB_TOKEN', VUE_APP_GITHUB_TOKEN);
</script>

<template>
	<StarportCarrier>
		<RouterView />
	</StarportCarrier>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
