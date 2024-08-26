import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index.ts',
    './src/cli.ts',
  ],
  outDir: './dist',
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: { minify: true },
  },
})
