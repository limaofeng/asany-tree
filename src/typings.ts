import { DragCondition, SortableTag } from '@asany/sortable';

export type TreeNode = {
  key: string;
  icon?: React.ReactNode;
  title: React.ReactNode;
  isLeaf?: boolean;
  children?: TreeNode[];
};

export type NodeData = TreeNode & {
  _path?: string;
  level?: number;
  parentKey?: string;
  children?: NodeData[];
  disabled?: boolean;
  selectable?: boolean;
  [key: string]: any;
};

export type IconRender = (
  node: TreeNode,
  state: { isDirectory: boolean; opened: boolean }
) => React.ReactNode;

export type ContentRender = (
  node: TreeNode,
  state: {
    rowIndex: number;
  }
) => React.ReactNode;

export type TreeViewProps = {
  /**
   * React-Dnd Drop 的 accept 默认为 sortable-card
   */
  accept: string[];
  /**
   * 标签
   */
  tag: SortableTag;
  /**
   * 数据
   */
  treeData: TreeNode[];
  /**
   * 是否允许拖拽时放置在该节点
   */
  allowDrop?: AllowDropFunc;
  /**
   * 是否可以拖拽
   */
  draggable?: DragCondition;
  /**
   * dragenter 触发时调用
   */
  onDragEnter?: OnDragEnter;
  /**
   * 图标渲染
   */
  iconRender?: IconRender;
  /**
   * 内容渲染
   */
  contentRender?: ContentRender;
  /**
   * drop 触发时调用
   */
  onDrop?: OnDrop;
  /**
   * 展开/收起节点时触发
   */
  onExpand?: OnExpand;
  className?: string;
  selectedKeys?: string[];
  expandedKeys?: string[];
  defaultSelectedKeys?: string[];
  defaultExpandedKeys?: string[];
  onSelect?: EventCallback<SelectEvent>;
  onClick?: EventCallback<ClickEvent>;
  onOpenChange?: OpenCallback;
};

export interface TreeEvent {
  node: NodeData;
  key: string;
}

type DragNode = NodeData;

export type AllowDropInfo = {
  node: NodeData;
  dragNode: DragNode;
  dropPosition: number;
};

export type AllowDropFunc = (info: AllowDropInfo) => boolean;

interface DragEnterEvent extends TreeEvent {
  node: NodeData;
}

export type OnDragEnter = EventCallback<DragEnterEvent>;

export interface DropEvent extends TreeEvent {
  node: NodeData;
  dragNode: NodeData;
  dropPosition: number;
}

export type OnDrop = EventCallback<DropEvent>;

interface ExpandEvent extends TreeEvent {
  expanded: boolean;
  node: NodeData;
}

export type OnExpand = (expandedKeys: string, e: ExpandEvent) => void;

export type OpenCallback = (openKeys: string[]) => void;

export type EventCallback<T extends TreeEvent> = (e: T) => void;

export type ClickEvent = SelectEvent;

export interface SelectEvent extends TreeEvent {
  node: any;
  key: string;
  keyPath: string;
  selectedKeys: string[];
  domEvent: any;
}

export type TreeDataState = {
  version: number;
  onDrop?: any;
  draggable: DragCondition;
  allowDrop?: AllowDropFunc;
  treeData: Map<string, NodeData>;
  selectedKeys: string[];
  expandedKeys: string[];
  iconRender?: IconRender;
  contentRender?: ContentRender;
};

export type TreeDataProviderProps = {
  version: number;
  allowDrop?: AllowDropFunc;
  draggable: DragCondition;
  onDrop?: OnDrop;
  onDragEnter?: OnDragEnter;
  onExpand?: OnExpand;
  children: React.ReactNode;
  selectedKeys?: string[];
  expandedKeys?: string[];
  state: TreeDataState;
  onClick?: EventCallback<ClickEvent>;
  onSelect?: EventCallback<SelectEvent>;
  onOpenChange?: OpenCallback;
  iconRender?: IconRender;
  contentRender?: ContentRender;
};

export type TreeDataAction = {
  type:
    | 'update'
    | 'version'
    | 'data'
    | 'select'
    | 'trigger'
    | 'expandedKeys'
    | 'selectedKeys';
  payload?: any;
};

export type UnsubscribeFunc = () => void;

export type SubscribeCallback = () => void;

export type DispatchWithoutAction = (action: TreeDataAction) => void;
