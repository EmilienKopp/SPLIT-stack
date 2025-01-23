import { INavigationStrategy, NavigationElement } from "$types/common/navigation";

import { Context } from "./context";
import { DefaultNavigationStrategy } from "../strategies/navigationStrategy";
import { EmployerNavigationStrategy } from "$lib/domains/navigation/employer";
import { FreelancerNavigationStrategy } from "$lib/domains/navigation/freelancer";

export class NavigationContext implements Context<NavigationElement> {
  strategy: INavigationStrategy<NavigationElement>;

  constructor(role: string) {
    this.strategy = this.getStrategyForRole(role);
  }

  getStrategyForRole(role: string): INavigationStrategy<NavigationElement> {
    switch (role) {
      case 'freelancer':
        return new FreelancerNavigationStrategy();
      case 'employer':
        return new EmployerNavigationStrategy();
      default:
        return new DefaultNavigationStrategy();
    }
  }
}
