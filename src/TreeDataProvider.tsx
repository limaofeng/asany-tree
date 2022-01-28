import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import EventEmitter from 'events';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  AllowDropInfo,
  NodeData,
  SubscribeCallback,
  TreeDataAction,
  TreeDataProviderProps,
  UnsubscribeFunc,
} from './typings';
import type {
  EventCallback,
  OpenCallback,
  SelectEvent,
  TreeDataState,
  TreeEvent,
} from './typings';

const reducer = (state: TreeDataState, action: TreeDataAction) => {
  if (action.type === 'update') {
    return { ...state, ...action.payload };
  }
  if (action.type === 'data') {
    return { ...state, treeData: action.payload };
  }
  if (action.type === 'version') {
    return { ...state, version: action.payload };
  }
  if (action.type === 'select') {
    return { ...state, selectedKeys: [action.payload] };
  }
  if (action.type === 'expandedKeys') {
    return { ...state, expandedKeys: action.payload };
  }
  if (action.type === 'selectedKeys') {
    return { ...state, selectedKeys: action.payload };
  }
  if (action.type === 'trigger') {
    const { openKey, closeKeys = [] } = action.payload;
    const set = new Set(state.expandedKeys);
    closeKeys.forEach(set.delete.bind(set));
    if (openKey) {
      set.add(openKey);
    }
    console.log(set);
    return { ...state, expandedKeys: Array.from(set) };
  }
  return state;
};

const TREE_EVENT_CLICK = 'click';

const TREE_EVENT_SELECT = 'select';

const TREE_EVENT_EXPANDED = 'expandedKeys';

const TREE_EVENT_DRAGENTER = 'dragenter';

const TREE_EVENT_DROP = 'drop';

type TREE_EVENT_NAMES =
  | typeof TREE_EVENT_SELECT
  | typeof TREE_EVENT_EXPANDED
  | typeof TREE_EVENT_CLICK
  | typeof TREE_EVENT_DRAGENTER
  | typeof TREE_EVENT_DROP;

class TreeDataStoreContext {
  private _eventEmitter = new EventEmitter();
  private _state: TreeDataState;
  private _listeners: SubscribeCallback[] = [];
  constructor(state: TreeDataState) {
    this._state = state;
  }
  getState() {
    return this._state;
  }
  subscribe(callback: SubscribeCallback): UnsubscribeFunc {
    this._listeners.unshift(callback);
    return this.unsubscribe(callback);
  }
  unsubscribe(callback: SubscribeCallback): UnsubscribeFunc {
    return () => {
      const index = this._listeners.indexOf(callback);
      if (index > -1) {
        this._listeners.splice(index, 1);
      }
    };
  }
  emit(eventName: TREE_EVENT_NAMES, event: TreeEvent) {
    this._eventEmitter.emit(eventName, event);
  }
  on<E extends TreeEvent>(
    eventName: TREE_EVENT_NAMES,
    callback: EventCallback<E> | OpenCallback
  ) {
    this._eventEmitter.on(eventName, callback);
    return () => this.off(eventName, callback);
  }
  off<E extends TreeEvent>(
    eventName: TREE_EVENT_NAMES,
    callback: EventCallback<E> | OpenCallback
  ) {
    this._eventEmitter.off(eventName, callback);
  }
  dispatchSubscribe() {
    this._listeners.forEach((listener) => listener());
  }
  openChange(openKey: string, closeKeys: string[]) {
    this.dispatch({
      type: 'trigger',
      payload: {
        openKey,
        closeKeys,
      },
    });
    this._eventEmitter.emit(TREE_EVENT_EXPANDED, this._state.expandedKeys);
  }
  select(key: string, e: React.MouseEvent) {
    this.dispatch({
      type: 'select',
      payload: key,
    });
    const item = this._state.treeData.get(key);
    if (!item) {
      return;
    }
    const event: SelectEvent = {
      key,
      keyPath: item._path!,
      node: item,
      selectedKeys: this._state.selectedKeys,
      domEvent: e,
    };
    this._eventEmitter.emit(TREE_EVENT_SELECT, event);
  }
  dispatch = (action: TreeDataAction) => {
    this._state = reducer(this._state, action);
    this.dispatchSubscribe();
  };
  removeMenuData(key: string) {
    this._state.treeData!.delete(key);
  }
  addMenuData(key: string, data: NodeData) {
    this._state.treeData!.set(key, data);
  }
  allowDrop(info: AllowDropInfo) {
    if (!this._state.allowDrop) {
      return true;
    }
    return this._state.allowDrop(info);
  }
}

export const TreeDataContext = React.createContext<TreeDataStoreContext>(
  {} as any
);

const initializer = (state: TreeDataState): any => {
  return new TreeDataStoreContext({ ...state });
};

function useStore(initState: TreeDataState): TreeDataStoreContext {
  const [store] = useState(initializer.bind(undefined, initState));
  return store;
}

export type Selector<Selected> = (state: TreeDataState) => Selected;
export type EqualityFn<Selected> = (
  theNew: Selected,
  latest: Selected
) => boolean;
const defaultEqualityFn = (a: any, b: any) => a === b;

export function useSelector<Selected>(
  selector: Selector<Selected>,
  equalityFn: EqualityFn<Selected> = defaultEqualityFn
) {
  const store = useContext<TreeDataStoreContext>(TreeDataContext)!;
  const [, forceRender] = useReducer((s) => s + 1, 0);
  const latestSelectedState = useRef<Selected>();
  const selectedState = selector(store.getState());
  function checkForUpdates() {
    const newSelectedState = selector(store.getState());
    if (equalityFn(newSelectedState, latestSelectedState.current!)) {
      return;
    }
    latestSelectedState.current = newSelectedState;
    forceRender();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => store.subscribe(checkForUpdates), []);
  return selectedState;
}

export function useTreeDataContext() {
  return useContext<TreeDataStoreContext>(TreeDataContext)!;
}

function TreeDataProvider(props: TreeDataProviderProps) {
  const {
    children,
    state,
    expandedKeys,
    selectedKeys,
    version,
    onClick,
    draggable,
    allowDrop,
    onDrop,
    onDragEnter,
    onSelect,
    nodeRender,
    iconRender,
    contentRender,
  } = props;
  const store = useStore({
    ...state,
    version,
    allowDrop,
    onDrop,
    draggable,
    nodeRender,
    iconRender,
    contentRender,
  });

  useEffect(() => {
    if (iconRender === store.getState().iconRender) {
      return;
    }
    store.dispatch({ type: 'update', payload: { iconRender } });
  }, [store, iconRender]);

  useEffect(() => {
    if (draggable === store.getState().draggable) {
      return;
    }
    store.dispatch({ type: 'update', payload: { draggable } });
  }, [store, draggable]);

  useEffect(() => {
    if (contentRender === store.getState().contentRender) {
      return;
    }
    store.dispatch({ type: 'update', payload: { contentRender } });
  }, [store, contentRender]);

  useEffect(() => {
    if (version === store.getState().version) {
      return;
    }
    store.dispatch({ type: 'version', payload: version });
  }, [store, version]);

  useEffect(() => {
    if (state.treeData === store.getState().treeData) {
      return;
    }
    store.dispatch({ type: 'data', payload: state.treeData });
  }, [state.treeData, store]);

  useEffect(() => {
    if (!expandedKeys) {
      return;
    }
    store.dispatch({ type: 'expandedKeys', payload: expandedKeys });
  }, [store, expandedKeys]);

  useEffect(() => {
    if (!selectedKeys) {
      return;
    }
    store.dispatch({ type: 'selectedKeys', payload: selectedKeys });
  }, [store, selectedKeys]);

  useEffect(() => {
    if (!onClick) {
      return;
    }
    return store.on('click', onClick);
  }, [store, onClick]);

  useEffect(() => {
    if (!onDragEnter) {
      return;
    }
    return store.on('dragenter', onDragEnter);
  }, [store, onDragEnter]);

  useEffect(() => {
    if (!onSelect) {
      return;
    }
    return store.on('select', onSelect);
  }, [store, onSelect]);

  return (
    <DndProvider backend={HTML5Backend}>
      {useMemo(
        () => (
          <TreeDataContext.Provider value={store}>
            {children}
          </TreeDataContext.Provider>
        ),
        [children, store]
      )}
    </DndProvider>
  );
}

export default TreeDataProvider;
