// The build plugin ships without bundled types; declare it so tsc is happy.
declare module '@astryxdesign/build/vite' {
  import type { Plugin } from 'vite';
  export function astryxStylex(options?: unknown): Plugin[];
}
