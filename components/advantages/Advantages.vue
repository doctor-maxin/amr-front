<script lang="ts" setup>
import { useAppConfig, useAsyncData, useDirectusItems } from "~/.nuxt/imports";
import { IAdvantage } from "~/types/common";

const { getItems } = useDirectusItems();
const appConfig = useAppConfig();

const { data: list } = useAsyncData("advantages", () =>
	getItems<IAdvantage>({
		collection: "advantages",
		params: {
			fields: ["image.*", "id", "title", "description"],
		},
	})
);

const getItemImage = (item: any): string => {
	if (item?.image?.id) return item?.image?.id;
	return appConfig.noImageId as string;
};
</script>

<template>
	<section class="advantages lg:px-[4.37rem] lg:-mb-[7rem] overflow-x-clip">
		<h4 class="text-center subhead mb-1 lg:mb-0">ПРЕИМУЩЕСТВА</h4>
		<h2 class="mb-[1.4rem] lg:mb-[5.4rem] head">
			Автор мебельных решений это
		</h2>
		<suspense>
			<div
				class="grid sm:grid-cols-2 max-w-[110rem] mx-auto items-start gap-9 px-4 lg:px-0 lg:gap-x-[6rem] lg:gap-y-0">
				<template v-for="(item, index) of list" :key="item?.id">
					<article v-if="item" class="flex flex-col relative advantage-item">
						<div class="relative lg:aspect-auto lg:max-w-[35rem] lg:max-h-[34rem]" :class="{
							'lg:mt-8': index % 2 === 0,
							'mx-auto lg:flex flex-col justify-center':
								index !== 0 && index % 2 === 0,
						}">
							<NuxtImg format="webp" placeholder loading="lazy" provider="directus" :src="getItemImage(item)"
								sizes="100vw sm:400px lg:800px 2xl:1200px"
								class="w-full aspect-[21/13] lg:aspect-auto lg:h-full lg:max-h-[34rem]" />
							<div
								class="glass -mt-[4rem] lg:relative lg:-translate-y-3/4 lg:mt-0 lg:left-0 lg:ml-[40%] z-10 lg:w-[34rem] lg:max-w-[max(0px,_28vw)] lg:max-h-[34rem] rounded-[1.25rem] gap-2 flex flex-col pt-[1.3rem] pl-[1.6rem] pr-[3.6rem] pb-[1.8rem]">
								<h3 class="font-extrabold leading-[140%]">
									{{ item.title }}
								</h3>
								<p class="leading-[140%] text-system-gray-900 text-sm">
									{{ item.description }}
								</p>
							</div>
						</div>
					</article>
				</template>
			</div>
		</suspense>
	</section>
</template>

<style>
.advantages h2 {
	text-wrap: balance;
}

.advantages img {
	@apply rounded-[1.25rem] lg:object-contain;
	width: 100%;
}
</style>
