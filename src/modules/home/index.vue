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
import { ArrowRightLeft, Volume2 } from 'lucide-vue-next'
import type { languages } from '@/shared/types/translate.type'
import { supabase } from '@/shared/api/supabase'
import SelectLang from './components/selectLang.vue'

// TRANSLATE TEXT
const sourceText = ref('')
const translatedText = ref('')
const isLoading = ref(false)

const sourceLang = ref('')
const targetLang = ref('en')

const translateText = async () => {
	try {
		isLoading.value = true

		const res = await unseTranslate.translateText(
			sourceLang.value,
			targetLang.value,
			sourceText.value
		)

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
}, 500)

const isRotated = ref(false)

const switchLangs = () => {
	isRotated.value = !isRotated.value

	const copy = sourceLang.value

	sourceLang.value = targetLang.value
	targetLang.value = copy
}
</script>

<template>
	<section>
		<div class="container mt-15">
			<!-- TITLE -->
			<h1 class="text-5xl dark:text-white font-extrabold text-primary">
				Welcome back, user!
			</h1>
			<!-- TRANSLATE AREA -->
			<div class="flex items-start gap-3 mt-7">
				<div class="w-full">
					<SelectLang @sendLang="lang => (sourceLang = lang)" />
					<Textarea
						type="text"
						class="h-100 mt-3 dark:text-white placeholder:text-2xl resize-none !p-5 !text-2xl"
						placeholder="Start typing text to translate"
						v-model="sourceText"
						@input="debouncedFn"
					/>
				</div>
				<button
					class="cursor-pointer p-3 rounded-xl hover:bg-gray-700 duration-300"
					@click="switchLangs"
				>
					<ArrowRightLeft
						class="stroke-white duration-300"
						:class="{ 'rotate-180': isRotated === true }"
					/>
				</button>
				<div class="w-full">
					<SelectLang @sendLang="lang => (targetLang = lang)" />
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
