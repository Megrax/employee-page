<script setup lang="ts">
import BriefCard from '../components/BriefCard.vue';
import config from '../../data.json';
</script>

<template>
	<section class="text-gray-600 body-font">
		<div class="container px-5 mx-auto">
			<div class="flex flex-col text-center w-full mb-20">
				<h1 class="text-2xl font-medium title-font mb-4 text-gray-900">
					{{ config.title }}
				</h1>
				<p class="lg:w-2/3 mx-auto leading-relaxed text-base">
					{{ config.teamSlogan }}
				</p>
			</div>
			<div class="flex flex-wrap -m-4">
				<BriefCard
					v-for="employee in config.employees"
					:id="employee.id"
					:name="employee.name"
					:bio="employee.bio"
					:position="employee.position"
					:dep="employee.department"
					:key="employee.name"
				/>
			</div>
		</div>
	</section>
</template>
