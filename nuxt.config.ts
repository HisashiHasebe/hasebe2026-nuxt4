// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      kurocoApiBaseUrl: process.env.NUXT_PUBLIC_KUROCO_API_BASE_URL
    },
  },
});
