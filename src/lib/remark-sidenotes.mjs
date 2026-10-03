// Numbers every <Sidenote> in document order (adds n="1", n="2", …) so authors never type numbers.
export const remarkSidenotes = () => (tree) => {
  let n = 0;
  const walk = (node) => {
    if (node.name === 'Sidenote' && node.type?.startsWith('mdxJsx')) {
      node.attributes = node.attributes.filter((a) => a.name !== 'n');
      node.attributes.push({ type: 'mdxJsxAttribute', name: 'n', value: String(++n) });
    }
    node.children?.forEach(walk);
  };
  walk(tree);
};
