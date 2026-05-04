export interface DomainResponse<T> {
  data: T | null;
  error: Error | null;
}
