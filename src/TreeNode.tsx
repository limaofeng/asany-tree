import React, { CSSProperties, useCallback } from 'react';

import classnames from 'classnames';

import { useSelector, useTreeDataContext } from './TreeDataProvider';
import { NodeData } from './typings';
import { ClosedDirectory, File, Folder, OpenDirectory } from './icon';

type TreeNodeProps = {
  level: number;
  nodeKey: string;
  rowIndex: number;
  data: NodeData;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  isDirectory: boolean;
  nodeRender?: any;
};

function renderIndentGuide(
  nodeKey: string,
  size: number,
  indentNumber: number,
  hasIndentActive: (index: number) => void
) {
  const indents = [];
  for (let i = 0; i < size; i++) {
    indents.push(
      <div
        key={`${nodeKey}-${i}`}
        className={classnames('indent-guide', {
          active: hasIndentActive(i),
        })}
        style={{ width: indentNumber, marginLeft: i > 0 ? 8 : undefined }}
      />
    );
  }
  return indents;
}

function defaultIconRender(node: any, { isDirectory }: any) {
  if (node.icon) {
    return node.icon;
  }
  return !!isDirectory ? <Folder /> : <File />;
}

function defaultContentRender(node: NodeData) {
  return (
    <>
      <span className="monaco-icon-name-container">
        <span className="label-name">
          <span className="monaco-highlighted-label">
            <span>{node.title}</span>
          </span>
        </span>
      </span>
      <span className="monaco-icon-description-container"></span>
    </>
  );
}

function TreeNode(props: TreeNodeProps, ref: any) {
  const {
    level = 1,
    className,
    isDirectory,
    nodeKey,
    data,
    rowIndex,
    nodeRender,
  } = props;

  const context = useTreeDataContext();
  const opened = useSelector((state) => state.expandedKeys.includes(nodeKey));
  const selected = useSelector((state) => state.selectedKeys.includes(nodeKey));

  const subSelected = useSelector((state) => {
    if (state.selectedKeys.includes(nodeKey)) {
      return false;
    }
    const path = state.treeData.get(nodeKey)?._path;
    return state.selectedKeys.some((key) => {
      return state.treeData.get(key)?._path!.startsWith(path!);
    });
  });

  const indentNumber = useSelector((state) => state.indent);

  const iconRender = useSelector(
    (state) => state.iconRender || defaultIconRender
  );
  const contentRender = useSelector(
    (state) => state.contentRender || defaultContentRender
  );

  const toggleDisplay = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (opened) {
        context.dispatch({
          type: 'trigger',
          payload: {
            openKey: undefined,
            closeKeys: [nodeKey],
          },
        });
      } else {
        context.openChange(nodeKey, []);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [opened]
  );

  const handleClick = useCallback((e: React.MouseEvent) => {
    context.select(nodeKey, e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parentSelectNodes = useSelector((state) => {
    const my = state.treeData!.get(nodeKey);
    if (!my || !my.parentKey) {
      return [];
    }
    const parentSelectNodes = state.expandedKeys
      .map((key) => state.treeData!.get(key)!)
      .filter((item) => !!item)
      .filter((item) => {
        return my._path!.startsWith(item._path!);
      });
    return parentSelectNodes;
  });

  function hasIndentActive(i: number) {
    return parentSelectNodes.some((item) => {
      if (item.level !== i + 1) {
        return false;
      }
      const state = context.getState();
      if (state.selectedKeys.includes(item.key)) {
        return true;
      }
      return state.selectedKeys.some(
        (key) =>
          state.treeData.get(key)?.parentKey === item.key &&
          !state.expandedKeys.includes(key)
      );
    });
  }

  if (nodeRender) {
    return nodeRender(
      {
        onClick: handleClick,
        data,
        className: classnames(
          'asany-treeview-node',
          className,
          `level-${level}`,
          {
            sub_selected: subSelected,
            selected: selected,
          }
        ),
      },
      ref
    );
  }

  return (
    <div
      onClick={handleClick}
      ref={ref}
      className={classnames(
        'asany-treeview-node',
        className,
        `level-${level}`,
        {
          sub_selected: subSelected,
          selected: selected,
        }
      )}
    >
      <div className="monaco-tl-row">
        <div
          className="monaco-tl-indent"
          style={{
            width: (level - 1) * (indentNumber + 8),
          }}
        >
          {renderIndentGuide(nodeKey, level - 1, indentNumber, hasIndentActive)}
        </div>
        <div
          style={{
            paddingLeft: level * indentNumber - 2 + (level - 1) * 8,
          }}
          className="monaco-tl-twistie codicon codicon-tree-item-expanded collapsible"
          onClick={isDirectory ? toggleDisplay : undefined}
        >
          {isDirectory && (opened ? <OpenDirectory /> : <ClosedDirectory />)}
        </div>
        <div className="monaco-tl-contents">
          <div className="monaco-icon-label">
            {iconRender && iconRender(data, { isDirectory, opened })}
            <div className="monaco-icon-label-container">
              {contentRender && contentRender(data, { rowIndex })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(TreeNode);
