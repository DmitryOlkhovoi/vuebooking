export enum TRIP_TYPE {
  ROUND = 'ROND',
  ONE_WAY = 'ONE_WAY'
}

export enum CLASS_TYPE {
  ECONOMY = 'ECONOMY',
  BUSNESS = 'BUSNESS',
  FIRST = 'FIRST'
}

export interface SelectOption {
  name: string
  code: string
}

export interface AirPort {
  displayname: string
  cityname: string
}
