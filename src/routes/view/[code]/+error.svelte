<script>
  export let error;
  export let status;
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white px-6">

  <div class="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 max-w-md text-center shadow-2xl animate-fadeIn">

    <h1 class="text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
      404
    </h1>

    <p class="text-lg text-white/70 mb-6">
      L’espace de partage que tu cherches n’existe plus ou a expiré.
    </p>

    <p class="text-sm text-white/40 mb-8">
      Code introuvable : <span class="font-mono text-cyan-300">{error?.path?.split('/').pop()}</span>
    </p>

    <a href="/" class="inline-block bg-gradient-to-r from-cyan-400 to-pink-400 text-dark font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.03] transition-all">
      ⬅ Retour à l’accueil
    </a>
  </div>

</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out;
  }
</style>
