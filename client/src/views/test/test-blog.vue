<template>
  <p>TEST page</p>
  <ModeToggleButton />

  <p>currentRouteName: {{ currentRouteName }}</p>
  <APostCard v-for="post in postList" :key="post.id" :post="post" />
</template>

<script setup lang="ts">
import ModeToggleButton from '@/components/ModeToggleButton.vue'
import APostCard from '@/components/APostCard.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const postList = [
  {
    id: '213467234',
    title: 'First Blog!',
    description: "This is my first blog! I'm using Vue3.",
    postAt: '1689127865',
    img: '',
  },
  {
    id: '782346738',
    title: 'Second Blog!',
    description: 'This is my Second blog! It has a img for showing.',
    postAt: '1689187406',
    editAt: '1689319006',
    img: '../assets/images/1.png',
  },
  {
    id: '96867889',
    title: 'test Blog11!',
    description:
      'This desc is very long: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam dolorem recusandae cumque esse eligendi aliquid aut mollitia natus, eos nihil, eum fugit, incidunt sunt illum accusantium. Ipsa tempore esse officia, quia nesciunt enim doloremque? Ad, repudiandae. Id et minima veritatis. Aspernatur nisi voluptate doloremque beatae, non vitae repellat similique ab!',
    postAt: '1686754865',
    img: '',
  },
  {
    id: '890675343',
    title:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, reprehenderit ducimus iusto temporibus iste veritatis repellat.',
    description:
      'This title/desc are very long: Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores facilis porro suscipit ad officiis blanditiis? Quia assumenda asperiores saepe voluptatem? Saepe sed minus, a provident voluptatem explicabo vitae impedit quaerat?',
    postAt: '1689187665',
    img: '../assets/images/1.png',
  },
]

const route = useRoute()
const currentRouteName = computed(() => route.name)
</script>

<style scoped lang="scss"></style>
