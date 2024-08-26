import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['.pnpm-store/*'],
}, {
  rules: {
    'no-console': 'off',
  },
})
