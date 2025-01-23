

interface Props {
  /** Data to display in the table. Can be an array or paginated data */
  data?: ITableProps<any>['data'] | ITableProps<any>['paginatedData'];
  
  /** Whether the data is paginated */
  paginated?: ITableProps<any>['paginated'];
  
  /** Paginated data object if using pagination */
  paginatedData?: ITableProps<any>['paginatedData'];
  
  /** Array of column headers defining the table structure */
  headers?: ITableProps<any>['headers'];
  
  /** Handler called when a row is clicked */
  onRowClick?: ITableProps<any>['onRowClick'];
  
  /** Handler for deleting rows */
  onDelete?: ITableProps<any>['onDelete'];
  
  /** Model type name for the data being displayed */
  model?: ITableProps<any>['model'];
  
  /** Additional CSS classes to apply to the table */
  className?: string;
  
  /** Array of action buttons to display for each row */
  actions?: ITableProps<any>['actions'];
  
  /** Array of strings to search for. Header should be marked `searchable` */
  searchStrings?: ITableProps<any>['searchStrings'];
}