import { INavigationStrategy, NavigationElement } from "$types/common/navigation";

export class EmployerNavigationStrategy implements INavigationStrategy<NavigationElement> {
  navigationElements(): NavigationElement[] {
    return [
      {
        name: 'Dashboard',
        href: route('dashboard'),
        active: false,
      },
    ];
  }
}