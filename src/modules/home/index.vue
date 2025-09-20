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
</script>

<template>
	<section>
		<div class="container mt-15">
			<h1 class="text-5xl dark:text-white font-extrabold text-primary">
				Welcome back, user!
			</h1>
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
					<Textarea
						type="text"
						class="h-100 mt-3 dark:text-white placeholder:text-2xl resize-none !p-5 !text-2xl"
						readonly
					/>
				</div>
			</div>
		</div>
	</section>
</template>
