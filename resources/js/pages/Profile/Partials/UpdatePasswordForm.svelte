<script lang="ts">
  import Button from '$components/Actions/Button.svelte';
  import InputError from '$components/DataInput/InputError.svelte';
  import InputLabel from '$components/DataInput/InputLabel.svelte';
  import PasswordInput from '$components/DataInput/PasswordInput.svelte';
  import { useForm } from '@inertiajs/svelte';

  interface Props {
    class?: string;
  }

  let { class: className }: Props = $props();

  const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const updatePassword = (e: Event) => {
    e.preventDefault();
    $form.put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => {
        $form.reset();
      },
      onError: () => {
        if ($form.errors.password) {
          $form.reset('password', 'password_confirmation');
        }
        if ($form.errors.current_password) {
          $form.reset('current_password');
        }
      },
    });
  };
</script>

<section class={className}>
  <header>
    <h2 class="text-lg font-medium text-gray-900">Update Password</h2>

    <p class="mt-1 text-sm text-gray-600">
      Ensure your account is using a long, random password to stay secure.
    </p>
  </header>

  <form onsubmit={updatePassword} class="mt-6 space-y-6">
    <div>
      <InputLabel for="current_password" value="Current Password" />

      <PasswordInput
        id="current_password"
        type="password"
        name="current_password"
        class="mt-1 block w-full"
        autocomplete="current-password"
      />

      <InputError message={$form.errors.current_password} />
    </div>

    <div>
      <InputLabel for="password" value="New Password" />

      <PasswordInput
        id="password"
        name="password"
        type="password"
        class="mt-1 block w-full"
        bind:value={$form.password}
        autocomplete="new-password"
      />

      <InputError message={$form.errors.password} />
    </div>

    <div>
      <InputLabel for="password_confirmation" value="Confirm Password" />

      <PasswordInput
        id="password_confirmation"
        bind:value={$form.password_confirmation}
        type="password"
        name="password_confirmation"
        class="mt-1 block w-full"
        autocomplete="new-password"
      />

      <InputError message={$form.errors.password_confirmation} />
    </div>

    <div class="flex items-center gap-4">
      <Button variant="primary" disabled={$form.processing}>Save</Button>
    </div>
  </form>
</section>
