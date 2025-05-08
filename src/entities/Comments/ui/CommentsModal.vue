<script setup lang="ts">
import s from "./CommentsModal.module.scss";
import { useCommentStore } from "~/entities/Comments/model/module/useCommentStore";
import { useVisibilityStore } from "~/entities/useVisibilityNav/model/useVisibilityNavStore";
import { ref, watch, nextTick } from "vue";
import CommentItem from "~/entities/Comments/ui/CommentItem.vue";
import {CustomTextarea} from "~/shared/ui/CustomTextarea";
import CustomButton from "../../../shared/ui/CustomButton/ui/CustomButton.vue";


const commentStore = useCommentStore();
const visibilityStore = useVisibilityStore();
const modalRef = ref<HTMLElement | null>(null);

watch(
    () => commentStore.commentModal,
    async (isOpen) => {
      if (isOpen) {
        await nextTick();
        if (modalRef.value) {
          visibilityStore.addExcludedRef(modalRef.value);
        }
        commentStore.fetchComments();
      } else {
        if (modalRef.value) {
          visibilityStore.addExcludedRef(modalRef.value);
        }
      }
    }
);

const closeModal = () => {
  commentStore.commentBunble();
};

const replyingTo = ref<number | null>(null);
const newComment = ref("");
const isSubmitting = ref(false);

const startReply = (commentId: number) => {
  replyingTo.value = replyingTo.value === commentId ? null : commentId;
};

const addComment = async () => {
  if (!newComment.value.trim()) return;
  isSubmitting.value = true;

  await commentStore.addComment(newComment.value, null);

  newComment.value = "";
  isSubmitting.value = false;
};
</script>

<template>
  <Teleport to="body">
    <div v-if="commentStore.commentModal" :class="s.overlay" @click="closeModal">
      <div ref="modalRef" :class="s.modal" @click.stop>
        <CustomButton :class="s.closeButton" @click="closeModal" variant="outline">&times;</CustomButton>
        <h2>Комментарии</h2>
        <div :class="s.commentsContainer">
          <template v-if="commentStore.data.length">
            <CommentItem
                v-for="comment in commentStore.data"
                :key="comment.id"
                :comment="comment"
                @startReply="startReply"
                :replyingTo="replyingTo"
            />
          </template>
          <p v-else>Комментариев пока нет</p>
        </div>

        <div :class="s.commentForm">
          <CustomTextarea v-model="newComment" placeholder="Добавить комментарий..." autoGrow maxHeight="200px" />
          <CustomButton :class="s.sendComment" @click="addComment" :disabled="isSubmitting">Отправить</CustomButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
