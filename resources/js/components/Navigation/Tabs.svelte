<script lang="ts">
  let { tabs = [], activeTab = $bindable(tabs.length > 0 ? tabs[0].name : '') } = $props();

  const setActiveTab = (tabName) => {
    activeTab = tabName;
  };
</script>

<div class="w-full flex items-center justify-center">
  <div class="tabs tabs-boxed mb-4 md:w-1/2">
    {#each tabs as tab}
      <button
        class="tab whitespace-nowrap {activeTab === tab.name ? 'tab-active' : ''}"
        onclick={() => setActiveTab(tab.name)}
      >
        {tab.name}
      </button>
    {/each}
  </div>
</div>
