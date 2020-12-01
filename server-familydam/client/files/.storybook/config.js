import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /\.story\.js$/);
function loadStories() {
  //req.keys().forEach(filename => req(filename));
  require('../src/components/uploaddialog/story.js');
  require('../src/components/filelist/story.js');
}

configure(loadStories, module);
