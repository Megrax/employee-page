<script setup lang="ts">
// @ts-nocheck
console.log('import.meta.env.VITE_VUE_APP_GITHUB_TOKEN', import.meta.env);
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
