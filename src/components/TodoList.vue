<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Trash2, Plus, Check, X, Edit2 } from 'lucide-vue-next'

const todos = ref([])
const newTodoText = ref('')
const filter = ref('all') // all, active, completed
const editingId = ref(null)
const editText = ref('')

// Load from localStorage
onMounted(() => {
  const stored = localStorage.getItem('todos')
  if (stored) {
    try {
      todos.value = JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse todos', e)
    }
  }
})

// Save to localStorage
watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos))
}, { deep: true })

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter(t => !t.completed)
  if (filter.value === 'completed') return todos.value.filter(t => t.completed)
  return todos.value
})

const stats = computed(() => {
  const total = todos.value.length
  const completed = todos.value.filter(t => t.completed).length
  const active = total - completed
  return { total, completed, active }
})

const addTodo = () => {
  const text = newTodoText.value.trim()
  if (!text) return
  
  todos.value.push({
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  })
  newTodoText.value = ''
}

const removeTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id)
}

const toggleTodo = (todo) => {
  todo.completed = !todo.completed
}

const startEdit = (todo) => {
  editingId.value = todo.id
  editText.value = todo.text
}

const saveEdit = () => {
  if (!editingId.value) return
  const todo = todos.value.find(t => t.id === editingId.value)
  if (todo) {
    const trimmed = editText.value.trim()
    if (trimmed) {
      todo.text = trimmed
    } else {
      // If empty, remove? Or just revert? Let's remove if empty
      removeTodo(todo.id)
    }
  }
  editingId.value = null
  editText.value = ''
}

const cancelEdit = () => {
  editingId.value = null
  editText.value = ''
}

const clearCompleted = () => {
  if (confirm('确定要清除所有已完成的任务吗？')) {
    todos.value = todos.value.filter(t => !t.completed)
  }
}
</script>

<template>
  <section class="rounded-[28px] bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col h-[600px]">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h2 class="text-2xl font-semibold text-white/90">待办事项</h2>
      <div class="flex gap-2 text-xs md:text-sm bg-black/20 p-1 rounded-xl">
        <button 
          @click="filter = 'all'"
          class="px-3 py-1.5 rounded-lg transition-all"
          :class="filter === 'all' ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'"
        >全部</button>
        <button 
          @click="filter = 'active'"
          class="px-3 py-1.5 rounded-lg transition-all"
          :class="filter === 'active' ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'"
        >进行中</button>
        <button 
          @click="filter = 'completed'"
          class="px-3 py-1.5 rounded-lg transition-all"
          :class="filter === 'completed' ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'"
        >已完成</button>
      </div>
    </div>

    <!-- Input Area -->
    <div class="relative mb-6 group">
      <input 
        v-model="newTodoText"
        @keyup.enter="addTodo"
        type="text" 
        placeholder="添加新任务..." 
        class="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-5 pr-14 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-black/30 transition-all shadow-inner"
      />
      <button 
        @click="addTodo"
        class="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg"
        title="添加任务"
      >
        <Plus :size="20" />
      </button>
    </div>

    <!-- List Area -->
    <div class="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 custom-scrollbar">
      <TransitionGroup name="list">
        <div 
          v-for="todo in filteredTodos" 
          :key="todo.id" 
          class="group relative flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 md:p-4 transition-all duration-300"
          :class="{'opacity-60 bg-black/10': todo.completed}"
        >
          <!-- Checkbox -->
          <button 
            @click="toggleTodo(todo)"
            class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
            :class="todo.completed ? 'bg-indigo-500 border-indigo-500' : 'border-white/40 hover:border-indigo-400'"
          >
            <Check v-if="todo.completed" :size="14" class="text-white" />
          </button>

          <!-- Text Content -->
          <div class="flex-1 min-w-0">
             <div v-if="editingId === todo.id" class="flex items-center gap-2">
                <input 
                  type="text" 
                  v-model="editText"
                  @keyup.enter="saveEdit"
                  @keyup.esc="cancelEdit"
                  ref="editInput"
                  class="w-full bg-black/40 text-white px-2 py-1 rounded focus:outline-none border border-indigo-500/50"
                  autoFocus
                />
                <button @click="saveEdit" class="text-green-400 hover:bg-green-400/20 p-1 rounded"><Check :size="16"/></button>
                <button @click="cancelEdit" class="text-red-400 hover:bg-red-400/20 p-1 rounded"><X :size="16"/></button>
             </div>
             <span 
                v-else 
                class="block truncate text-sm md:text-base cursor-pointer select-none transition-colors"
                :class="todo.completed ? 'line-through text-white/40' : 'text-white/90'"
                @dblclick="startEdit(todo)"
             >
                {{ todo.text }}
             </span>
          </div>

          <!-- Actions -->
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100" v-if="editingId !== todo.id">
            <button 
              @click="startEdit(todo)"
              class="p-2 text-white/40 hover:text-indigo-300 hover:bg-white/5 rounded-lg transition-colors"
              title="编辑"
            >
              <Edit2 :size="16" />
            </button>
            <button 
              @click="removeTodo(todo.id)"
              class="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </TransitionGroup>
      
      <div v-if="filteredTodos.length === 0" class="flex flex-col items-center justify-center h-40 text-white/30 space-y-2">
        <div class="text-4xl">📝</div>
        <p>没有找到相关任务</p>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs md:text-sm text-white/50">
      <span>{{ stats.active }} 个待办事项</span>
      <button 
        v-if="stats.completed > 0"
        @click="clearCompleted" 
        class="hover:text-red-300 hover:underline transition-colors"
      >
        清除已完成
      </button>
    </div>
  </section>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* List Transitions */
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
