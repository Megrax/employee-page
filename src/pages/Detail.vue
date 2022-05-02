<script setup lang="ts">
import Avatar from 'vue-boring-avatars';
import { useRoute } from 'vue-router';
import config from '../../employees.json';
import InfoPair from '../components/InfoPair.vue';

const route = useRoute();

const employee = config.employees.find(
	(employee) => employee.id === route.params.id
);
</script>

<template>
	<section class="flex flex-col body-font">
		<div class="w-screen pt-24 flex flex-col items-center md:block">
			<div
				class="w-1/3 mb-10 md:mb-0 inline-flex items-center justify-center md:inline-block md:pl-40 lg:pl-48"
			>
				<Avatar
					variant="beam"
					:name="employee?.name"
					:square="true"
					class="flex-shrink-0 rounded-lg w-32 h-32 object-cover object-center"
				/>
			</div>
			<div
				class="w-1/2 inline-block flex-col md:items-start md:text-left items-center text-center pl-2 mb-8"
			>
				<h1
					class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900"
				>
					{{ employee?.name }}
				</h1>
				<p class="text-gray-600 mb-2 leading-relaxed">
					{{ employee?.bio }}
				</p>
			</div>
		</div>
		<div>
			<InfoPair
				v-for="[type, value] in Object.entries(employee?.detail ?? {})"
				:key="type"
				:type="type"
				:value="value"
			/>
		</div>
	</section>
</template>

<style></style>
