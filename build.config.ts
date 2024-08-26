import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index.ts'],
  outDir: './dist',
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: { minify: true },
  },
})
