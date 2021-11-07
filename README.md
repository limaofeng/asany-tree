# React Tree

React 排序树组件

## Install

```bash
npm i @asany/tree # or yarn add @asany/tree
```

## Usage

```tsx
const Example = () => {
  const [items, setItems] = useState([
    {
      key: '1',
      title: '荣耀',
      type: 'directory',
      children: [
        { key: '11', title: '鲁班7号', type: 'file' },
        { key: '12', title: '廉颇', type: 'file' },
        { key: '13', title: '凯', type: 'file' },
        {
          key: '14',
          title: '长城守卫军',
          type: 'directory',
          children: [{ key: '15', title: '苏烈', type: 'file' }],
        },
        { key: '121', title: '所得', type: 'file' },
      ],
    },
    { key: '2', title: '老王', type: 'file' },
    { key: '3', title: '老五', type: 'file' },
    { key: '4', title: '张三', type: 'file' },
    { key: '5', title: '赵六', type: 'file' },

    {
      key: '7',
      title: '王者营地',
      type: 'directory',
      children: [],
    },
  ]);

  const handleChange = (data, event) => {
    setItems(data);
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Tree treeData={items} />
    </DndProvider>
  );
};
```

## Maintainers

[@limaofeng](https://github.com/limaofeng).

## License

[MIT](LICENSE) © 李茂峰
