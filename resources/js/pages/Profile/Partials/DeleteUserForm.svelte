<script lang="ts">
  import Button from '$components/Actions/Button.svelte';
  import Modal from '$components/Actions/Modal.svelte';
  import InputError from '$components/DataInput/InputError.svelte';
  import InputLabel from '$components/DataInput/InputLabel.svelte';
  import PasswordInput from '$components/DataInput/PasswordInput.svelte';
  import { useForm } from '@inertiajs/svelte';
  import { twMerge } from 'tailwind-merge';

  interface Props {
    class: string;
  };

  let { class: className }: Props = $props();

  let confirmingUserDeletion = $state(false);
  let modal: Modal;

  const form = useForm({
      password: '',
  });

  const confirmUserDeletion = () => {
      confirmingUserDeletion = true;
      
  };

  const deleteUser = () => {
      form.delete(route('profile.destroy'), {
          preserveScroll: true,
          onSuccess: () => closeModal(),
          onFinish: () => {
              $form.reset();
          },
      });
  };

  const closeModal = () => {
      modal.close();
      $form.clearErrors();
      $form.reset();
  };
</script>

<section class={twMerge("space-y-6", className)}>
  <header>
      <h2 class="text-lg font-medium text-gray-900">
          Delete Account
      </h2>

      <p class="mt-1 text-sm text-gray-600">
          Once your account is deleted, all of its resources and data will
          be permanently deleted. Before deleting your account, please
          download any data or information that you wish to retain.
      </p>
  </header>

  <Button variant="danger" onclick={confirmUserDeletion}>Delete Account</Button>

  <Modal show={confirmingUserDeletion} bind:this={modal}>
      <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900">
              Are you sure you want to delete your account?
          </h2>

          <p class="mt-1 text-sm text-gray-600">
              Once your account is deleted, all of its resources and data
              will be permanently deleted. Please enter your password to
              confirm you would like to permanently delete your account.
          </p>

          <div class="mt-6">
              <InputLabel
                  for="password"
                  value="Password"
                  class="sr-only"
              />

              <PasswordInput
                  id="password"
                  bind:value={$form.password}
                  type="password"
                  name="password"
                  class="mt-1 block w-3/4"
                  placeholder="Password"
                  on:keyup={(e) => e.key === 'Enter' && deleteUser()}
              />

              <InputError message={$form.errors.password} />
          </div>

          <div class="mt-6 flex justify-end">
              <Button variant="secondary" on:click={closeModal}>
                  Cancel
              </Button>

              <Button variant="danger"
                  class="ms-3"
                  disabled={$form.processing}
                  on:click={deleteUser}
              >
                  Delete Account
            </Button>
          </div>
      </div>
  </Modal>
</section>