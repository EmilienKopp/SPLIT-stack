import type { INavigationStrategy, NavigationElement } from "$types/common/navigation";

export class DefaultNavigationStrategy implements INavigationStrategy<NavigationElement> {
  navigationElements(): NavigationElement[] {
    return [
      {
        name: 'Home',
        href: '/',
        active: false,
      },
      {
        name: 'About',
        href: '/about',
        active: false,
      }
    ];
  }
}
