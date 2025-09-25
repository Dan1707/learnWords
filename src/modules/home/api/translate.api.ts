import type {
	languages,
	TranslationResponse,
} from '@/shared/types/translate.type'

import axios from 'axios'

export const unseTranslate = {
	async getLanguages(): Promise<languages> {
		return axios.get('/api/languages').then(res => res.data)
	},

	async translateText(
		sl: string,
		dl: string,
		text: string
	): Promise<TranslationResponse> {
		return axios
			.get(`/api/translate?sl=${sl}&dl=${dl}&text=${text}`)
			.then(res => res.data)
	},
}
