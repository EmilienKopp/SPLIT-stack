import { InertiaForm } from "$lib/inertia";
import { Paginated } from "$types/pagination";

/**
 * Represents a column header configuration for data tables.
 * @template T - The type of data row object
 * @template V - The type of value being formatted (defaults to any)
 */
export type DataHeader<T, V = any> = {
  /** Unique identifier for the column */
  key: string;
  /** Display label for the column header */
  label: string;
  /** Optional function to format the cell value */
  formatter?: (value: V) => string;
  /** Optional function to combine multiple fields into a single display value */
  combined?: (row: T) => string;
  /** Optional function to return an icon component for the cell */
  icon?: (row: T) => any;
  /** Whether to only show the icon without any text */
  iconOnly?: boolean;
  /** Optional function to return CSS classes for the icon */
  iconClass?: (row: T) => string;
  /** Whether this column should be included in search operations */
  searchable?: boolean;
  /** Optional function to filter rows based on form state */
  filterHandler?: (row: T, form: InertiaForm<any>) => boolean;
};

/**
 * Represents an action that can be performed on a table row.
 * @template T - The type of data row object
 */
export type DataAction<T> = {
  /** Display label for the action */
  label: string;
  /** Optional callback function when action is triggered */
  callback?: (row: T) => void;
  /** Optional function to determine if action should be disabled */
  disabled?: (row: T) => boolean;
  /** Optional function to return an icon component */
  icon?: (row: T) => any;
  /** Optional function to return CSS classes */
  css?: (row: T) => string;
  /** Optional function to determine if action should be hidden */
  hidden?: (row: T) => boolean;
  /** Optional function to return a URL for link actions */
  href?: (row: T) => string;
  /** Optional position index for ordering multiple actions */
  position?: number;
};

/**
 * Interface for implementing data display strategies.
 * @template T - The type of data row object
 */
export interface IDataStrategy<T> {
  /** Returns the column headers, optionally modified by actions */
  headers(h?: DataAction<T>[] | undefined): DataHeader<T>[];
  /** Returns the available actions, optionally modified by existing actions */
  actions(h?: DataAction<T>[] | undefined): DataAction<T>[];
  /** Optional handler for row click events */
  handleRowClick?(model: T): void;
  /** Optional method to set filters on headers */
  setFilters?(
    filters: {
      key: string;
      filterHandler: ((row: T, form: InertiaForm<any>) => boolean) | undefined;
    }[]
  ): void;
}

/**
 * Configuration object for table components.
 * @template T - The type of data row object
 */
export type TableConfig<T> = {
  /** Array of data rows */
  data: T[];
  /** Strategy implementation for handling table behavior */
  strategy: IDataStrategy<T>;
  /** Optional override for column headers */
  headers?: DataHeader<T>[];
  /** Optional override for row actions */
  actions?: DataAction<T>[];
  /** Optional search string for filtering */
  search?: string;
  /** Optional array of filter configurations */
  filters?: { key: string; filterHandler: ((row: T, form: InertiaForm<any>) => boolean) | undefined; }[];
  /** Optional loading state indicator */
  loading?: boolean;
  /** Optional error message */
  error?: string;
};

/**
 * Props interface for table components.
 * @template T - The type of data row object
 */
export interface ITableProps<T> {
  /** Optional array of data rows */
  data?: T[];
  /** Whether the data is paginated */
  paginated: boolean;
  /** Optional paginated data object */
  paginatedData?: Paginated<T>;
  /** Array of column header configurations */
  headers: DataHeader<T>[];
  /** Optional handler for row click events */
  onRowClick?: (row: T) => void;
  /** Optional handler for row deletion */
  onDelete?: (row: T) => void;
  /** Type of model being displayed */
  model: 'employer' | 'job' | 'user' | 'application' | 'candidate';
  /** Optional CSS class string */
  className?: string;
  /** Optional array of row actions */
  actions?: DataAction<T>[];
  /** Optional array of strings to search within */
  searchStrings?: string[];
}

/**
 * A type that extends a given type T with an optional index property.
 * @template T - The base type to extend
 */
export type Indexed<T> = T & { index?: number };

/**
 * A type that extends TableHeader with an optional index property.
 * @template T - The type of data row object
 */
export type ExtendedHeader<T> = Indexed<DataHeader<T>>;

/**
 * A type that extends TableAction with an optional index property.
 * @template T - The type of data row object
 */
export type ExtendedAction<T> = Indexed<DataAction<T>>;