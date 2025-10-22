import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

const exporter = new OTLPTraceExporter({
  url: '/v1/traces', // will hit your nginx proxy
});
const provider = new WebTracerProvider({
  spanProcessors: [
    new SimpleSpanProcessor(exporter),
    // or for production, new BatchSpanProcessor(exporter)
  ],
});
provider.register();

registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation(), new FetchInstrumentation()],
});

console.log('OpenTelemetry Web Tracing initialized');

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
