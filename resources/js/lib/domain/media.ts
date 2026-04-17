import { router } from '@inertiajs/svelte';

export type MediaFormCollection =
  | 'cv'
  | 'video_introduction'
  | 'other_documents';

export type MediaForm = {
  files: FileList | null;
  collection: MediaFormCollection;
};

export type MediaProp = {
  id: number;
  url: string;
  file_name: string;
}

export class MediaHandler {

  public static download(media_id: number) {
    router.get(route('media.download', media_id));
  }

  public static delete(media_id: number) {
    router.delete(route('media.destroy', {media: media_id}), {
      preserveScroll: true,
      preserveState: true,
    });
  }
}