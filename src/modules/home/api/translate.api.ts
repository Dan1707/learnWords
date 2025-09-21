import type {
	languages,
	TranslationResponse,
} from '@/shared/types/translate.type'

import axios from 'axios'

export const unseTranslate = {
	async getLanguages(): Promise<languages | void> {
		return axios.get('/api/languages').then(res => console.log(res.data))
	},
}
