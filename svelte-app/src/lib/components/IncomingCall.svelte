<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { gsap } from 'gsap';
  
  // Props
  export let active = true;
  export let reducedMotion = false;
  export let caller = "SNAKE"; // Default caller name
  export let frequency = "140.85"; // Default frequency
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Element references
  let callContainer;
  let ringDisplay;
  let statusText;
  let acceptButton;
  let frequencyDisplay;
  let callerDisplay;
  let staticOverlay;
  let scanlines;
  
  // State
  let ringCount = 0;
  let ringing = false;
  let ringtoneAudio;
  let initializing = true;
  
  onMount(() => {
    if (!active) return;
    
    // Create an audio element for the ringtone
    ringtoneAudio = new Audio();
    ringtoneAudio.src = '/audio/codec-ringtone.mp3';
    ringtoneAudio.loop = true;
    
    // Initial boot sequence animation 
    if (!reducedMotion) {
      runBootSequence();
    } else {
      // For reduced motion, go directly to call state
      showCallScreen();
    }
    
    // Cleanup
    return () => {
      if (ringtoneAudio) {
        ringtoneAudio.pause();
        ringtoneAudio = null;
      }
    };
  });
  
  // Run the boot sequence animation
  function runBootSequence() {
    if (callContainer) {
      // Show container with scan effect
      gsap.to(callContainer, {
        opacity: 1,
        duration: 0.3
      });
    }
    
    if (staticOverlay) {
      // Flash static at beginning
      gsap.to(staticOverlay, {
        opacity: 0.7,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        onComplete: () => {
          gsap.to(staticOverlay, {
            opacity: 0.2,
            duration: 0.5
          });
        }
      });
    }
    
    // Boot text sequence
    const bootTexts = [
      { el: statusText, text: "INITIALIZING CODEC SYSTEM..." },
      { el: statusText, text: "SCANNING FREQUENCIES..." },
      { el: statusText, text: "IDENTIFYING CALLER..." },
      { el: frequencyDisplay, text: frequency },
      { el: callerDisplay, text: caller },
      { el: statusText, text: "INCOMING TRANSMISSION DETECTED" }
    ];
    
    let delay = 0.5;
    bootTexts.forEach((item, index) => {
      gsap.delayedCall(delay, () => {
        if (item.el) {
          // Type out text
          typeWriter(item.el, item.text);
          
          // If it's the frequency, make it appear with a flash
          if (item.el === frequencyDisplay || item.el === callerDisplay) {
            gsap.fromTo(item.el, 
              { opacity: 0, scale: 0.8 }, 
              { opacity: 1, scale: 1, duration: 0.3 }
            );
          }
        }
        
        // After boot sequence completes, start ringing
        if (index === bootTexts.length - 1) {
          gsap.delayedCall(1, showCallScreen);
        }
      });
      
      delay += 0.8;
    });
  }
  
  // Simple typewriter effect
  function typeWriter(element, text, speed = 30) {
    if (!element) return;
    
    let i = 0;
    element.textContent = "";
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }
  
  // Show actual call screen after boot sequence
  function showCallScreen() {
    initializing = false;
    
    if (ringDisplay) {
      ringDisplay.style.display = "block";
      ringDisplay.textContent = "INCOMING CALL";
    }
    
    // Start ringing with slight delay
    gsap.delayedCall(0.5, startRinging);
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
      
      // After 2 rings, show the accept button
      if (ringCount === 2 && acceptButton) {
        gsap.to(acceptButton, {
          opacity: 1,
          duration: 0.5
        });
        
        // Add button pulse animation
        gsap.to(acceptButton, {
          scale: 1.05,
          duration: 0.5,
          repeat: -1,
          yoyo: true
        });
      }
      
    }, 2000); // Ring every 2 seconds
    
    // Auto answer after 5 rings if not answered
    setTimeout(() => {
      if (ringing) {
        acceptCall();
      }
    }, 10000);
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
    
    // Static burst effect
    if (staticOverlay) {
      gsap.to(staticOverlay, {
        opacity: 0.9,
        duration: 0.2,
        yoyo: true,
        repeat: 2,
      });
    }
    
    // Final animation before dismissing
    gsap.timeline()
      .to(callContainer, {
        scale: 1.05,
        duration: 0.5
      })
      .to(callContainer, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        onComplete: () => {
          // Let the parent know the call is accepted
          dispatch('callAccepted');
        }
      });
  }
</script>

<div 
  bind:this={callContainer}
  class="incoming-call-container fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90 opacity-0"
  class:hidden={!active}
>
  <!-- Scanlines effect -->
  <div bind:this={scanlines} class="scanlines"></div>
  
  <!-- Static overlay -->
  <div bind:this={staticOverlay} class="static-overlay"></div>

  <div class="incoming-call bg-black border-2 border-codec-green p-6 rounded-md max-w-md w-full relative overflow-hidden">
    <!-- Codec header with frequency -->
    <div class="codec-header flex justify-between items-center mb-4 border-b border-codec-green pb-2">
      <div class="text-codec-green font-mono text-sm">CODEC v2.1</div>
      <div bind:this={frequencyDisplay} class="frequency text-codec-light-green font-mono text-sm">{frequency}</div>
    </div>
    
    <div 
      bind:this={ringDisplay}
      class="ring-display text-codec-green font-mono text-lg text-center mb-6 p-2 border border-codec-green"
      style="display: none;"
    >
      INITIALIZING...
    </div>
    
    <div 
      bind:this={statusText}
      class="status-text text-codec-light-green font-mono text-center mb-4"
    >
      CODEC SYSTEM BOOTING...
    </div>
    
    <!-- Caller ID display -->
    <div class="caller-id mb-4 flex justify-center">
      <div class="border border-codec-green px-4 py-1">
        <span class="text-codec-green font-mono text-xs">CALLER ID: </span>
        <span bind:this={callerDisplay} class="text-codec-light-green font-mono">{caller}</span>
      </div>
    </div>
    
    <div class="call-display-screen border border-codec-green p-4 mb-6 min-h-[100px] flex items-center justify-center">
      {#if initializing}
        <div class="boot-animation">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#00FF00" stroke-width="2" fill="none" class="boot-circle" />
            <circle cx="50" cy="50" r="35" stroke="#00FF00" stroke-width="1" fill="none" class="boot-circle" />
            <circle cx="50" cy="50" r="25" stroke="#00FF00" stroke-width="2" fill="none" class="boot-circle" />
            <circle cx="50" cy="50" r="5" fill="#00FF00" class="boot-dot" />
          </svg>
        </div>
      {:else}
        <div class="signal-animation text-codec-green font-mono">
          <div class="signal-bars">
            <span class="bar">|||</span>
            <span class="bar">|||</span>
            <span class="bar">|||</span>
          </div>
        </div>
      {/if}
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
  
  .static-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.4"/></svg>');
    opacity: 0.3;
    pointer-events: none;
    z-index: 1;
  }
  
  .scanlines {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 255, 0, 0.05) 50%
    );
    background-size: 100% 4px;
    z-index: 2;
    pointer-events: none;
    opacity: 0.5;
  }
  
  .incoming-call {
    position: relative;
    z-index: 3;
    box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
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
  
  .boot-animation {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .boot-circle {
    animation: boot-pulse 2s infinite alternate;
    transform-origin: center;
  }
  
  .boot-dot {
    animation: boot-dot-pulse 1s infinite alternate;
  }
  
  @keyframes boot-pulse {
    0% {
      opacity: 0.3;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes boot-dot-pulse {
    0% {
      opacity: 0.5;
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