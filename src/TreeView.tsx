import React, { useCallback, useEffect, useMemo, useState } from 'react';

import AsanySortable, {
  SortableItemProps,
  useSortableSelector,
} from '@asany/sortable';
import classnames from 'classnames';

import SubTreeNode from './SubTreeNode';
import TreeNode from './TreeNode';
import TreeDataProvider, {
  useSelector,
  useTreeDataContext,
} from './TreeDataProvider';
import { NodeData, TreeViewProps } from './typings';

import './style/TreeView.scss';

const defaultStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  marginRight: '.5rem',
  backgroundColor: 'white',
};

function getDropPosition(
  rect: any,
  node: any,
  drop: any,
  indicator: number,
  index: number
) {
  const interval = rect.height / 3 / 2;
  const inner =
    indicator < interval &&
    indicator > -interval &&
    drop?.parentKey !== node.id;
  if (inner) {
    return index;
  }
  if (indicator > 0) {
    return index + 1;
  }
  if (indicator < 0) {
    return index - 1;
  }
  return NaN;
}

const nodeRender = React.forwardRef(function (
  {
    data,
    index,
    style,
    drag,
    className,
    indicator,
    level,
  }: SortableItemProps<any>,
  itemRef: any
) {
  const node = (data as any) as NodeData;
  const dragging = useSortableSelector((state) => state.dragging);
  const context = useTreeDataContext();
  const nodeContentRender = useSelector((state) => state.nodeRender);

  useSelector((state) => state.version);

  drag(itemRef);

  const dropPosition = useMemo(() => {
    if (!itemRef.current?.getBoundingClientRect()) {
      return NaN;
    }
    return getDropPosition(
      itemRef.current?.getBoundingClientRect(),
      data,
      dragging,
      indicator,
      index
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, indicator]);

  useEffect(() => {
    if (!isNaN(indicator)) {
      context.emit('dragenter', {
        key: data.id,
        node: ({ ...data } as any) as NodeData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicator]);

  if (!node.isLeaf && data.type === 'directory') {
    return (
      <SubTreeNode
        nodeKey={data.id}
        data={data}
        treeData={data.children}
        level={level}
        rowIndex={index}
        itemRef={itemRef}
        className={classnames({
          'sortable-item-indicator-drag-over':
            !isNaN(dropPosition) && dropPosition === index,
          'sortable-item-indicator-drag-over-bottom':
            !isNaN(dropPosition) && dropPosition > index,
          'sortable-item-indicator-drag-over-top':
            !isNaN(dropPosition) && dropPosition < index,
        })}
        onDrop={context.getState().onDrop}
        draggable={context.getState().draggable}
        allowDrop={context.getState().allowDrop}
        itemClassName={classnames(className, {})}
        itemStyle={style}
        items={data.children || []}
        pos={(data as any).pos}
        itemRender={nodeRender}
      />
    );
  }
  return (
    <TreeNode
      data={data as any}
      nodeKey={data.id}
      isDirectory={false}
      level={level}
      rowIndex={index}
      nodeRender={nodeContentRender}
      ref={itemRef}
      className={classnames(className, {
        'sortable-item-indicator-drag-over-bottom': indicator > 0,
        'sortable-item-indicator-drag-over-top': indicator < 0,
      })}
      style={{ ...defaultStyle, ...style }}
    />
  );
});

function flat(datas: NodeData[], parent?: NodeData) {
  const nodes: NodeData[] = [];
  for (const node of datas) {
    (node as any).id = node.key;
    (node as any).type = 'directory';
    node.parentKey = parent?.key;
    node._path = parent?._path ? parent._path + node.key + '/' : node.key + '/';
    node.level = node._path.split('/').length - 1;
    nodes.push(node);
    if (!node.children) {
      continue;
    }
    nodes.push(...flat(node.children, node));
  }
  return nodes;
}

function TreeView(props: TreeViewProps) {
  const {
    tag,
    accept = ['file', 'directory'],
    onClick,
    nodeRender: nodeContentRender,
    onSelect,
    className,
    expandedKeys,
    defaultExpandedKeys = [],
    selectedKeys,
    defaultSelectedKeys = [],
    onDrop,
    allowDrop,
    draggable = false,
    onExpand,
    onDragEnter,
    iconRender,
    contentRender,
  } = props;

  const [version, setVersion] = useState(0);
  const [data, setData] = useState(props.treeData);

  const treeData = useMemo(() => {
    const _data = flat(data);
    const treeData = new Map();
    for (const node of _data) {
      treeData.set(node.key, node);
    }
    return treeData;
  }, [data]);

  const handleDrop = useCallback(
    (e: any) => {
      setData((oldTreeData) => {
        const _dropPosition = getDropPosition(
          e.node._rect,
          e.node,
          e.dragNode,
          e.dropPosition,
          e.node.index
        );
        const dropPos = e.node.pos;
        const dropPosition =
          _dropPosition - Number(dropPos[dropPos.length - 1]);

        const dropKey = e.node.key;
        const dragKey = e.dragNode.key;

        const newTreeData = [...oldTreeData];

        const loop = (
          data: any[],
          key: string,
          callback: (item: any, index: number, arr: any[]) => void
        ) => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].key === key) {
              return callback(data[i], i, data);
            }
            if (data[i].children) {
              loop(data[i].children, key, callback);
            }
          }
        };

        // Find dragObject
        let dragObj: any;
        loop(newTreeData, dragKey, (item: any, index: number, arr: any[]) => {
          arr.splice(index, 1);
          dragObj = item;
        });

        if (dropPosition === 0) {
          // Drop on the content
          loop(newTreeData, dropKey, (item: any) => {
            item.children = item.children || [];
            item.children.push(dragObj!);
            item.children = [...item.children];
          });
        } else {
          let parentKey;
          loop(newTreeData, dropKey, (item, index, arr) => {
            parentKey = item.parentKey;
            if (dropPosition === -1) {
              arr.splice(index, 0, dragObj);
            } else {
              arr.splice(index + 1, 0, dragObj);
            }
          });
          if (parentKey) {
            loop(newTreeData, parentKey, (item: any) => {
              item.children = [...item.children];
            });
          }
        }
        onDrop && onDrop({ ...e, dropPosition: _dropPosition });
        return newTreeData;
      });
      setVersion((i) => ++i);
    },
    [onDrop]
  );

  const handleAllowDrop = useCallback((e) => {
    if (isNaN(e.dropPosition)) {
      return false;
    }
    const info = {
      ...e,
      dropPosition: getDropPosition(
        e.node._rect,
        e.node,
        e.dragNode,
        e.dropPosition,
        e.node.index
      ),
    };
    if (
      [...info.node.pos, '']
        .join('-')
        .startsWith([...info.dragNode.pos, ''].join('-'))
    ) {
      console.log(
        [...info.node.pos, ''].join('-'),
        [...info.dragNode.pos, ''].join('-')
      );
      return false;
    }
    if (!allowDrop) {
      return true;
    }
    return allowDrop(info);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data === props.treeData) {
      return;
    }
    setData(props.treeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.treeData]);

  return (
    <TreeDataProvider
      state={{
        treeData,
        version: 0,
        draggable: draggable,
        selectedKeys: defaultSelectedKeys!,
        expandedKeys: defaultExpandedKeys!,
      }}
      nodeRender={nodeContentRender}
      iconRender={iconRender}
      contentRender={contentRender}
      version={version}
      expandedKeys={expandedKeys}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      onClick={onClick}
      onDrop={handleDrop}
      draggable={draggable}
      allowDrop={handleAllowDrop}
      onDragEnter={onDragEnter}
      onExpand={onExpand}
    >
      <AsanySortable
        items={data as any}
        mode="indicator"
        onDrop={handleDrop}
        draggable={draggable}
        allowDrop={handleAllowDrop}
        className={classnames(className, 'asany-treeview')}
        itemRender={nodeRender}
        accept={accept}
        tag={tag}
        onChange={() => {}}
      />
    </TreeDataProvider>
  );
}

export default TreeView;
