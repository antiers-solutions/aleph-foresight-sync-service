const Sentry = require('@sentry/node');
import { nodeProfilingIntegration } from '@sentry/profiling-node';

jest.mock('@sentry/node');

process.env.SENTRY_DSN = 'https://your-dsn@ingest.sentry.io/your-project-id';
process.env.TRACES_SAMPLE_RATE = '0.1';
process.env.PROFILES_SAMPLE_RATE = '0.1';

Sentry.init({
   dsn: process.env.SENTRY_DSN,
   integrations: [nodeProfilingIntegration()],
   tracesSampleRate: parseFloat(process.env.TRACES_SAMPLE_RATE) || 1.0,
   profilesSampleRate: parseFloat(process.env.PROFILES_SAMPLE_RATE) || 1.0,
});
