<script>
  export let data;
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white font-sans relative overflow-hidden">
  <!-- Halo néon -->
  <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-pink-500 to-purple-600 blur-[120px] opacity-25 animate-pulse"></div>
  <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-cyan-400 to-indigo-600 blur-[120px] opacity-25 animate-pulse"></div>

  <!-- Header -->
  <header class="relative z-10 w-full flex justify-between items-center px-8 py-6 backdrop-blur-md bg-white/5 border-b border-white/10">
    <a href="/" class="text-2xl font-display font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
      👻 GhostPast
    </a>
    <nav class="flex gap-6 text-white/80 text-sm">
      <a href="/" class="hover:text-white transition">Créer</a>
      <a href="/access" class="hover:text-white transition">Accéder</a>
    </nav>
  </header>

  <main class="relative z-10 flex-1 flex justify-center items-center p-6">
    <slot />
  </main>

  <footer class="relative z-10 text-center text-white/40 text-xs py-6">
    © 2025 GhostPast — Éphémère, chiffré et élégant.
  </footer>
</div>
