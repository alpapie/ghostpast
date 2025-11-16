<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  let text = '';
  let files = [];
  let encrypt = false;
  let recipientKey = '';
  let isLoading = false;
  let errorMessage = '';
  let showPolicyModal = false;
  let policyLocale = 'en';
  const MAX_FILE_BYTES = 3.5 * 1024 * 1024;
  const policyContent = {
    en: {
      title: "Welcome to Ghostpast 👻",
      intro: "Here’s how to share safely:",
      bullets: [
        "Drop your files or paste your text, then hit <b>Generate code</b>.",
        "Share that code—recipients can instantly view or download.",
        "Everything auto-expires: files after <b>24h</b>, text after <b>7 days</b>, max <b>20&nbsp;MB</b> for all files."
      ],
      button: "Got it"
    },
    fr: {
      title: "Bienvenue sur Ghostpast 👻",
      intro: "Voici comment partager en toute sérénité :",
      bullets: [
        "Dépose tes fichiers ou colle ton texte, puis clique sur <b>Générer le code</b>.",
        "Partage ce code : les destinataires peuvent consulter ou télécharger instantanément.",
        "Tout expire automatiquement : fichiers après <b>24h</b>, texte après <b>7 jours</b>, <b>20&nbsp;Mo</b> max pour tous les fichiers."
      ],
      button: "J'ai compris"
    }
  };
  $: currentPolicy = policyContent[policyLocale];

  onMount(() => {
    try {
      const flag = localStorage.getItem('ghostpastPolicyShown');
      if (!flag) {
        showPolicyModal = true;
      }
    } catch (err) {
      console.warn('Unable to access localStorage', err);
    }
  });

  function acknowledgePolicy() {
    try {
      localStorage.setItem('ghostpastPolicyShown', '1');
    } catch (err) {
      console.warn('Unable to save the acknowledgement', err);
    } finally {
      showPolicyModal = false;
    }
  }

  function onFiles(e) {
    const selected = [...e.target.files];
    const oversized = selected.find((file) => file.size > MAX_FILE_BYTES);

    if (oversized) {
      errorMessage = `Chaque fichier doit être inférieur à 3.5 Mo. "${oversized.name}" est trop volumineux.`;
      files = [];
      e.target.value = '';
      return;
    }

    files = selected;
    if (errorMessage?.includes('3.5 Mo')) {
      errorMessage = '';
    }
  }


  async function generateCode() {
    if (isLoading) return;
    errorMessage = '';

    const formData = new FormData();

    formData.append("text", text);
    // formData.append("encrypt", encrypt);

    if (encrypt && recipientKey) {
      formData.append("recipientKey", recipientKey);
    }

    // Validate files again in case the selection changed meanwhile
    const oversized = files.find((file) => file.size > MAX_FILE_BYTES);
    if (oversized) {
      errorMessage = `Chaque fichier doit être inférieur à 3.5 Mo. "${oversized.name}" est trop volumineux.`;
      return;
    }

    // Add files
    for (let f of files) {
      formData.append("files", f);
    }

    try {
      isLoading = true;

      const res = await fetch(PUBLIC_BACKEND_URL + "/api/create", {
        method: "POST",
        body: formData
      });

      const raw = await res.text();
      let payload = null;
      try {
        payload = raw ? JSON.parse(raw) : null;
      } catch (parseError) {
        console.error("Non-JSON response received from backend", parseError);
      }

      if (!res.ok) {
        const backendMessage =
          payload?.message || payload?.error || raw || "An unexpected error occurred.";
        throw new Error(backendMessage);
      }

      const code = payload?.code;
      if (!code) {
        throw new Error("Invalid server response. Please try again.");
      }

      goto(`/view/${code}`);
    } catch (err) {
      console.error("Error while creating the share", err);
      errorMessage =
        err?.message || "Unable to reach the server. Check your connection and retry.";
    } finally {
      isLoading = false;
    }
  }

  // async function generateCode() {
  //   const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  //   // simulation d'envoi au backend
  //   goto(`/view/${code}`);
  // }
</script>

<section class="min-h-[calc(100vh-4rem)] w-full px-4 py-8 sm:px-6 lg:px-10 flex items-center justify-center">
<div class="relative w-full max-w-3xl bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 shadow-2xl overflow-hidden">
  <h1 class="text-3xl sm:text-4xl font-semibold text-center mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
    Fast & Ephemeral Sharing
  </h1>
  <p class="text-center text-white/70 text-base sm:text-lg mb-6 sm:mb-8">Drop a file or paste some text—everything expires automatically (7 days max, 20&nbsp;MB).</p>

  <!-- Zone fichiers -->
  <div class="relative border-2 border-dashed border-white/20 hover:border-neonCyan transition rounded-3xl p-6 sm:p-8 lg:p-10 bg-white/5 hover:bg-white/10 mb-6 text-center">
    <input type="file" multiple class="absolute inset-0 opacity-0 cursor-pointer" on:change={onFiles} />
    <div>
      <span class="text-4xl sm:text-5xl">📁</span>
      <p class="text-white/70 mt-2 text-base sm:text-lg">Drop your files here or click to select</p>
    </div>
</div>

{#if showPolicyModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm text-white">
    <div class="max-w-lg w-[90%] bg-[#0f172a] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-4">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-2xl font-semibold text-cyan-200">{currentPolicy.title}</h2>
        <button
          type="button"
          on:click={() => (policyLocale = policyLocale === 'en' ? 'fr' : 'en')}
          class="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
          aria-label="Toggle language"
        >
          {policyLocale === 'en' ? 'FR' : 'EN'}
        </button>
      </div>
      <p class="text-white/80">{currentPolicy.intro}</p>
      <ul class="list-disc list-inside text-sm text-white/70 space-y-1">
        {#each currentPolicy.bullets as bullet}
          <li>{@html bullet}</li>
        {/each}
      </ul>
      <button
        type="button"
        on:click={acknowledgePolicy}
        class="w-full bg-gradient-to-r from-neonCyan to-neonPink text-dark font-semibold rounded-2xl py-3 mt-4"
      >
        {currentPolicy.button}
      </button>
    </div>
  </div>
{/if}

  {#if files.length}
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      {#each files as f}
        <li class="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center justify-between">
          <span class="truncate">{f.name}</span>
          <span class="text-white/50 text-sm">{(f.size / 1024).toFixed(1)} KB</span>
        </li>
      {/each}
    </ul>
  {/if}

  <!-- Texte -->
  <textarea bind:value={text} placeholder="Paste your text here…" class="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-neonCyan mb-6 resize-none min-h-[10rem] sm:min-h-[12rem]"></textarea>

  <!-- Option chiffrement -->
  <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 text-white/70">
    <label class="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" bind:checked={encrypt} class="accent-cyan-300" />
      🔒 Encrypt with a public key
    </label>
  </div>
  {#if encrypt}
    <textarea bind:value={recipientKey} placeholder="Paste the recipient's PEM public key" class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-sm text-white placeholder-white/50 mb-4"></textarea>
  {/if}

  {#if errorMessage}
    <div class="mt-6 bg-red-500/10 border border-red-400/30 text-red-200 text-sm rounded-2xl p-4">
      {errorMessage}
    </div>
  {/if}

  <div class="text-center mt-8">
    <button
      type="button"
      on:click={generateCode}
      class={`w-full sm:w-auto bg-gradient-to-r from-neonCyan to-neonPink text-dark font-semibold rounded-2xl py-3 px-6 text-lg shadow-lg transition-all ${
        isLoading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.03]"
      }`}
      disabled={isLoading}
    >
      {#if isLoading}
        <span class="flex items-center justify-center gap-3">
          <span class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Working on it…
        </span>
      {:else}
        🚀 Generate code
      {/if}
    </button>
  </div>

  {#if isLoading}
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#020617]/80 backdrop-blur-sm text-white text-lg">
      <span class="h-10 w-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
      Preparing your share…
    </div>
  {/if}
</div>
</section>
