export abstract class BaseDto<T,S>{
  constructor(protected dto: S){}
  abstract toEntity():T;
}