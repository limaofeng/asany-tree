import React from 'react';

import * as ReactDOM from 'react-dom';

import { Default as TreeDemo } from '../stories/Tree.stories';

describe('Tree', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TreeDemo />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
