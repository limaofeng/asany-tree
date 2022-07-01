import React, { useCallback, useEffect, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Tree from '../src';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const meta: Meta = {
  title: 'Demos/Tree',
  component: Tree,
  argTypes: {
    onDrag: { action: 'draged' },
    onDrop: { action: 'droped' },
    onSort: { action: 'sorted' },
    onRemove: { action: 'removed' },
    onChange: { action: 'changed' },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const data = [
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
];

const Template: Story<any> = (args) => {
  const [items, setItems] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);

  const handleDragEnter = (e: any) => {
    console.log('DragEnter', e);
  };

  Default.args = args;

  const handleSelect = (e: any) => {
    console.log('select', e);
  };

  useEffect(() => {
    setItems(data);
  }, []);

  const handleClick = useCallback(
    (key: string) => () => {
      setSelectedKeys([key]);
    },
    []
  );

  const handleOpen = useCallback(
    (keys: string[]) => () => {
      setExpandedKeys(keys);
    },
    []
  );

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Tree
          expandedKeys={expandedKeys}
          treeData={items}
          draggable={true}
          indent={8}
          onSelect={handleSelect}
          onDragEnter={handleDragEnter}
          selectedKeys={selectedKeys}
        />
      </DndProvider>
      <br />
      <button onClick={handleClick('11')} style={{ marginRight: 10 }}>
        设置选中 11
      </button>
      <button onClick={handleClick('5')} style={{ marginRight: 10 }}>
        {' '}
        设置选中 5{' '}
      </button>
      <br />
      <div style={{ marginTop: 20 }}>
        <button onClick={handleOpen(['1', '14'])} style={{ marginRight: 10 }}>
          打开 1 / 14
        </button>
        <button onClick={handleOpen([])} style={{ marginRight: 10 }}>
          关闭
        </button>
      </div>
    </div>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.storyName = 'Tree';

Default.args = {};
