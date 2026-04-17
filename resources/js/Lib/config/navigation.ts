import type { NavigationElement } from '$types/common/navigation';

const configs: Record<string, () => NavigationElement[]> = {
  example: () => [
    {
      name: 'Reports',
      href: route('report.index'),
    },
  ],
};

const defaultConfig = (): NavigationElement[] => [
  {
    name: 'Home',
    href: '/dashboard',
    active: false,
  },
];

export function getNavigationConfig(role: string): NavigationElement[] {
  return (configs[role] ?? defaultConfig)();
}
