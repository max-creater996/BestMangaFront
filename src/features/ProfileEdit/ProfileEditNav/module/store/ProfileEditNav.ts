import { defineStore } from "pinia";

export const useProfileEditStore = defineStore("ProfileEditNav", {
    state: () => ({
        activeTab: "manga",
    }),
    actions: {
        setActiveTab(tab: string) {
            this.activeTab = tab;
        },
    },
});
