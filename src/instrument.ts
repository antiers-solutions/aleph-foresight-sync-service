// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

Sentry.init({
   dsn: 'https://d5841af61fd3657f885fac90ddc9d5e1@o4507565664501760.ingest.us.sentry.io/4507565671710720',
   integrations: [nodeProfilingIntegration()],
   // Performance Monitoring
   tracesSampleRate: 1.0, //  Capture 100% of the transactions

   // Set sampling rate for profiling - this is relative to tracesSampleRate
   profilesSampleRate: 1.0,
});
