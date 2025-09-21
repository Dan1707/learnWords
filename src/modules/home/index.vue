<script lang="ts" setup>
import Textarea from '@/shared/components/ui/textarea/Textarea.vue'
import Input from '@ui/input/Input.vue'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@ui/select'
import { unseTranslate } from './api/translate.api'
import { ref, watch } from 'vue'
import { useDebounce, useDebounceFn } from '@vueuse/core'
import { Volume2 } from 'lucide-vue-next'

// GET LANGUAGES
unseTranslate.getLanguages()

// TRANSLATE TEXT
const sourceText = ref('')
const translatedText = ref('')
const isLoading = ref(false)

const translateText = async () => {
	try {
		isLoading.value = true

		const res = await unseTranslate.translateText('uk', 'en', sourceText.value)

		console.log(res)

		translatedText.value = res['destination-text']
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
}

const debouncedFn = useDebounceFn(() => {
	translateText()
}, 200)

watch([sourceText, translatedText], () => {
	if (sourceText.value.length === 0) {
		translatedText.value = ''
	}
})

watch(isLoading, () => {
	if (isLoading.value) {
		translatedText.value = ''
	}
})
</script>

<template>
	<section>
		<div class="container mt-15">
			<!-- TITLE -->
			<h1 class="text-5xl dark:text-white font-extrabold text-primary">
				Welcome back, user!
			</h1>
			<!-- TRANSLATE AREA -->
			<div class="flex items-center gap-5 mt-7">
				<div class="w-full">
					<Select>
						<SelectTrigger class="w-full">
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Fruits</SelectLabel>
								<SelectItem value="apple"> Apple </SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Textarea
						type="text"
						class="h-100 mt-3 dark:text-white placeholder:text-2xl resize-none !p-5 !text-2xl"
						placeholder="Start typing text to translate"
						v-model="sourceText"
						@input="debouncedFn"
					/>
				</div>
				<div class="w-full">
					<Select>
						<SelectTrigger class="w-full">
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent>
							<Input />
						</SelectContent>
					</Select>
					<div class="relative">
						<Textarea
							type="text"
							placeholder="Translation"
							class="h-100 mt-3 dark:text-white placeholder:text-2xl resize-none !p-5 !text-2xl"
							v-model="translatedText"
							readonly
						/>
						<div
							role="status"
							class="inline-block absolute top-1/2 left-1/2 -translate-1/2"
							v-if="isLoading"
						>
							<div
								class="w-15 h-15 border-5 border-transparent border-t-primary rounded-full animate-spin"
							></div>
						</div>
						<button
							v-if="translatedText.length !== 0"
							class="absolute bottom-5 right-5 cursor-pointer"
						>
							<Volume2 class="stroke-white w-8 h-8" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
