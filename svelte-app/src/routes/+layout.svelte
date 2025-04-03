<script>
  import '../app.css';
</script>

<svelte:head>
  <title>Metal Gear Solid 2 Codec Portfolio</title>
</svelte:head>

<div class="app">
  <main>
    <slot />
  </main>
  
  <div class="scanlines"></div>
  <div class="static-noise"></div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>