import { defineStore } from "pinia";

export const useProfileStore = defineStore("ProfileNav", {
    state: () => ({
        activeTab: "main",
    }),
    actions: {
        setActiveTab(tab: string) {
            this.activeTab = tab;
        },
    },
});
