import { UploadFileResponse } from './interfaces/upload-file-response';
import { EarnAllianceBaseClient } from 'src/base';

export class EarnAllianceUploadClient extends EarnAllianceBaseClient {
    async upload(endpoint: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const {
            data: { path },
        } = await this.uploadClient.post<UploadFileResponse>(endpoint, formData);
        return path;
    }

    async uploadGameImage(file: File, gameId: string) {
        this.upload(`/games/${gameId}/images`, file);
    }
    async uploadGameVideo(file: File, gameId: string) {
        this.upload(`/games/${gameId}/videos`, file);
    }

    async uploadUserProfilePicture(userId: string, file: Blob) {
        const formData = new FormData();
        formData.append('file', file);
        const {
            data: { path },
        } = await this.uploadClient.post<UploadFileResponse>(`/users/${userId}/profile-pic`, formData);
        return path;
    }
}
