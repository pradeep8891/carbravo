export interface ApiResponse<TData> {
  data: TData
}

export interface PaginatedResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  total: number
}
