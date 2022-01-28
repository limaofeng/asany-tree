import React, { forwardRef } from 'react';

import AsanySortable from '@asany/sortable';
import classnames from 'classnames';

import { useSelector } from './TreeDataProvider';
import TreeNode from './TreeNode';

const InternalContainer = forwardRef(
  (
    {
      itemRef,
      nodeKey,
      containerClassName,
      itemClassName,
      itemStyle,
      itemData,
      children,
      className,
      level,
      rowIndex,
      ...props
    }: any,
    boxRef: any
  ) => {
    const opened = useSelector((state) => state.expandedKeys.includes(nodeKey));
    const nodeContentRender = useSelector((state) => state.nodeRender);
    return (
      <div
        key={itemData.id}
        className={classnames('asany-treeview-subnode', containerClassName)}
        style={{ ...itemStyle, padding: 0 }}
      >
        <TreeNode
          rowIndex={rowIndex}
          data={itemData}
          nodeRender={nodeContentRender}
          isDirectory={!!itemData.children?.length}
          nodeKey={nodeKey}
          ref={itemRef}
          className={itemClassName}
          level={level}
        />
        <div
          ref={boxRef}
          className={classnames(className, 'asany-treeview-subnode-list', {
            hide: !opened,
          })}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

const SubTreeNode = ({
  level,
  itemRender,
  nodeKey,
  data,
  pos,
  itemRef,
  items,
  itemClassName,
  className,
  style,
  onDrop,
  draggable,
  allowDrop,
  onChange: handleChange,
}: any) => {
  return (
    <AsanySortable
      items={items}
      mode="indicator"
      onDrop={onDrop}
      draggable={draggable}
      allowDrop={allowDrop}
      itemRender={itemRender}
      pos={pos}
      accept={['file', 'directory']}
      tag={
        <InternalContainer
          level={level}
          nodeKey={nodeKey}
          itemData={data}
          itemRef={itemRef}
          containerClassName={className}
          itemClassName={itemClassName}
          itemStyle={style}
        />
      }
      onChange={handleChange}
    />
  );
};

export default SubTreeNode;
