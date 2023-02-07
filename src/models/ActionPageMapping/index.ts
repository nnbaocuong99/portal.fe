import { Action } from 'models/Action';
import { Page } from 'models/Page';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { ActionPageMapping } from './ActionPageMapping';


ObjectField(Action)(ActionPageMapping.prototype, nameof(ActionPageMapping.prototype.action));
ObjectField(Page)(ActionPageMapping.prototype, nameof(ActionPageMapping.prototype.page));

export * from './ActionPageMapping';
export * from './ActionPageMappingFilter';

