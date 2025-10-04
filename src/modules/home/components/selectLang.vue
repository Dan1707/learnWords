<script lang="ts" setup>
import { supabase } from '@/shared/api/supabase'
import { onMounted, ref, watch } from 'vue'
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

const props = defineProps<{
	currentLang: langObj
}>()

watch(
	() => props.currentLang,
	newVal => {
		if (!newVal || !newVal.id) {
			currentLang.value = null
		} else {
			currentLang.value = newVal
		}
	},
	{ deep: true }
)

onMounted(() => {
	currentLang.value = props.currentLang
})

const emit = defineEmits(['sendLang'])

interface langObj {
	id: string
	name: string
}

// GET LANGUAGES
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
const currentLang = ref<langObj | null>()
const currentLangFullName = ref('')
const searchingLang = ref('')

const searchLanguages = async () => {
	try {
		const { data, error } = await supabase
			.from('languages')
			.select('*')
			.ilike('name', `%${searchingLang.value}%`)

		langArr.value = data as langObj[]
	} catch (error) {
		console.log(`Error with searching languages: ${error}`)
	}
}

watch(currentLang, () => {
	emit('sendLang', currentLang.value)
})
</script>

<template>
	<Select v-model="currentLang">
		<SelectTrigger
			class="w-full dark:text-white dark:!placeholder:text-muted-foreground"
		>
			<SelectValue placeholder="Select a language">
				<p v-if="currentLang">
					{{ currentLang?.name }}
				</p>
			</SelectValue>
		</SelectTrigger>
		<SelectContent>
			<Input
				type="text"
				placeholder="search language"
				v-model="searchingLang"
				@input="searchLanguages"
				@keydown.stop
				class="sticky top-0"
			/>
			<div class="mt-3">
				<SelectItem v-for="langs in langArr" :key="langs.id" :value="langs">
					{{ langs.name }}
				</SelectItem>
			</div>
		</SelectContent>
	</Select>
</template>
