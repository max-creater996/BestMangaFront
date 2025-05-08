<script setup>
import styles from './ProfileHeader.module.scss';
import {useUserStore} from "~/entities/user/model/module/useUserStore.ts";
import {Avatar, UserInfo} from "~/entities/user/ui/index.js";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
  <div :class="styles.profileHeader">
    <Avatar :avatar_img="user?.avatar_img" />
    <UserInfo :username="user?.username || 'Гость'" :last_seen="user?.last_seen || 'Нет данных'" />
  </div>
</template>
