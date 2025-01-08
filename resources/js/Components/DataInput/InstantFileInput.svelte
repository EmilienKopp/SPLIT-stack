<!-- @migration-task Error while migrating Svelte code: migrating this component would require adding a `$props` rune but there's already a variable named props.
     Rename the variable and try again or migrate by hand. -->
<!-- @migration-task Error while migrating Svelte code: migrating this component would require adding a `$props` rune but there's already a variable named props.
     Rename the variable and try again or migrate by hand. -->
<script lang="ts">
  import DeleteButton from '$components/Display/DeleteButton.svelte';
  import DownloadLink from '$components/Navigation/DownloadLink.svelte';
  import { MediaHandler, type MediaForm, type MediaFormCollection, type MediaProp } from '$lib/domain/media/index';
  import { superUseForm } from '$lib/inertia/index';
  import { props } from '$lib/stores';
  import { twMerge } from 'tailwind-merge';

  export let label: string = '';
  export let name: MediaFormCollection;
  export let required: boolean = false;
  export let multiple: boolean = false;

  let form = superUseForm<MediaForm>({
    files: null,
    collection: name,
  });

  let existingFiles: MediaProp[] = [];
  $: if ($props[name]) {
    existingFiles = Array.isArray($props[name]) ? $props[name] : [$props[name]];
  }

  function handleFileUpload(event: Event) {
    // Somehow svelte's bind:files and on:change let the files be submitted before upload is complete
    const target = event.target as HTMLInputElement;
    $form.files = target.files;
    $form.post(route('media.upload'), {
      preserveScroll: true,
      onSuccess: () => {
        console.log('File uploaded successfully');
      },
      onError: () => {
        console.log('Failed to upload file');
      },
    });
  }
</script>

{#if existingFiles.length > 0}
  {#each existingFiles as existing}
    <div class="form-control w-full mb-4">
      <label class="label" for={$$restProps.id}>
        <span class="label-text flex items-center">
          {label}
          {#if required}
            <span
              class="text-error
              ml-1">*</span
            >
          {/if}
        </span>
      </label>
      <div class="flex items-center gap-4 justify-start">
        <span>{existing.file_name}</span>
        <DownloadLink href={route('media.download', { media: existing.id })} filename={existing.file_name}>
          Download
        </DownloadLink>
        <DeleteButton
          label="Delete"
          on:click={() => {
            MediaHandler.delete(existing.id);
            existingFiles = existingFiles.filter((file) => file.id !== existing.id);
          }}
        />
      </div>
    </div>
  {/each}
{:else}
  <div class="form-control w-full mb-4">
    {#if label}
      <label class="label" for={$$restProps.id}>
        <span class="label-text flex items-center">
          {label}
          {#if required}
            <span class="text-error ml-1">*</span>
          {/if}
        </span>
      </label>
    {/if}
    <div class="flex items-center gap-4 justify-start">
      <input
        class={twMerge(
          'file-input file-input-bordered file-input-primary w-full max-w-xs',
          $$restProps.class
        )}
        on:change={handleFileUpload}
        {...$$restProps}
        type="file"
        {multiple}
      />
      {#if $form.progress && $form.progress.percentage > 0}
        <div
          class="radial-progress text-primary"
          style="--value:{$form.progress.percentage};--size:3rem;"
          role="progressbar"
        >
          {$form.progress.percentage}%
        </div>
      {/if}
    </div>
    {#if Object.keys($form.errors).length > 0}
      <p class="text-error text-xs mt-1">
        {$form.errors?.files ?? ''}
      </p>
      <p class="text-error text-xs mt-1">
        {$form.errors?.collection ?? ''}
      </p>
    {/if}
  </div>
{/if}
