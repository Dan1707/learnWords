export interface TranslationResponse {
	'source-language': string
	'source-text': string
	'destination-language': string
	'destination-text': string
	pronunciation: {
		'source-text-phonetic': string
		'source-text-audio': string
		'destination-text-audio': string
	}
	translations: {
		'all-translations': [string, string[]][]
		'possible-translations': string[]
		'possible-mistakes': string[] | null
	}
	definitions: Definition[]
	'see-also': string[] | null
}

export interface Definition {
	'part-of-speech': string
	definition: string
	example: string
	'other-examples': string[] | null
	synonyms: Record<string, string[]> | null
}

export interface languages {
	data: string[]
}
