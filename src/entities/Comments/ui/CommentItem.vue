<script setup lang="ts">
import s from "./CommentsModal.module.scss";
import { defineProps, defineEmits, ref } from "vue";
import { useCommentStore } from "~/entities/Comments/model/module/useCommentStore";
import {CustomTextarea} from "~/shared/ui/CustomTextarea";

interface Comment {
  id: number;
  user: string;
  content: string;
  created_at: string;
  replies: Comment[];
  parent: number | null;
}

const props = defineProps<{ comment: Comment; replyingTo: number | null }>();
const emit = defineEmits(["startReply"]);

const commentStore = useCommentStore();
const localReplyingTo = ref<number | null>(null);
const replyContent = ref("");
const isSubmittingReply = ref(false);

const handleReply = () => {
  localReplyingTo.value = localReplyingTo.value === props.comment.id ? null : props.comment.id;
  emit("startReply", props.comment.id);
};

const submitReply = async () => {
  if (!replyContent.value.trim()) return;
  isSubmittingReply.value = true;

  try {
    await commentStore.addComment(replyContent.value, props.comment.id);
    replyContent.value = "";
    emit("startReply", null);
  } finally {
    isSubmittingReply.value = false;
  }
};
</script>

<template>
  <div :class="s.comment">
    <div :class="s.commentHeader">
      <p :class="s.commentUser">{{ comment.user }}</p>
      <p :class="s.commentDate">
        {{ new Date(comment.created_at).toLocaleString() }}
      </p>
    </div>
    <p :class="s.commentContent">{{ comment.content }}</p>
    <button :class="s.replyButton" @click="handleReply">Ответить</button>

    <!-- Поле для ответа -->
    <div v-if="replyingTo === comment.id" :class="s.replySection">
      <CustomTextarea
          v-model="replyContent"
          placeholder="Напишите ответ..."
          autoGrow
          maxHeight="150px"
      />
      <button
          :class="s.sendReply"
          @click="submitReply"
          :disabled="isSubmittingReply"
      >
        Отправить
      </button>
    </div>

    <!-- Вложенные комментарии -->
    <div v-if="comment.replies.length" :class="s.replies">
      <CommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          @startReply="emit('startReply', $event)"
          :replyingTo="replyingTo"
      />
    </div>
  </div>
</template>
