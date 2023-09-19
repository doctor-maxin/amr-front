<script lang="ts" setup>
import {markRaw} from "~/.nuxt/imports";

const list = markRaw([
	{
		id: 1,
		title: 'Неповторимый дизайн',
		text: `Создание мебели, имеющей уникальный дизайн, позволяет выделиться на фоне массового производства и предложить покупателям что-то уникальное и особенное.`,
		img: 'images/advantages/slide1.png'
	},
	{
		id: 2,
		title: 'Высокое качество изделий',
		text: `Компания, занимающаяся производством авторской мебели, как правило, использует только качественные материалы и оборудование, что гарантирует высокое качество выпускаемой продукции.`,
		img: 'images/advantages/slide3.png'
	},
	{
		id: 4,
		title: 'Эксклюзивность',
		text: `Мебель создается лимитированными сериями или в единственном экземпляре, что позволяет заказчику получить эксклюзивный продукт, не имеющий аналогов на рынке`,
		img: 'images/advantages/slide4.png'
	},
	{
		id: 3,
		title: 'Индивидуальный подход',
		text: `При производстве авторской мебели учитываются индивидуальные пожелания и требования покупателей, что позволяет создать мебель, идеально подходящую под их интерьер и стиль.`,
		img: 'images/advantages/slide2.png'
	},
])
</script>

<template>
	<section class="advantages lg:px-[4.37rem] overflow-x-clip">
		<h4 class="text-center subhead mb-1 lg:mb-0">
			ПРЕИМУЩЕСТВА</h4>
		<h2 class="mb-[1.4rem] lg:mb-[5.4rem] head">
			Автор мебельных решений это</h2>
		<div class="grid sm:grid-cols-2 items-start gap-9 px-4 lg:px-0 lg:gap-x-[6rem] lg:gap-y-0">
			<template
				v-for="(item, index) of list"
				:key="item.id"
			>
				<article class="flex flex-col relative advantage-item">
					<div class="relative lg:aspect-auto lg:max-w-[35rem] lg:max-h-[34rem]"
					:class="{
						'lg:mt-8': index % 2 === 0,
						'mx-auto lg:flex flex-col justify-center': index !== 0 && index % 2 === 0
					}">
						<img :src="item.img" class="w-full aspect-[21/13] lg:aspect-auto lg:h-full lg:max-h-[34rem]"/>
						<div
							class="glass -mt-[4rem] lg:relative lg:-translate-y-3/4 lg:mt-0 lg:left-0 lg:ml-[40%] z-10 lg:w-[34rem] lg:max-w-[max(0px,_28vw)] lg:max-h-[34rem] rounded-[1.25rem] gap-2 flex flex-col pt-[1.3rem] pl-[1.6rem] pr-[3.6rem] pb-[1.8rem]">
							<h3 class="font-extrabold leading-[140%]">{{ item.title }}</h3>
							<p class="leading-[140%] text-system-gray-900 text-sm">{{ item.text }}</p>
						</div>
					</div>
				</article>
			</template>
		</div>
	</section>
</template>

<style>
.advantages h2 {
	text-wrap: balance;

}

.advantages img {
	@apply rounded-[1.25rem] lg:object-contain ;
	width: 100%;
}
</style>