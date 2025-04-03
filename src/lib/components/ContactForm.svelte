<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let name = '';
  let email = '';
  let message = '';
  let isSubmitting = false;
  let submitStatus: 'idle' | 'success' | 'error' = 'idle';

  async function handleSubmit() {
    if (isSubmitting) return;
    isSubmitting = true;
    submitStatus = 'idle';

    // --- Placeholder for actual form submission ---
    // In a real application, you would send this data to a server/API endpoint
    console.log('Form submitted:', { name, email, message }); 
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    // --- End Placeholder ---

    // Simulate success for now
    submitStatus = 'success';
    dispatch('submitSuccess', { name }); // Dispatch event on success

    // Reset form after a short delay
    setTimeout(() => {
      name = '';
      email = '';
      message = '';
      submitStatus = 'idle'; // Ready for another submission
    }, 3000);

    isSubmitting = false;
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="contact-form space-y-3 text-sm">
  {#if submitStatus === 'success'}
    <p class="text-codec-highlight">Transmission received, {name}. Stand by for response.</p>
  {:else if submitStatus === 'error'}
    <p class="text-red-500">Transmission error. Please try again.</p>
  {/if}

  <div class="flex flex-col">
    <label for="name" class="mb-1 text-codec-highlight">> CALLSIGN (Name):</label>
    <input 
      type="text" 
      id="name" 
      bind:value={name} 
      required 
      class="bg-codec-dark border border-codec-mid px-2 py-1 focus:border-codec-highlight focus:outline-none caret-codec-highlight"
      disabled={isSubmitting}
    />
  </div>
  <div class="flex flex-col">
    <label for="email" class="mb-1 text-codec-highlight">> FREQUENCY (Email):</label>
    <input 
      type="email" 
      id="email" 
      bind:value={email} 
      required 
      class="bg-codec-dark border border-codec-mid px-2 py-1 focus:border-codec-highlight focus:outline-none caret-codec-highlight"
      disabled={isSubmitting}
    />
  </div>
  <div class="flex flex-col">
    <label for="message" class="mb-1 text-codec-highlight">> MESSAGE:</label>
    <textarea 
      id="message" 
      bind:value={message} 
      required 
      rows={3}
      class="bg-codec-dark border border-codec-mid px-2 py-1 focus:border-codec-highlight focus:outline-none caret-codec-highlight resize-none"
      disabled={isSubmitting}
    ></textarea>
  </div>
  <div>
    <button 
      type="submit" 
      class="w-full px-3 py-1 border border-codec-light hover:bg-codec-mid active:bg-codec-highlight disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}
    </button>
  </div>
</form>

<style>
  /* Add specific styles if needed */
</style>