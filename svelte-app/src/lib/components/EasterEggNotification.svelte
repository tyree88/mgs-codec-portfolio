<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let easterEgg = null;
  export let visible = false;
  export let duration = 5000; // How long to show the notification (ms)
  export let reducedMotion = false;
  
  // Close notification after duration
  $: if (visible && easterEgg) {
    setTimeout(() => {
      close();
    }, duration);
  }
  
  // Close the notification
  function close() {
    visible = false;
    dispatch('close');
  }
  
  // Handle action button click
  function handleAction() {
    dispatch('action', { id: easterEgg.id, action: easterEgg.reward.action });
    close();
  }
</script>

{#if visible && easterEgg}
  <div 
    class="easter-egg-notification"
    in:fly={{ y: reducedMotion ? 0 : 50, duration: reducedMotion ? 0 : 400 }}
    out:fade={{ duration: reducedMotion ? 0 : 300 }}
  >
    <div class="notification-header">
      <div class="notification-title">
        <span class="icon">{easterEgg.reward.icon}</span>
        <h3>EASTER EGG FOUND: {easterEgg.name}</h3>
      </div>
      <button class="close-button" on:click={close}>×</button>
    </div>
    
    <div class="notification-content">
      <p class="description">{easterEgg.reward.description}</p>
      <p class="pattern">Activated by sequence: {easterEgg.pattern.join(' → ')}</p>
    </div>
    
    <div class="notification-footer">
      <button class="action-button" on:click={handleAction}>
        ACTIVATE {easterEgg.reward.type.toUpperCase()} EFFECT
      </button>
    </div>
  </div>
{/if}

<style>
  .easter-egg-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    max-width: 90vw;
    background-color: #001100;
    border: 2px solid var(--codec-green, #00FF00);
    color: var(--codec-light-green, #AAFFAA);
    font-family: 'Courier New', monospace;
    z-index: 1000;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: rgba(0, 50, 0, 0.8);
    border-bottom: 1px solid var(--codec-green, #00FF00);
  }
  
  .notification-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .icon {
    font-size: 1.5rem;
  }
  
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }
  
  .close-button {
    background: none;
    border: none;
    color: var(--codec-green, #00FF00);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 5px;
  }
  
  .close-button:hover {
    color: white;
  }
  
  .notification-content {
    padding: 10px;
  }
  
  .description {
    margin: 0 0 10px 0;
  }
  
  .pattern {
    font-size: 0.8rem;
    opacity: 0.8;
    margin: 0;
  }
  
  .notification-footer {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid var(--codec-green, #00FF00);
  }
  
  .action-button {
    background-color: #003300;
    color: var(--codec-green, #00FF00);
    border: 1px solid var(--codec-green, #00FF00);
    padding: 5px 15px;
    font-family: 'Courier New', monospace;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .action-button:hover {
    background-color: var(--codec-green, #00FF00);
    color: #000;
  }
  
  @media (max-width: 480px) {
    .easter-egg-notification {
      bottom: 10px;
      right: 10px;
      width: calc(100% - 20px);
    }
    
    h3 {
      font-size: 0.9rem;
    }
  }
</style>