import { INavigationStrategy, NavigationElement } from "$types/common/navigation";

import { Context } from "./context";
import { DefaultNavigationStrategy } from "../strategies/navigationStrategy";

export class NavigationContext implements Context<NavigationElement> {
  strategy: INavigationStrategy<NavigationElement>;

  constructor(role: string) {
    this.strategy = this.getStrategyForRole(role);
  }

  getStrategyForRole(role: string): INavigationStrategy<NavigationElement> {
    switch (role) {
      default:
        return new DefaultNavigationStrategy();
    }
  }
}
