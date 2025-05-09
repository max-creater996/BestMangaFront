<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "~/entities/user/model/module/useUserStore";
import { useRouter } from "vue-router";

import styles from "./RegistrationForum.module.scss";
import {CustomTextInput} from "~/shared/ui/CustomTextinput";
import { ErrorText } from "~/shared/ui/ErrorText";
import CustomButton from "~/shared/ui/CustomButton/ui/CustomButton.vue";
import {toast} from "vue-sonner";

const userStore = useUserStore();
const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const submitted = ref(false);

const isEmailValid = computed(() => /\S+@\S+\.\S+/.test(email.value));
const isPasswordValid = computed(() => password.value.length >= 6);
const isConfirmPasswordValid = computed(() => password.value === confirmPassword.value);
const isNameValid = computed(() => name.value.trim().length > 0);
const isValid = computed(
    () => isEmailValid.value && isPasswordValid.value && isNameValid.value && isConfirmPasswordValid.value
);

const register = async () => {
  submitted.value = true;
  if (!isValid.value) return;

  try {
    await userStore.registerUser(email.value, name.value, password.value, confirmPassword.value);
    router.push("activate");
  } catch (error: any) {
    if (error.message === "Уже есть пользыватель с данным именем") {
      toast.error("Пользователь с таким именем уже существует");
    } else {
      toast.error(error.message || "Произошла ошибка при регистрации");
    }
  }
};
</script>

<template>
  <form @submit.prevent="register" :class="styles.form">
    <CustomTextInput
        v-model="name"
        label="Имя"
        :error="submitted && !isNameValid ? 'Имя обязательно' : ''"
    />

    <CustomTextInput
        v-model="email"
        type="email"
        label="Email"
        :error="submitted && !isEmailValid ? 'Некорректный email' : ''"
    />

    <CustomTextInput
        v-model="password"
        type="password"
        label="Пароль"
        :error="submitted && !isPasswordValid ? 'Пароль должен быть минимум 6 символов' : ''"
    />

    <CustomTextInput
        v-model="confirmPassword"
        type="password"
        label="Повторите пароль"
        :error="submitted && !isConfirmPasswordValid ? 'Пароли не совпадают' : ''"
    />

    <CustomButton type="submit" :disabled="!isValid">
      Зарегистрироваться
    </CustomButton>

    <p :class="styles.registerLink">
      Уже есть аккаунт?
      <NuxtLink to="/auth" :class="styles.link">Войти</NuxtLink>
    </p>
  </form>
</template>
