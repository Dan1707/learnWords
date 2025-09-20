<script lang="ts" setup>
import Switch from '@ui/switch/Switch.vue'
import { Languages, Moon, Sun } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'

const isDarkTheme = ref(false)

onMounted(() => {
	const prefersDarkMode = window.matchMedia(
		'(prefers-color-scheme: dark)'
	).matches

	isDarkTheme.value = prefersDarkMode
})

const app = document.querySelector('#app') as HTMLDivElement
watch(isDarkTheme, newVal => {
	if (newVal) {
		app.classList.add('dark')
	} else {
		app.classList.remove('dark')
	}
})
</script>

<template>
	<div class="wfull min-h-screen flex flex-col bg-white dark:bg-gray-900">
		<!-- HEADER -->
		<header>
			<div class="container py-4 flex items-center justify-between">
				<!-- LOGO -->
				<h3
					class="font-bold text-2xl text-primary flex items-center gap-2 cursor-pointer select-none"
				>
					<Languages />
					learnWords
				</h3>
				<!-- NAVIGATION -->
				<nav class="w-full max-w-[200px]">
					<ul class="w-full flex items-center justify-between gap-2.5">
						<li
							class="text-lg font-semibold dark:text-white cursor-pointer select-none"
						>
							Home
						</li>
						<li
							class="text-lg font-semibold dark:text-white cursor-pointer select-none"
						>
							Practice
						</li>
					</ul>
				</nav>
				<!-- SWITCH THEME -->
				<div class="flex items-center gap-5">
					<Sun v-if="!isDarkTheme" class="dark:stroke-white stroke-primary" />
					<Moon v-else class="dark:stroke-white stroke-primary" />
					<Switch v-model="isDarkTheme" class="scale-150" />
				</div>
			</div>
		</header>
		<main>
			<RouterView></RouterView>
		</main>
		<footer></footer>
	</div>
</template>
