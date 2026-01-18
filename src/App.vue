<script setup>
import YearProgress from './components/YearProgress.vue'
import TodoList from './components/TodoList.vue'
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
    <div class="w-full max-w-2xl space-y-8">
      <YearProgress />
      <TodoList />
    </div>
  </main>
</template>
