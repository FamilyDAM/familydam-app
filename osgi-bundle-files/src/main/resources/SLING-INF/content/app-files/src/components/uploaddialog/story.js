import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import UploadDialog from "../uploaddialog/UploadDialog";


storiesOf('UploadDialog', module)
  .add('drag-n-drop', () => (
      <UploadDialog
          onClose={action("close")}
          open={true}
          path="/content/family/files/mike/Photos/test"></UploadDialog>
  ));
