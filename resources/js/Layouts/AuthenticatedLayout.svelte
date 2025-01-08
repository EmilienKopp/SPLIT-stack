<script setup lang="ts">
  import Dropdown from '$components/Actions/Dropdown.svelte';
  import ApplicationLogo from '$components/ApplicationLogo.svelte';
  import Toast from '$components/Feedback/Toast/Toast.svelte';
  import NavLink from '$components/Navigation/NavLink.svelte';
  import ResponsiveNavLink from '$components/Navigation/ResponsiveNavLink.svelte';
  import { user } from '$lib/stores';
  import { Link, page } from '@inertiajs/svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  interface Props {
    header?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let { header, children }: Props = $props();

  let showingNavigationDropdown = $state(false);
  let supportsViewTransitions = false;

  onMount(() => {
    supportsViewTransitions = 'startViewTransition' in document;
    //TODO: implement maybe one day
  });

  const settingsDropdownActions: DropdownAction[] = [
    { text: 'Profile', href: route('profile.edit') },
    {
      text: 'Log Out',
      href: route('logout'),
      method: 'post' as HTTPMethod,
      as: 'button',
    },
  ];
</script>


<Toast show={false} />
<div>
  <div class="min-h-screen bg-gray-100">
    <nav class="border-b border-gray-100 bg-white">
      <!-- Primary Navigation Menu -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <!-- Logo -->
            <div class="flex shrink-0 items-center">
              <Link href={route('dashboard')}>
                <ApplicationLogo
                  class="block h-9 w-auto fill-current text-gray-800"
                />
              </Link>
            </div>

            <!-- Navigation Links -->
            <div
              class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex items-center"
            >
              <NavLink
                href={'dashboard'}
                active={route().current('dashboard')}
              >
                Dashboard
              </NavLink>
            </div>
          </div>

          <div class="hidden sm:ms-6 sm:flex sm:items-center">
            <!-- Settings Dropdown -->
            <div class="ms-3">
              <Dropdown actions={settingsDropdownActions}>
                {#snippet trigger()}
                                <span
                    class="inline-flex rounded-md items-center"
                    
                  >
                    {$page.props.auth.user.name}
                    <svg
                      class="-me-0.5 ms-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                              {/snippet}
              </Dropdown>
            </div>
          </div>

          <!-- Hamburger -->
          <div class="-me-2 flex items-center sm:hidden">
            <button
              onclick={() =>
                (showingNavigationDropdown = !showingNavigationDropdown)}
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
            >
              <svg
                class="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  class:hidden={showingNavigationDropdown}
                  class:inline-flex={!showingNavigationDropdown}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  class:hidden={!showingNavigationDropdown}
                  class:inline-flex={showingNavigationDropdown}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Responsive Navigation Menu -->
      <div
        class="sm:hidden"
        class:block={showingNavigationDropdown}
        class:hidden={!showingNavigationDropdown}
      >
        <div class="space-y-1 pb-3 pt-2">
          <ResponsiveNavLink
            href={route('dashboard')}
            active={route().current('dashboard')}
          >
            Dashboard
          </ResponsiveNavLink>
        </div>

        <!-- Responsive Settings Options -->
        <div class="border-t border-gray-200 pb-1 pt-4">
          <div class="px-4">
            <div class="text-base font-medium text-gray-800">
              {$user.name}
            </div>
            <div class="text-sm font-medium text-gray-500">
              {$user.email}
            </div>
          </div>

          <div class="mt-3 space-y-1">
            <ResponsiveNavLink href={route('profile.edit')}>
              Profile
            </ResponsiveNavLink>
            <ResponsiveNavLink href={route('logout')} method="post" as="button">
              Log Out
            </ResponsiveNavLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Heading -->
    {#if header}
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {@render header?.()}
        </div>
      </header>
    {/if}
    <!-- Page Content -->
    <main class="py-10 px-4 sm:px-8 lg:px-14" transition:fade>
      <Toast show={false} />
      {@render children?.()}
    </main>
  </div>
</div>
