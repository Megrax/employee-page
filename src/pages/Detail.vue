<script setup lang="ts">
import { useRoute } from 'vue-router';
import config from '../../employees.json';

const route = useRoute();

const employee = config.employees.find(
	(employee) => employee.id === route.params.id
);
console.log(employee);
</script>

<template>
	<div>Detail Page of {{ $route.params.id }}.</div>
</template>

<style></style>
