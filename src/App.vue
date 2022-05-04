<script setup lang="ts">
import { useRoute } from 'vue-router';
import Alert from './components/Alert.vue';

const route = useRoute();
</script>

<template>
	<StarportCarrier>
		<Suspense>
			<Alert v-if="route.name !== 'Login'" />
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
