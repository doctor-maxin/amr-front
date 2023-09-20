<script setup lang="ts"></script>

<template>
	<div class="absolute flex-1 items-center w-full h-full flex justify-center">
		<div class="wrapper">
			<span class="circle circle-1"></span>
			<span class="circle circle-2"></span>
			<span class="circle circle-3"></span>
			<span class="circle circle-4"></span>
			<span class="circle circle-5"></span>
			<span class="circle circle-6"></span>
			<span class="circle circle-7"></span>
			<span class="circle circle-8"></span>
		</div>
	</div>
</template>

<style>
.nuxt-loading-indicator {
	background: white !important;
}
</style>
<style scoped>
.wrapper {
	display: flex;
	height: 65px;
	justify-content: center;
}
.circle {
	display: inline-block;
	width: 15px;
	height: 15px;
	background-color: hsl(273, 68%, 85%);
	border-radius: 50%;
	animation: loading 1.5s cubic-bezier(0.8, 0.5, 0.2, 1.4) infinite;
	transform-origin: bottom center;
	position: relative;
}
@keyframes loading {
	0% {
		transform: translateY(0px);
		background-color: hsl(273, 68%, 85%);
	}
	50% {
		transform: translateY(50px);
		background-color: hsla(273, 66%, 56%, 1);
	}
	100% {
		transform: translateY(0px);
		background-color: hsl(273, 68%, 85%);
	}
}
.circle-1 {
	animation-delay: 0.1s;
}
.circle-2 {
	animation-delay: 0.2s;
}
.circle-3 {
	animation-delay: 0.3s;
}
.circle-4 {
	animation-delay: 0.4s;
}
.circle-5 {
	animation-delay: 0.5s;
}
.circle-6 {
	animation-delay: 0.6s;
}
.circle-7 {
	animation-delay: 0.7s;
}
.circle-8 {
	animation-delay: 0.8s;
}
</style>
