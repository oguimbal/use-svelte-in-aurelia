<script>
  import { onMount } from "svelte";
  import Other from './other.svelte';
  export let prop;
  onMount(() => {
    console.log(prop);
  });

</script>

<div>Bound in svelte: {prop}</div>

<!-- Use a Svelte component in Svelte -->
<Other />
