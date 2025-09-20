import { createRouter, createWebHistory } from 'vue-router'
import home from '@/modules/home/index.vue'
import defaultLayout from '@/shared/layouts/defautLayout.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			name: 'default',
			component: defaultLayout,
			path: '/',
			children: [
				{
					name: 'home',
					component: home,
					path: '/',
				},
			],
		},
	],
})

export default router
