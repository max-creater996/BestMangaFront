<script setup lang="ts">
import { MainLayout } from "~/app/layouts";
</script>

<template>
  <MainLayout>
    <div class="container">
      <h1 class="title">Подтверждение почты</h1>
      <p class="message">Пожалуйста, подтвердите свой email. Вам на электронную почту пришло письмо с ссылкой.</p>
    </div>
  </MainLayout>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
}

.title {
  font-size: 26px;
  font-weight: bold;
  color: var(--color-white);
  margin-bottom: 10px;
}

.message {
  font-size: 18px;
  color: var(--color-white);
  max-width: 400px;
}
</style>
