// Code palette from the 2a spec: bone on field, functions cyan-light, literals rust-light, comments bone @ 60%.
export default {
  name: 'cyanotype',
  type: 'dark',
  colors: { 'editor.background': '#1E4262', 'editor.foreground': '#EDE6D4' },
  tokenColors: [
    { settings: { foreground: '#EDE6D4' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#EDE6D499' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'variable.function', 'meta.method-call entity.name.function'], settings: { foreground: '#A9C7DF' } },
    { scope: ['constant.numeric', 'string', 'string.quoted', 'constant.language', 'constant.character'], settings: { foreground: '#E3A58C' } },
  ],
};
