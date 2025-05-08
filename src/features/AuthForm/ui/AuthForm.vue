<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "~/entities/user/model/module/useUserStore";
import { useRouter } from "vue-router";
import styles from "./AuthForm.module.scss";
import CustomTextInput from "~/shared/ui/CustomTextinput/ui/CustomTextInput.vue";
import { ErrorText } from "~/shared/ui/ErrorText";
import CustomButton from "~/shared/ui/CustomButton/ui/CustomButton.vue";

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
    <CustomTextInput
        v-model="username"
        label="Имя пользователя"
        :error="submitted && !isUsernameValid ? 'Имя пользователя обязательно' : ''"
    />

    <CustomTextInput
        v-model="password"
        type="password"
        label="Пароль"
        :error="submitted && !isPasswordValid ? 'Пароль должен быть минимум 6 символов' : ''"
    />

    <ErrorText v-if="serverError" :error="serverError" />

    <CustomButton type="submit" :disabled="!isValid">
      Войти
    </CustomButton>

    <p :class="styles.registerLink">
      Нет аккаунта?
      <NuxtLink to="/registration" :class="styles.link">Зарегистрироваться</NuxtLink>
    </p>
  </form>
</template>
