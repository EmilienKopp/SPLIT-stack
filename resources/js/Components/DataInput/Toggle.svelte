<script lang="ts">
  interface Props {
    label: string;
    checked: boolean;
  }

  let { label, checked = $bindable(), ...rest } = $props();
</script>

<div class="flex flex-col">
  <div class="form-control w-52">
    <label class="label cursor-pointer">
      <span class="label-text">{label}</span>
      <input type="checkbox" class="toggle toggle-primary" bind:checked {...rest}/>
    </label>
  </div>
</div>