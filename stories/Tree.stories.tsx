import React, { useState } from 'react';
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

const dispatchAction = (data, event) => {
  switch (event.type) {
    case 'update':
      return Default.args.onChange(data, event);
    case 'drop':
      return Default.args.onDrop(data, event);
    case 'drag':
      return Default.args.onDrag(data, event);
    case 'sort':
      return Default.args.onSort(data, event);
    case 'remove':
      return Default.args.onRemove(data, event);
  }
};

export default meta;

const defaultStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  marginRight: '.5rem',
  backgroundColor: 'white',
};

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
      // { key: '121', title: '所得', type: 'file' },
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
  const [items, setItems] = useState(data);

  const handleChange = (data, event) => {
    setItems(data);
    dispatchAction(data, event);
  };

  const handleDragEnter = (e) => {
    console.log('DragEnter', e);
  };

  Default.args = args;

  const handleSelect = (e) => {
    console.log('select', e);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Tree
        treeData={items}
        onSelect={handleSelect}
        onDragEnter={handleDragEnter}
      />
    </DndProvider>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.storyName = 'Tree';

Default.args = {};
