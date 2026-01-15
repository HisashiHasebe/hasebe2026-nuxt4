<!-- app.vue -->
<script setup lang="ts">
type ApiResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number | null; message: string; detail?: unknown };

const result = ref<ApiResult | null>(null);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;

  try {
    // ofetch / $fetch は成功時に Response を返さないので、
    // status も出したい場合は「生の fetch」を使うのが一番シンプルです。
    const res = await fetch(
      "https://hasebe2026.g.kuroco.app/rcms-api/1/content/details/1",
      {
        method: "GET",
        credentials: "include", // ★ Cookie 認証なら基本これ
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const status = res.status;

    // JSON想定（もしJSONじゃない時は text() に切り替えてください）
    const data = await res.json().catch(async () => {
      const text = await res.text();
      return { _nonJson: true, text };
    });

    if (!res.ok) {
      result.value = {
        ok: false,
        status,
        message: `HTTP Error: ${status}`,
        detail: data,
      };
    } else {
      result.value = { ok: true, status, data };
    }
  } catch (e: any) {
    // CORS / ネットワーク / 証明書 / preflight 失敗などはここに来ます（statusは取れません）
    result.value = {
      ok: false,
      status: null,
      message: e?.message ?? "Network/CORS Error",
      detail: e,
    };
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div style="padding: 16px; font-family: ui-sans-serif, system-ui">
    <h1>API Test</h1>
    <p>
      GET:
      <code
        >https://hasebe2026.g.kuroco.app/rcms-api/1/content/details/1</code
      >
    </p>

    <p v-if="loading">Loading...</p>

    <template v-else>
      <div v-if="result?.ok" style="margin-top: 12px">
        <p><b>Status:</b> {{ result.status }}</p>
        <pre style="white-space: pre-wrap; word-break: break-word">{{
          JSON.stringify(result.data, null, 2)
        }}</pre>
      </div>

      <div v-else style="margin-top: 12px">
        <p><b>Status:</b> {{ result?.status ?? "（なし）" }}</p>
        <p><b>Error:</b> {{ result?.message }}</p>
        <pre style="white-space: pre-wrap; word-break: break-word">{{
          JSON.stringify(result?.detail, null, 2)
        }}</pre>
      </div>
    </template>
  </div>
</template>
