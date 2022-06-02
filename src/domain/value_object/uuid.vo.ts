import {WrongUuid} from '@/domain/value_object/exceptions/wrong_uuid';

export class Uuid{
  private  uuidPattern: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  private _uuidString: string;
  constructor(uuidString: string){
    const isValid = this.isValidUuid(uuidString)
    if (!isValid){
      throw new WrongUuid('WRONG_UUID');
    }
    this._uuidString = uuidString;
  }

  public asString(): string{
    return this._uuidString;
  }

  private isValidUuid(uuidString: string){
    const s = uuidString.match(this.uuidPattern);
    if (s === null) {
      return false;
    }
    return true;
  }
}