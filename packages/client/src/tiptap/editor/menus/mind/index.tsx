import React from 'react';
import { Editor } from 'tiptap/editor';

import { MindBubbleMenu } from './bubble';
import { MindSettingModal } from './modal';

export const Mind: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MindBubbleMenu editor={editor} />
      <MindSettingModal editor={editor} />
    </>
  );
};
