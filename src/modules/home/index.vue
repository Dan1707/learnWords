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
import type { languages } from '@/shared/types/translate.type'
import { supabase } from '@/shared/api/supabase'

// GET LANGUAGES
interface langObj {
	id: string
	name: string
}

const langArr = ref<langObj[]>([])
const getLanguages = async () => {
	try {
		const { data, error } = await supabase.from('languages').select('*')

		langArr.value = data as langObj[]
	} catch (error) {
		console.log(`Error with fetching languages: ${error}`)
	}
}

getLanguages()

// SEARCH LANGUAGES
const searchingLang = ref('')

const searchLanguages = async () => {
	try {
		const { data, error } = await supabase
			.from('languages')
			.select('*')
			.ilike('name', `%${searchingLang.value}%`)

		langArr.value = data as langObj[]

		console.log(data)
	} catch (error) {
		console.log(`Error with searching languages: ${error}`)
	}
}

// TRANSLATE TEXT
const sourceText = ref('')
const translatedText = ref('')
const isLoading = ref(false)
const targetLang = ref('')

const translateText = async () => {
	try {
		isLoading.value = true

		const res = await unseTranslate.translateText('de', 'uk', sourceText.value)

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

watch([sourceText, translatedText], () => {
	if (sourceText.value.length === 0) {
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
						<SelectContent class="dark:bg-gray-900">
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
					<Select v-model="targetLang">
						<SelectTrigger
							class="w-full dark:text-white dark:!placeholder:text-muted-foreground"
						>
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent class="dark:bg-gray-900 relative" @keydown.stop>
							<Input
								type="text"
								placeholder="search language"
								v-model="searchingLang"
								@input="searchLanguages"
								@keydown.stop
								class="sticky top-0"
							/>
							<div class="mt-3">
								<SelectItem
									v-for="langs in langArr"
									:key="langs.id"
									class="p-2 cursor-pointer"
									:value="langs.id"
								>
									{{ langs.name }}
								</SelectItem>
							</div>
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
