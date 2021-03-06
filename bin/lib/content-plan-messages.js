'use strict';

const chalk = require('chalk');
const _ = require('lodash');

const getMainAction = function (chunk) {
  if (chunk.find((step) => step.type === 'contentType/create')) {
    return 'contentType/create';
  } else if (chunk.find((step) => step.type === 'contentField/copy')) {
    return 'contentField/copy';
  } else if (chunk.find((step) => step.type === 'content/transform')) {
    return 'content/transform';
  }
  return 'contentType/update';
};

const renderChunk = (chunk, errors) => {
  const message = [];
  const mainAction = getMainAction(chunk);
  const contentType = chunk[0].payload.contentTypeId;

  if (mainAction === 'contentType/create') {
    message.push(chalk`{bold.underline Create Content Type} {bold.yellow ${contentType}}`);
  } else if (mainAction === 'contentType/update') {
    message.push(chalk`{bold.underline Update Content Type} {bold.yellow ${contentType}}`);
  } else if (mainAction === 'contentField/copy' || mainAction === 'content/transform') {
    message.push(chalk`{bold.underline Modify Contents of} {bold.yellow ${contentType}}`);
    chunk.forEach((step) => {
      if (step.type === 'contentField/copy') {
        message.push(chalk`\n  Copy field {yellow ${step.payload.fromId}} to {yellow ${step.payload.toId}}`);
      } else if (step.type === 'content/transform') {
        message.push(chalk`\n  Apply transformation function \n    {yellow ${step.transform}}`); 
      }
    });
  }

  const contentTypeChanges = chunk.filter((step) => step.type.startsWith('contentType'));

  for (const ctChange of contentTypeChanges) {
    if (ctChange.payload.props) {
      for (const key of Object.keys(ctChange.payload.props)) {
        const value = ctChange.payload.props[key];
        message.push(chalk`  - {italic ${key}:} ${value}`);
      }
    }
  }

  const fieldChanges = chunk.filter((step) => step.type.startsWith('field'));
  const fieldChangesByField = _.groupBy(fieldChanges, (step) => step.payload.fieldId);

  for (const fieldId of Object.keys(fieldChangesByField)) {
    const fieldChanges = fieldChangesByField[fieldId];
    const firstChange = fieldChanges[0];

    if (firstChange.type === 'field/create') {
      message.push(chalk`\n  {bold Create field {yellow ${firstChange.payload.fieldId}}}`);
    }
    if (firstChange.type === 'field/update') {
      message.push(chalk`\n  {bold Update field {yellow ${firstChange.payload.fieldId}}}`);
    }

    for (const fieldChange of fieldChanges) {
      if (fieldChange.payload.props) {
        for (const key of Object.keys(fieldChange.payload.props)) {
          const value = JSON.stringify(fieldChange.payload.props[key]);
          message.push(chalk`    - {italic ${key}:} ${value}`);
        }
      }
    }
  }

  if (errors) {
    message.push('\n');
    for (const error of errors) {
      message.push(chalk`{red.bold Error: ${error.message}}`);
    }
  }

  if (mainAction === 'contentField/copy' || mainAction === 'content/transform') {
    message.push(chalk`\n{bold.underline Publish Contents of} {bold.yellow ${contentType}}`);
  } else {
    message.push(chalk`\n{bold.underline Publish Content Type} {bold.yellow ${contentType}}`);
  }

  return message.join('\n');
};

module.exports = {
  withErrors: (planAndErrors) => {
    const messages = planAndErrors.map(([chunk, errors]) => {
      return renderChunk(chunk, errors);
    });

    const prefix = chalk`{bold.red The following migration has been planned but cannot be run because it contains errors}\n\n`;
    const renderedPlan = messages.join('\n\n');

    return prefix + renderedPlan + '\n';
  },
  withoutErrors: (plan) => {
    const messages = plan.map((chunk) => {
      return renderChunk(chunk);
    });

    return messages.join('\n\n');
  }
};
