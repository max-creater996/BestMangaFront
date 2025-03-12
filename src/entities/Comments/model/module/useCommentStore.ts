import { defineStore } from "pinia";
import {apiService} from "~/app/services/services";

export const useCommentStore = defineStore("comment", {
    state: (): any => ({
        commentModal:false,
        commentPageID: 1,
        loading: true,
        error: null,
        data:[]
    }),
    actions: {
        async fetchComments() {
            this.loading = true;
            this.error = null;
            try {
                this.data = await apiService.get(`api/manga/${this.commentPageID}/comments`);
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },
        async addComment(content: string, parent: number | null) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiService.post(`api/manga/${this.commentPageID}/comments`, {
                    content: content,
                    parent: parent,
                });

                // If it's a reply to another comment
                if (parent !== null) {
                    // Find the parent comment in the data array
                    const findParentComment = (comments) => {
                        for (let i = 0; i < comments.length; i++) {
                            if (comments[i].id === parent) {
                                // Initialize replies array if it doesn't exist
                                if (!comments[i].replies) {
                                    comments[i].replies = [];
                                }
                                // Add the reply to the parent's replies
                                comments[i].replies.push(response);
                                return true;
                            }
                            // Check nested replies recursively
                            if (comments[i].replies && comments[i].replies.length > 0) {
                                if (findParentComment(comments[i].replies)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                    // Try to find and update the parent comment
                    if (!findParentComment(this.data)) {
                        // If parent not found (shouldn't happen), add to top level as fallback
                        console.warn("Parent comment not found, adding reply to top level");
                        this.data.unshift(response);
                    }
                } else {
                    // If it's a top-level comment, add it to the beginning of the data array
                    this.data.unshift(response);
                }

                return 0;
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        async commentBunble(){
            this.commentModal = !this.commentModal
        },
        async setcommentPageID(id: number) {
            this.commentPageID = id
        }
    },
});
