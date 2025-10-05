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
import { onMounted, ref, watch, type Ref } from 'vue'
import { useDebounce, useDebounceFn } from '@vueuse/core'
import { ArrowRightLeft, Volume2 } from 'lucide-vue-next'
import type {
	languages,
	TranslationResponse,
} from '@/shared/types/translate.type'
import { supabase } from '@/shared/api/supabase'
import SelectLang from './components/selectLang.vue'

// FIND SINGLE LANGUAGE
const findSingleLang = async (
	langId: string,
	langVar: Ref<langObj | undefined>
) => {
	try {
		let { data, error } = await supabase
			.from('languages')
			.select('*')
			.eq('id', `${langId}`)

		if (data && data[0]) {
			langVar.value = data[0] as langObj
		}
	} catch (error) {
		console.log(error)
	}
}

// TRANSLATE TEXT
const sourceText = ref('')
const translatedText = ref('')
const isLoading = ref(false)

interface langObj {
	id: string
	name: string
}

const sourceLang = ref<langObj>()
const targetLang = ref<langObj>()

const translateText = async () => {
	try {
		isLoading.value = true

		if (sourceLang.value === undefined) {
			const res = await unseTranslate.translateText(
				sourceText.value,
				targetLang.value?.id as string
			)

			console.log(res)

			translatedText.value = res['destination-text']

			if (res['source-language']) {
				findSingleLang(res['source-language'], sourceLang)
			}
		} else {
			const res = await unseTranslate.translateText(
				sourceText.value,
				targetLang.value?.id as string,
				sourceLang.value?.id as string
			)

			translatedText.value = res['destination-text']
		}
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
}

const debouncedFn = useDebounceFn(() => {
	translateText()
}, 500)

// FIND USER DEVICE LANGUAGE
findSingleLang(navigator.language, targetLang)

// SWITCH LANGUAGES
const isRotated = ref(false)
const isDisabledReverse = ref(false)

const switchLangs = () => {
	const copy = sourceLang.value
	const copyText = sourceText.value

	if (copy) {
		isRotated.value = !isRotated.value
		sourceLang.value = targetLang.value
		targetLang.value = copy

		sourceText.value = translatedText.value
		translatedText.value = copyText
	}

	translateText()

	console.log(sourceLang.value, targetLang.value)
}

watch(isDisabledReverse, () => {
	if (sourceLang.value !== undefined || sourceLang.value !== 0) {
		isDisabledReverse.value = false
	} else {
		isDisabledReverse.value = true
	}
})

watch(sourceText, () => {
	if (sourceText.value.length === 0) {
		sourceLang.value = { name: '', id: '' }
	}
})

const isSourceLangChosen = ref(false)

watch(isSourceLangChosen, () => {
	console.log(isSourceLangChosen.value)
})

// PLAY AUDIO WITH WEB SPEECH API
const playAudio = () => {
	if ('speechSynthesis' in window && translatedText.value) {
		window.speechSynthesis.cancel()

		const utterance = new SpeechSynthesisUtterance(translatedText.value)

		utterance.lang = targetLang.value?.id || 'uk-UA'

		utterance.rate = 0.9

		utterance.volume = 1

		window.speechSynthesis.speak(utterance)
	} else {
		console.error('Web Speech API не підтримується цим браузером')
	}
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
					<SelectLang
						:currentLang="sourceLang as langObj"
						@sendLang="
							lang => {
								sourceLang = lang
							}
						"
					/>
					<Textarea
						type="text"
						class="h-100 mt-3 dark:text-white placeholder:text-2xl resize-none !p-5 !text-2xl"
						placeholder="Start typing text to translate"
						v-model="sourceText"
						@input="debouncedFn"
					/>
				</div>
				<button
					class="cursor-pointer p-3 rounded-xl hover:bg-gray-700 duration-300 disabled:opacity-50 disabled:cursor-auto"
					@click="switchLangs"
					:disabled="isDisabledReverse"
				>
					<ArrowRightLeft
						class="stroke-white duration-300"
						:class="{ 'rotate-180': isRotated === true }"
					/>
				</button>
				<div class="w-full">
					<SelectLang
						:currentLang="targetLang as langObj"
						@sendLang="lang => (targetLang = lang)"
					/>
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
							@click="playAudio"
						>
							<Volume2 class="stroke-white w-8 h-8" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
