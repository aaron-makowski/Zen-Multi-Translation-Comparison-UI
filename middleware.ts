import { chain, csp, nextSafe, strictDynamic } from '@next-safe/middleware';

const security = [
  nextSafe({ disableCsp: true }),
  csp({
    directives: {
      'form-action': ['self'],
    },
  }),
  strictDynamic(),
];

export default chain(...security);
