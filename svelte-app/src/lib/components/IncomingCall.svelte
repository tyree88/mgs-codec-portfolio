<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { gsap } from 'gsap';
  
  // Props
  export let active = true;
  export let reducedMotion = false;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Element references
  let callContainer;
  let ringDisplay;
  let statusText;
  let acceptButton;
  
  // State
  let ringCount = 0;
  let ringing = false;
  let ringtoneAudio;
  
  onMount(() => {
    if (!active) return;
    
    // Create an audio element for the ringtone
    ringtoneAudio = new Audio();
    ringtoneAudio.src = '/audio/codec-ringtone.mp3'; // We'll need to add this file
    ringtoneAudio.loop = true;
    
    // Start the animation sequence with a slight delay
    setTimeout(startCallAnimation, 1000);
    
    // Cleanup
    return () => {
      if (ringtoneAudio) {
        ringtoneAudio.pause();
        ringtoneAudio = null;
      }
    };
  });
  
  function startCallAnimation() {
    if (reducedMotion) {
      // For reduced motion, just show the call screen with minimal animation
      if (callContainer) {
        gsap.to(callContainer, {
          opacity: 1,
          duration: 0.5
        });
      }
      
      // Show all elements immediately
      if (ringDisplay) ringDisplay.textContent = "INCOMING CALL";
      if (statusText) statusText.textContent = "SNAKE IS CALLING...";
      if (acceptButton) acceptButton.style.opacity = 1;
      
      return;
    }
    
    // Regular animation sequence
    if (callContainer) {
      // Fade in the call container
      gsap.to(callContainer, {
        opacity: 1,
        duration: 1,
        onComplete: () => startRinging()
      });
    }
  }
  
  function startRinging() {
    ringing = true;
    
    // Play ringtone if audio is available
    if (ringtoneAudio) {
      ringtoneAudio.play().catch(e => {
        console.log("Audio couldn't play automatically:", e);
      });
    }
    
    // Create ringing animation
    const ringInterval = setInterval(() => {
      if (!ringing) {
        clearInterval(ringInterval);
        return;
      }
      
      ringCount++;
      
      if (ringDisplay) {
        // Flash the ring display
        gsap.to(ringDisplay, {
          color: '#FFFFFF',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          duration: 0.2,
          yoyo: true,
          repeat: 1
        });
        
        // Update ring count text
        ringDisplay.textContent = `INCOMING CALL (${ringCount})`;
      }
      
      // After 3 rings, show the accept button
      if (ringCount === 3 && acceptButton) {
        gsap.to(acceptButton, {
          opacity: 1,
          duration: 0.5
        });
      }
      
    }, 2000); // Ring every 2 seconds
    
    // Auto answer after 5 rings if not answered
    setTimeout(() => {
      if (ringing) {
        acceptCall();
      }
    }, 12000);
  }
  
  function acceptCall() {
    ringing = false;
    
    // Stop ringtone
    if (ringtoneAudio) {
      ringtoneAudio.pause();
    }
    
    if (statusText) {
      // Change status text
      statusText.textContent = "CONNECTING...";
    }
    
    // Final animation before dismissing
    if (callContainer) {
      gsap.to(callContainer, {
        scale: 1.1,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          // Let the parent know the call is accepted
          dispatch('callAccepted');
        }
      });
    }
  }
</script>

<div 
  bind:this={callContainer}
  class="incoming-call-container fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90 opacity-0"
  class:hidden={!active}
>
  <div class="incoming-call bg-black border-2 border-codec-green p-6 rounded-md max-w-md w-full">
    <div 
      bind:this={ringDisplay}
      class="ring-display text-codec-green font-mono text-lg text-center mb-6 p-2 border border-codec-green"
    >
      INITIALIZING...
    </div>
    
    <div 
      bind:this={statusText}
      class="status-text text-codec-light-green font-mono text-center mb-8"
    >
      CODEC SIGNAL DETECTED...
    </div>
    
    <div class="call-display-screen border border-codec-green p-4 mb-6 min-h-[100px] flex items-center justify-center">
      <div class="signal-animation text-codec-green font-mono">
        <div class="signal-bars">
          <span class="bar">|||</span>
          <span class="bar">|||</span>
          <span class="bar">|||</span>
        </div>
      </div>
    </div>
    
    <div class="flex justify-center">
      <button 
        bind:this={acceptButton}
        class="accept-call-btn text-sm bg-codec-dark-green text-codec-light-green px-4 py-2 border border-codec-green rounded hover:bg-codec-green hover:text-black opacity-0"
        on:click={acceptCall}
      >
        ACCEPT TRANSMISSION
      </button>
    </div>
  </div>
</div>

<style>
  .hidden {
    display: none;
  }
  
  .signal-bars {
    display: flex;
    gap: 5px;
  }
  
  .bar {
    animation: signal-pulse 1.5s infinite alternate;
  }
  
  .bar:nth-child(2) {
    animation-delay: 0.5s;
  }
  
  .bar:nth-child(3) {
    animation-delay: 1s;
  }
  
  @keyframes signal-pulse {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }
  
  /* For high contrast accessibility */
  :global(.high-contrast) .incoming-call,
  :global(.high-contrast) .ring-display,
  :global(.high-contrast) .call-display-screen,
  :global(.high-contrast) .accept-call-btn {
    color: white !important;
    border-color: white !important;
  }
</style>