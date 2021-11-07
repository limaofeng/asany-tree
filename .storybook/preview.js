import { configure } from '@storybook/react';

const loaderFn = () => {
  const allExports = [
    require('../stories/docs/Welcome.stories.mdx'),
    require('../stories/docs/Changelog.stories.mdx'),
    require('../stories/Tree.stories.tsx'),
  ];
  return allExports;
};

configure(loaderFn, module);

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
  // layout: 'fullscreen',
};
