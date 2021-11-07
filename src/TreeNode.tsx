import React, { CSSProperties, useCallback } from 'react';

import classnames from 'classnames';

import { ClosedDirectory, OpenDirectory } from './icon';
import { useSelector, useTreeDataContext } from './TreeDataProvider';
import { NodeData } from './typings';

type TreeNodeProps = {
  level: number;
  nodeKey: string;
  data: NodeData;
  icon: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  isDirectory: boolean;
};

function TreeNode(props: TreeNodeProps, ref: any) {
  const { children, level, icon, className, isDirectory, nodeKey } = props;

  const context = useTreeDataContext();
  const opened = useSelector((state) => state.expandedKeys.includes(nodeKey));
  const selected = useSelector((state) => state.selectedKeys.includes(nodeKey));

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
      .filter((item) => {
        return my.path!.startsWith(item.path!);
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

  return (
    <div
      onClick={handleClick}
      ref={ref}
      className={classnames('asany-treeview-node', className, {
        selected: selected,
      })}
    >
      <div className="monaco-tl-row">
        <div className="monaco-tl-indent" style={{ width: (level - 1) * 8 }}>
          {[...Array(level - 1)].map((_, i) => (
            <div
              key={`${nodeKey}-${i}`}
              className={classnames('indent-guide', {
                active: hasIndentActive(i),
              })}
              style={{ width: 8 }}
            ></div>
          ))}
        </div>
        <div
          style={{ paddingLeft: level * 8 - 2 }}
          className="monaco-tl-twistie codicon codicon-tree-item-expanded collapsible"
          onClick={isDirectory ? toggleDisplay : undefined}
        >
          {isDirectory && (opened ? <OpenDirectory /> : <ClosedDirectory />)}
        </div>
        <div className="monaco-tl-contents">
          <div className="monaco-icon-label">
            <div style={{ height: 24, paddingRight: 6 }}>{icon}</div>
            <div className="monaco-icon-label-container">
              <span className="monaco-icon-name-container">
                <span className="label-name">
                  <span className="monaco-highlighted-label">
                    <span>{children}</span>
                  </span>
                </span>
              </span>
              <span className="monaco-icon-description-container"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(TreeNode);
