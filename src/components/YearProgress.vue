<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const percent = ref(0)
const currentYear = new Date().getFullYear()

const updateProgress = () => {
  const now = new Date()
  const year = now.getFullYear()
  const start = new Date(year, 0, 1) // Jan 1st
  const end = new Date(year + 1, 0, 1) // Jan 1st next year
  const total = end - start
  const elapsed = now - start
  
  const p = (elapsed / total) * 100
  percent.value = Math.min(Math.max(p, 0), 100).toFixed(6)
}

let timer
onMounted(() => {
  updateProgress()
  timer = setInterval(updateProgress, 100)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="relative overflow-hidden rounded-[28px] bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 text-center shadow-2xl transition-transform hover:scale-[1.01] duration-500">
    <h1 class="mb-4 text-2xl md:text-4xl font-semibold tracking-wide text-white/90">
      {{ currentYear }} 年已经过去
    </h1>
    <div class="relative z-10">
      <p class="text-[3.5rem] md:text-[5rem] font-bold tracking-tight leading-none text-white animate-pulse-slow tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        {{ percent }}%
      </p>
    </div>
    <div class="mt-6 text-sm md:text-base font-medium tracking-[0.3em] uppercase text-white/60">
      每秒自动更新
    </div>
    
    <!-- Decorative background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
  </section>
</template>
