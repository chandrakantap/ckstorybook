import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TextAnnotator from '../../textannotator/TextAnnotator';

export default {
    title: 'Example/TextAnnotator',
    component: TextAnnotator,
  } as ComponentMeta<typeof TextAnnotator>;

const Template: ComponentStory<typeof TextAnnotator> = (args) => <TextAnnotator {...args} />;

export const Default = Template.bind({});
Default.args = {};