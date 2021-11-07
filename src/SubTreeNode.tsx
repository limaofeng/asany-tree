import React, { forwardRef } from 'react';

import AsanySortable from '@asany/sortable';
import classnames from 'classnames';

import { File, Folder } from './icon';
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
      ...props
    }: any,
    boxRef: any
  ) => {
    const opened = useSelector((state) => state.expandedKeys.includes(nodeKey));

    return (
      <div
        key={itemData.id}
        className={classnames('asany-treeview-subnode', containerClassName)}
        style={{ ...itemStyle, padding: 0 }}
      >
        <TreeNode
          data={itemData}
          isDirectory={!!itemData.children?.length}
          nodeKey={nodeKey}
          ref={itemRef}
          className={itemClassName}
          level={level}
          icon={!!itemData.children?.length ? <Folder /> : <File />}
        >
          {itemData.id} - {itemData.title}
        </TreeNode>
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
  allowDrop,
  onChange: handleChange,
}: any) => {
  return (
    <AsanySortable
      items={items}
      mode="indicator"
      onDrop={onDrop}
      allowDrop={allowDrop}
      itemRender={itemRender}
      pos={pos}
      style={{ listStyle: 'none', padding: 0 }}
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
