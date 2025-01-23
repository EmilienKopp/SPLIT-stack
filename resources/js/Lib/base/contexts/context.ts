import { IDataStrategy } from "$types/common/dataDisplay";
import { INavigationStrategy } from "$types/common/navigation";

export type Strategy<T> = 
  IDataStrategy<T> 
  | INavigationStrategy<T>;

export interface Context<T = any> {
  strategy: Strategy<T>;
  getStrategyForRole(role: string): Strategy<T>;
}
