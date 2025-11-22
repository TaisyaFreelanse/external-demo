<script setup lang="ts">
// Автоматический редирект на страницу создания/загрузки ивентов
definePageMeta({
  layout: false
})

// Выполняем редирект сразу при загрузке компонента
navigateTo('/demo/external-upload', { redirectCode: 301 })
</script>

<template>
  <div style="padding: 40px; text-align: center;">
    <p>Перенаправление...</p>
  </div>
</template>
  