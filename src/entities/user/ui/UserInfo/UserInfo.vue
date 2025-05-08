<script setup>
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './UserInfo.module.scss';

const props = defineProps({
  username: String,
  last_seen: String
});

const timeAgo = (isoString) => {
  if (!isoString) return 'Неизвестно';

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Некорректная дата';

  return `${formatDistanceToNow(date, { locale: ru, addSuffix: true })}`;
};
</script>

<template>
  <div :class="styles.info">
    <h2 :class="styles.username">{{ username }}</h2>
    <p :class="styles.lastSeen">{{ timeAgo(last_seen) }}</p>
  </div>
</template>
