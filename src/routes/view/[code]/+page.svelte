<script>
	import { makeRequest } from '$lib/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import axios from 'axios';
  export let data;     // données venant du load()
  // paramètre
console.log(data);

  // Exemple : accès aux données
  let showAlert = false;
  let alertMessage = "";
  let alertType = "success"; // success | error
  let alertTimeout;

  function triggerAlert(message, type = "success") {
    alertMessage = message;
    alertType = type;
    showAlert = true;

    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
      showAlert = false;
    }, 1500); // disparaît en 2.5 sec
  }

  
  let showPopup = false;
  let downloadName = "";
  let downloadingFile = "";

  function copyText() {
    navigator.clipboard.writeText(data?.data?.text || "");
    triggerAlert("✅ Contenu copié !");
  }

  function openDownloadPopup() {
    showPopup = true;
  }

  function downloadContent() {
    showPopup = false;

    const filename = downloadName.trim() || "contenu";
    const blob = new Blob([data?.data?.text || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename ;
    a.click();

    URL.revokeObjectURL(url);
  }


async function downloadFile(filename) {
    if (downloadingFile) return;

    downloadingFile = filename;

    try {
      const url = `${PUBLIC_BACKEND_URL}/api/download/${data?.code}/${filename}`;
      const res = await downloadBinary(url);

      if (!res || !res.data) {
        throw new Error("Réponse du serveur invalide.");
      }

      const blob = await res.data;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
      triggerAlert(`✅ ${filename} téléchargé`);
    } catch (err) {
      console.error("Téléchargement impossible", err);
      triggerAlert(
        err?.message || "Le téléchargement a échoué. Réessaie dans un instant.",
        "error"
      );
    } finally {
      downloadingFile = "";
    }
  }

  export async function downloadBinary(url) {
    return axios.get(url, {
      responseType: "blob"
  });
}
</script>

<div class="relative w-full max-w-4xl bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl overflow-hidden">
  <h2 class="text-4xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
    📂 Espace de partage
  </h2>
  <p class="text-center text-white/70 mb-8">Code : <span class="font-mono text-yellow-300 text-xl">{data.code}</span></p>

  {#if data.ciphered}
    <div class="bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 rounded-xl p-3 text-center mb-6">
      🔒 Ce contenu est chiffré. Fournis ta clé privée pour le déchiffrer.
    </div>
  {/if}

  <section class="mb-8">
    <h3 class="text-2xl mb-3 text-cyan-300 font-semibold">📝 Texte partagé</h3>
    <pre class="bg-[#0f172a]/80 border border-white/10 rounded-2xl p-6 font-mono text-sm text-cyan-200 whitespace-pre-wrap overflow-y-scroll h-svh">{data?.data?.text}</pre>
  
     <div class="flex gap-3 mt-4">
    <!-- ✅ Bouton copier -->
    <button on:click={copyText} class="px-4 py-2 bg-cyan-500/80 hover:bg-cyan-500 text-white rounded-xl text-sm shadow">
      📋 Copier
    </button>

    <!-- ✅ Ouvrir popup -->
    <button on:click={openDownloadPopup} class="px-4 py-2 bg-pink-500/80 hover:bg-pink-500 text-white rounded-xl text-sm shadow">
      ⬇ Télécharger
    </button>
  </div>
  </section>

  <section>
    <h3 class="text-2xl mb-3 text-pink-300 font-semibold">📁 Fichiers</h3>
    <ul class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {#each data?.data?.files as f}
        <li class="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-4 flex flex-col justify-between transition-all">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-3xl">📄</span>
            <div class="truncate">
              <p class="text-white/90 text-sm font-semibold">{f.name}</p>
              <p class="text-xs text-white/50">
               {f.size < 1024 * 1024
                ? `${(f.size / 1024).toFixed(1)} Ko`
                : `${(f.size / 1024 / 1024).toFixed(1)} Mo`
              }
              </p>
            </div>
          </div>
          <button
            on:click={() => downloadFile(f.name)}
            class={`bg-gradient-to-r from-cyan-400 to-pink-500 text-dark font-semibold rounded-xl py-2 text-sm transition-all ${
              downloadingFile ? "opacity-60 cursor-wait" : "hover:scale-[1.03]"
            }`}
            disabled={!!downloadingFile}
          >
            {#if downloadingFile === f.name}
              <span class="flex items-center justify-center gap-2">
                <span class="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Récupération…
              </span>
            {:else}
              ⬇ Télécharger
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  </section>

  <p class="text-center text-white/60 text-sm mt-8">⏳ Expire dans <b>7 jours</b></p>

  {#if downloadingFile}
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#020617]/80 backdrop-blur-sm text-white text-lg">
      <span class="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
      <span>Téléchargement de <b>{downloadingFile}</b>…</span>
      <p class="text-sm text-white/70">Ne ferme pas cette page.</p>
    </div>
  {/if}
</div>
{#if showPopup}
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-80">
      <h3 class="text-lg font-semibold mb-3 text-white">Nom du fichier</h3>

      <input
        type="text"
        bind:value={downloadName}
        class="w-full p-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:outline-none"
        placeholder="exemple.js"
      />

      <div class="flex justify-end gap-3 mt-5">
        <button on:click={() => (showPopup = false)}
          class="px-4 py-2 text-white/70 hover:text-white">
          Annuler
        </button>
        <button on:click={downloadContent}
          class="px-4 py-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-dark rounded-lg font-semibold">
          Télécharger
        </button>
      </div>
    </div>
  </div>
{/if}
{#if showAlert}
  <div
    class={`
      fixed top-6 right-6 px-5 py-3 rounded-xl shadow-lg
      backdrop-blur-xl border 
      transition-all duration-300
      ${alertType === "success"
        ? "bg-green-500/20 border-green-400/30 text-green-300"
        : "bg-red-500/20 border-red-400/30 text-red-300"}
    `}

  >
    {alertMessage}
  </div>
{/if}
