<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "~/entities/user/model/module/UserStore";
import { useRouter } from "vue-router";

import styles from "./RegistrationForum.module.scss";
import ErrorText from "~/shared/ui/ErorText/ui/ErrorText.vue";


const userStore = useUserStore();
const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const submitted = ref(false);
const serverError = ref("");

const isEmailValid = computed(() => /\S+@\S+\.\S+/.test(email.value));
const isPasswordValid = computed(() => password.value.length >= 6);
const isConfirmPasswordValid = computed(() => password.value === confirmPassword.value);
const isNameValid = computed(() => name.value.trim().length > 0);
const isValid = computed(
    () => isEmailValid.value && isPasswordValid.value && isNameValid.value && isConfirmPasswordValid.value
);

const register = async () => {
  submitted.value = true;
  serverError.value = "";
  if (!isValid.value) return;

  try {
    await userStore.registerUser(email.value, name.value, password.value, confirmPassword.value);
    router.push("activate");
  } catch (error: any) {
    serverError.value = error?.response?.data?.message || "Ошибка регистрации";
  }
};
</script>

<template>
  <form @submit.prevent="register" :class="styles.form">
    <label :class="styles.label">Имя</label>
    <input v-model="name" type="text" :class="styles.input" />
    <ErrorText v-if="submitted && !isNameValid" message="Имя обязательно" />

    <label :class="styles.label">Email</label>
    <input v-model="email" type="email" :class="styles.input" />
    <ErrorText v-if="submitted && !isEmailValid" message="Некорректный email" />

    <label :class="styles.label">Пароль</label>
    <input v-model="password" type="password" :class="styles.input" />
    <ErrorText v-if="submitted && !isPasswordValid" message="Пароль должен быть минимум 6 символов" />

    <label :class="styles.label">Повторите пароль</label>
    <input v-model="confirmPassword" type="password" :class="styles.input" />
    <ErrorText v-if="submitted && !isConfirmPasswordValid" message="Пароли не совпадают" />

    <ErrorText v-if="serverError" :message="serverError" />

    <button type="submit" :disabled="!isValid" :class="[styles.button, { [styles.disabled]: !isValid }]">
      Зарегистрироваться
    </button>

    <p :class="styles.registerLink">
      Уже есть аккаунт?
      <NuxtLink to="/auth" :class="styles.link">Войти</NuxtLink>
    </p>
  </form>
</template>
