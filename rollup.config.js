import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/corporate-nepali-calendar.min.js',
      format: 'umd',
      name: 'CorporateNepaliCalendar',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: 'dist/corporate-nepali-calendar.esm.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};
