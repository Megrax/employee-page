<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import Avatar from 'vue-boring-avatars';
import BtnGroup from '../components/BtnGroup.vue';
import config from '../../data.json';

const route = useRoute();
const router = useRouter();

const department = config.departments.find(
	(dep) => dep.name === route.params.name
);

const handleGoToMember = (id: string) => {
	router.push({
		name: 'Member',
		params: { id },
	});
};
</script>

<template>
	<section class="text-gray-600 body-font">
		<BtnGroup />
		<div class="container px-5 py-24 mx-auto">
			<div class="text-center mb-12">
				<h1
					class="sm:text-4xl text-3xl font-medium title-font text-gray-900 mb-4"
				>
					Department of {{ department?.name }}
				</h1>
				<p
					class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500s"
				>
					{{ department?.description }}
				</p>
				<div class="flex mt-16 justify-center">
					<div class="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
				</div>
			</div>
			<h1
				class="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-8"
			>
				Members
			</h1>
			<div class="grid grid-cols-4 gap-4 w-1/2 mx-auto">
				<Starport
					v-for="memberId in department?.members"
					:port="memberId"
					class="flex-shrink-0 rounded-lg w-32 h-32 object-cover object-center"
				>
					<Avatar
						variant="beam"
						:name="memberId"
						:square="true"
						@click="handleGoToMember(memberId)"
						class="flex-shrink-0 rounded-lg w-32 h-32 object-cover object-center hover:cursor-pointer"
					/>
				</Starport>
			</div>
		</div>
	</section>
</template>

<style></style>
