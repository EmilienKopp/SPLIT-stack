<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import GuestLayout from '../../layouts/GuestLayout.svelte';
  import Button from '$components/Actions/Button.svelte';
  import Input from '$components/DataInput/Input.svelte';
  import { router, useForm } from '@inertiajs/svelte';

  interface Props {
    email: string;
    token: string;
  }

  let { email, token }: Props = $props();

  const form = $state(useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  }));

  const submit = () => {
    form.post(route('password.store'), {
      onFinish: () => {
        form.reset('password', 'password_confirmation');
      },
    });
  };
</script>

<GuestLayout>
  {#snippet head()}
    <div >
      <title>Reset Password</title>
    </div>
  {/snippet}

  <form onsubmit={preventDefault(submit)}>
    <div>
      <Input
        label="Email"
        id="email"
        type="email"
        class="mt-1 block w-full"
        bind:value={form.email}
        required
        autofocus
        autocomplete="username"
        errors={form.errors?.email}
      />
    </div>

    <div class="mt-4">
      <Input
        label="Password"
        id="password"
        type="password"
        class="mt-1 block w-full"
        bind:value={form.password}
        required
        autocomplete="new-password"
        errors={form.errors?.password}
      />
    </div>

    <div class="mt-4">
      <Input
        label="Confirm Password"
        id="password_confirmation"
        type="password"
        class="mt-1 block w-full"
        bind:value={form.password_confirmation}
        required
        autocomplete="new-password"
        errors={form.errors?.password_confirmation}
      />
    </div>

    <div class="mt-4 flex items-center justify-end">
      <Button
        class="ml-4"
        type="submit"
      >
        Reset Password
      </Button>
    </div>
  </form>
</GuestLayout>
