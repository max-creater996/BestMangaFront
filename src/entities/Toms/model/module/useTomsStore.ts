import { defineStore } from "pinia";
import { apiService } from "~/app/services/services";

interface TomsState {
    data: Array<{
        id: number;
        volume_number: number;
    }>;
    loading: boolean;
    error: string | null;
}

export const useTomsStore = defineStore("toms", {
    state: (): TomsState => ({
        data: [
            {
                id: 1,
                volume_number: 1
            }
        ],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchToms(slug: string) {
            this.loading = true;
            this.error = null;
            try {
                this.data = await apiService.get(`api/manga/${slug}/volumes/`);
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },
        async createVolume(slug: string, volumeNumber: number) {
            this.error = null;
            try {
                const response = await apiService.post(`api/manga/${slug}/volumes/`, {
                    volume_number: volumeNumber
                },{});
                this.data.push(response);
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            }
        },
        async deleteVolume(slug: string, volumeId: number) {
            this.error = null;
            await apiService.delete(`api/manga/${slug}/volumes/${volumeId}/`);
            this.data = this.data.filter(volume => volume.id !== volumeId);
            
        }
    }
});
