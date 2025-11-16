<script>
  import { goto } from '$app/navigation';
  let code = '';
  let error = '';

  function access() {
    if (!code.trim()) { error = 'Code requis'; return; }
    goto(`/view/${code.toUpperCase()}`);
  }
</script>

<div class="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
  <h2 class="text-4xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
    Accéder à un espace
  </h2>
  <p class="text-white/70 mb-6">Entre le code de partage reçu.</p>

  <input bind:value={code} placeholder="Ex : Z9H8L2" class="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-center text-2xl tracking-[0.4em] placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-neonPink mb-4 uppercase" />
  {#if error}<p class="text-red-300 text-sm mb-2">{error}</p>{/if}

  <button on:click={access} class="w-full bg-gradient-to-r from-pink-500 to-neonCyan text-dark font-semibold rounded-2xl py-3 text-lg shadow-lg hover:scale-[1.03] transition-all">
    🚀 Ouvrir l’espace
  </button>
</div>
