import { defineStore } from "pinia";
import { ref } from "vue";

export const useVisibilityStore = defineStore("visibility", () => {
    const isVisible = ref(true);
    const excludedRefs = ref<HTMLElement[]>([]); // Храним массив исключений

    const toggleVisibility = () => {
        isVisible.value = !isVisible.value;
    };

    const addExcludedRef = (el: HTMLElement) => {
        if (el && !excludedRefs.value.includes(el)) {
            excludedRefs.value.push(el);
        }
    };

    return { isVisible, toggleVisibility, excludedRefs, addExcludedRef };
});
