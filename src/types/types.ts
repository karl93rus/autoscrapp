export interface ItemInfo {
  href: string;
  name: string;
  price: string;
}

export interface CarData {
  name: string
  price: string
  img: string
  params?: { [k: string]: string }[],
  url?: string
}