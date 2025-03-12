<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "~/entities/user/model/module/UserStore";
import { useRouter } from "vue-router";
import styles from "./AuthForm.module.scss";
import ErrorText from "~/shared/ui/ErorText/ui/ErrorText.vue";

const userStore = useUserStore();
const router = useRouter();
const username = ref("");
const password = ref("");
const submitted = ref(false);
const serverError = ref("");

const isUsernameValid = computed(() => username.value.trim().length > 0);
const isPasswordValid = computed(() => password.value.length >= 6);
const isValid = computed(() => isUsernameValid.value && isPasswordValid.value);

const login = async () => {
  submitted.value = true;
  serverError.value = "";
  if (!isValid.value) return;

  try {
    await userStore.LoginUser(username.value, password.value);
    router.push("/");
  } catch (error: any) {
    serverError.value = error?.response?.data?.message || "Ошибка авторизации. Попробуйте снова.";
  }
};
</script>

<template>
  <form @submit.prevent="login" :class="styles.form">
    <label :class="styles.label">Имя пользователя</label>
    <input v-model.trim="username" type="text" :class="styles.input" />
    <ErrorText v-if="submitted && !isUsernameValid" message="Имя пользователя обязательно" />

    <label :class="styles.label">Пароль</label>
    <input v-model.trim="password" type="password" :class="styles.input" />
    <ErrorText v-if="submitted && !isPasswordValid" message="Пароль должен быть минимум 6 символов" />

    <ErrorText v-if="serverError" :message="serverError" />

    <button type="submit" :disabled="!isValid" :class="[styles.button, { [styles.disabled]: !isValid }]">
      Войти
    </button>

    <p :class="styles.registerLink">
      Нет аккаунта?
      <NuxtLink to="/registration" :class="styles.link">Зарегистрироваться</NuxtLink>
    </p>
  </form>
</template>
