<template>
	<div class="flex flex-col gap-2">
		<h4 class="text-2xl">{{ point.name }}</h4>
		<span class="mb-2 text-base">{{ point.address }}</span>
		<UiButton
			@click="selectPoint(point)"
			variant="empty"
			type="button"
			title="Выбрать"
			title-class="text-lg"
		/>
	</div>
</template>

<script>
import UiButton from "../../ui/UiButton.vue";

export default {
	name: "CheckoutSelfDeliveryBalloon",
	components: { UiButton },
	props: {
		point: {
			type: Object,
		},
	},
	methods: {
		selectPoint(point) {
			useEvent('setDeliveryPoint', point)
		}
	}
};
</script>

<style scoped></style>
