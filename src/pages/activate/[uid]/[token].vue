<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { MainLayout } from "~/app/layouts";
import { useUserStore } from "~/entities/user/model/module/UserStore";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const uid = route.params.uid as string;
const token = route.params.token as string;
const success = ref(false);

userStore.ActivateUser(uid, token)
    .then(() => {
      success.value = true;
      router.push("/auth"); // Правильный способ перенаправления
    })
    .catch(() => {
      success.value = false;
    });
</script>

<template>
  <MainLayout>
    <div class="container">
      <h1 class="title">Подтверждение почты</h1>
      <p class="message" v-if="success">Ваш email успешно подтвержден!</p>
      <p class="message" v-else>Ваш email не подтвержден!</p>
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
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.message {
  font-size: 18px;
  margin-top: 10px;
}
</style>
