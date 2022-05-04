<script setup lang="ts">
import Alert from './components/Alert.vue';
</script>

<template>
	<StarportCarrier>
		<Suspense>
			<Alert />
		</Suspense>
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
