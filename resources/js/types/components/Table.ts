import { InertiaForm } from "$lib/inertia";
import { Paginated } from "$types/pagination";

export type TableHeader<T, V = any> = {
  key: string;
  label: string;
  formatter?: (value: V) => string;
  combined?: (row: T) => string;
  icon?: (row: T) => any;
  iconOnly?: boolean;
  iconClass?: (row: T) => string;
  searchable?: boolean;
  filterHandler?: (row: T, form: InertiaForm<any>) => boolean;
};

/**
 * TableAction interface
 * @param label - The label of the action.
 * @param callback - The callback function to execute when the action is clicked.
 * @disabled - The disabled function to determine if the action is disabled.
 * @icon - The icon function to determine the icon of the action. Could return a Component.
 * @css - The css function to determine the css class of the action.
 * @hidden - The hidden function to determine if the action is hidden.
 * @href - The href function to determine the href of the action.
 * @position - The position of the action in the list [start at 1]
 */
export type TableAction<T> = {
  label: string;
  callback?: (row: T) => void;
  disabled?: (row: T) => boolean;
  icon?: (row: T) => any;
  css?: (row: T) => string;
  hidden?: (row: T) => boolean;
  href?: (row: T) => string;
  position?: number;
};

export interface TableStrategy<T> {
  headers(h?: TableAction<T>[] | undefined): TableHeader<T>[];
  actions(h?: TableAction<T>[] | undefined): TableAction<T>[];
  handleRowClick?(model: T): void;
  setFilters?(
    filters: {
      key: string;
      filterHandler: ((row: T, form: InertiaForm<any>) => boolean) | undefined;
    }[]
  ): void;
}

export type TableConfig<T> = {
  data: T[];
  strategy: TableStrategy<T>;
  headers?: TableHeader<T>[];
  actions?: TableAction<T>[];
  search?: string;
  filters?: { key: string; filterHandler: ((row: T, form: InertiaForm<any>) => boolean) | undefined; }[];
  loading?: boolean;
  error?: string;
};

interface TableProps<T> {
  data?: T[];
  paginated: boolean;
  paginatedData?: Paginated<T>;
  headers: TableHeader<T>[];
  onRowClick?: (row: T) => void;
  onDelete?: (row: T) => void;
  model: 'employer' | 'job' | 'user' | 'application' | 'candidate';
  className?: string;
  actions?: TableAction<T>[];
  searchStrings?: string[];
}