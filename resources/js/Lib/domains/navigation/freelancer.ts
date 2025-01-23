import type { INavigationStrategy, NavigationElement } from "$types/common/navigation";

export class FreelancerNavigationStrategy implements INavigationStrategy<NavigationElement> {
  navigationElements(): NavigationElement[] {
    return [
      {
        name: 'Dashboard',
        href: route('dashboard'),
        active: false,
      },
      {
        name: 'Projects',
        href: route('projects.index'),
        active: false,
      },
      {
        name: 'Organizations',
        href: route('organizations.index'),
        active: false,
      },
    ];
  }
}