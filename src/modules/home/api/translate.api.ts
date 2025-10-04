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
		text: string,
		dl: string,
		sl?: string
	): Promise<TranslationResponse> {
		return axios
			.get(
				sl
					? `/api/translate?sl=${sl}&dl=${dl}&text=${text}`
					: `/api/translate?dl=${dl}&text=${text}`
			)
			.then(res => res.data)
	},
}
