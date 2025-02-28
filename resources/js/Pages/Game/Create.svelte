<script lang="ts">
  import InputLabel from '$components/DataInput/InputLabel.svelte';
  import Select from '$components/DataInput/Select.svelte';
  import AuthenticatedLayout from '$layouts/AuthenticatedLayout.svelte';
  import { asSelectOptions } from '$lib/utils/formatting';
  import type { WordPair } from '$models';
  import { useForm } from '@inertiajs/svelte';

  const languages = ['EN', 'JP'] as const;

  let form = useForm({
    name: '',
    description: '',
    source_language: 'EN',
    target_language: 'JP',
    word_pairs: [
      {
        source_word: '',
        target_word: '',
        source_language: '',
        target_language: '',
      },
    ],
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    $form.word_pairs = $form.word_pairs
      .filter((pair: WordPair) => pair.source_word && pair.target_word)
      .map((pair: WordPair) => ({
        ...pair,
        source_language: $form.source_language,
        target_language: $form.target_language,
      }));
    $form.post(route('game.store'));
  }

  $inspect($form);
</script>

<AuthenticatedLayout>
  <div class="w-11/12 mx-auto bg-white rounded-md p-4">
    <h1 class="text-xl font-bold">Create</h1>

    <form method="POST" onsubmit={handleSubmit}>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="name">Name</label>
          <input bind:value={$form.name}
            type="text"
            name="name"
            id="name"
            class="border rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="description">Description</label>
          <textarea bind:value={$form.description}
            name="description"
            id="description"
            class="border rounded-md p-2"
          ></textarea>
        </div>
        <InputLabel>Source Language</InputLabel>
        <Select
          bind:value={$form.source_language}
          options={asSelectOptions(languages)}
          name="source_language"
          id="source_language"
          class="border rounded-md p-2"
        ></Select>
        <InputLabel>Target Language</InputLabel>
        <Select
          bind:value={$form.target_language}
          options={asSelectOptions(languages)}
          name="target_language"
          id="target_language"
          class="border rounded-md p-2"
        ></Select>
        <fieldset class="border rounded-md p-2">
          <legend>Word List</legend>
          {#each $form.word_pairs as pair, index}
            <div class="flex gap-2 mb-2">
              <div class="flex flex-col gap-2">
                <label for="source_word_{index}">Source Word</label>
                <input
                  type="text"
                  name="source_word[]"
                  id="source_word_{index}"
                  bind:value={pair.source_word}
                  class="border rounded-md p-2"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label for="target_word_{index}">Target Word</label>
                <input
                  type="text"
                  name="target_word[]"
                  id="target_word_{index}"
                  bind:value={pair.target_word}
                  class="border rounded-md p-2"
                />
              </div>
            </div>
          {/each}
          <button
            type="button"
            class="btn btn-primary"
            onclick={() =>
              ($form.word_pairs = [
                ...$form.word_pairs,
                {
                  source_word: '',
                  target_word: '',
                  source_language: $form.source_language,
                  target_language: $form.target_language,
                },
              ])}
          >
            Add Word Pair
          </button>
        </fieldset>
      </div>
      <button type="submit" class="bg-blue-500 text-white rounded-md p-2 mt-4"
        >Create</button
      >
    </form>
  </div>
</AuthenticatedLayout>
