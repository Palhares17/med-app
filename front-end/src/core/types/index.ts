/** Sort direction for list queries */
export type SortDirection = "asc" | "desc"

/** Common sort options */
export interface SortOptions {
  field: string
  direction: SortDirection
}

/** Filter options for list queries */
export interface FilterOptions {
  search?: string
  subject?: string
  dateFrom?: string
  dateTo?: string
}

/** Loading states for async operations */
export type AsyncStatus = "idle" | "loading" | "success" | "error"
