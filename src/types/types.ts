import { ROUTE_NAMES } from "@/constants/constants"

export type MenuMetaData = {
  title: string,
  route: string,
  icon?: string,
  admin?: boolean,
  wip?: boolean,
  redirect?: boolean,
  image?: string,
}

export class MenuMetaDataImpl implements MenuMetaData {
  title: string
  route: string
  constructor() {
    this.title = ' ',
    this.route = ROUTE_NAMES.DARK
  }
}

export type Question = {
  index: number,
  image: string,
  imageAlt: string,
  background: string,
  options: Option[]
}

export type Option = {
  text: string,
  traits: string[]
}