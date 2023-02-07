import { MasterEntity } from 'models/MasterEntity';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { MasterData } from './MasterData';


ObjectField(MasterEntity)(MasterData.prototype, nameof(MasterData.prototype.masterEntity));

export * from './MasterData';
export * from './MasterDataFilter';

