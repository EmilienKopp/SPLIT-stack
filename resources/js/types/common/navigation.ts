export type NavigationElement = {
  name: string;
  href: string;
  active: boolean;
}

export interface INavigationStrategy<T>  {
  navigationElements(): T[];
}