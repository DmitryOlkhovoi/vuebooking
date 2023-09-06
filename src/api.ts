import type { AirPort } from './types'

export function fetchAirportsFromKayak(input: string): Promise<AirPort[]> {
  return fetch(
    `https://www.kayak.com/mvm/smartyv2/search?f=j&s=13&v=v1&lc=en&lc_cc=EN&where=${input}`
  ).then((res) => res.json())
}
