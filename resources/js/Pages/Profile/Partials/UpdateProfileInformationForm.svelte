<script lang="ts">
  import Button from '$components/Actions/Button.svelte';
  import Input from '$components/DataInput/Input.svelte';
  import InputError from '$components/DataInput/InputError.svelte';
  import InputLabel from '$components/DataInput/InputLabel.svelte';
  import { Link, page, useForm } from '@inertiajs/svelte';

  interface Props {
    mustVerifyEmail?: boolean;
    status?: string;
    class?: string;
  }

  let { mustVerifyEmail = false, status, class: className }: Props = $props();

  const user = $page.props.auth.user;

  const form = useForm({
    name: user.name,
    email: user.email,
  });

  function handleSubmitted(e: Event) {
    e.preventDefault();
    if ($form.recentlySuccessful) {
      $form.reset();
    }
  }
</script>

<section class={className}>
  <header>
    <h2 class="text-lg font-medium text-gray-900">Profile Information</h2>

    <p class="mt-1 text-sm text-gray-600">
      Update your account's profile information and email address.
    </p>
  </header>

  <form onsubmit={handleSubmitted}
    class="mt-6 space-y-6"
  >
    <div>
      <InputLabel for="name" value="Name" />

      <Input
        id="name"
        name="name"
        type="text"
        class="mt-1 block w-full"
        bind:value={$form.name}
        required
        autofocus
        autocomplete="name"
      />

      <InputError message={$form.errors.name} />
    </div>

    <div>
      <InputLabel for="email" value="Email" />

      <Input
        id="email"
        name="email"
        type="email"
        class="mt-1 block w-full"
        bind:value={form.email}
        required
        autocomplete="username"
      />

      <InputError message={$form.errors.email} />
    </div>

    {#if mustVerifyEmail && user.email_verified_at === null}
      <p class="mt-2 text-sm text-gray-800">
        Your email address is unverified.
        <Link
          href={route('verification.send')}
          method="post"
          as="button"
          class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Click here to re-send the verification email.
        </Link>
      </p>

      {#if status === 'verification-link-sent'}
        <div class="mt-2 text-sm font-medium text-green-600">
          A new verification link has been sent to your email address.
        </div>
      {/if}
    {/if}

    <div class="flex items-center gap-4">
      <Button variant="primary" disabled={$form.processing}>Save</Button>
    </div>
  </form>
</section>
