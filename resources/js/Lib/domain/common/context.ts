import type { Role } from "$models";
import { TableStrategy } from "$types/components/Table";

export interface TableContext<T> {
  strategy: TableStrategy<T>;
  getStrategyForRole(role: Role): TableStrategy<T>;
}
