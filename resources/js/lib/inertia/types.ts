export type InertiaForm<T> = {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  processing: boolean;
  progress: { percentage: number };
  wasSuccessful: boolean;
  recentlySuccessful: boolean;
  isDirty: boolean;
  setData(key: keyof T, value: any): void;
  get(url: string, options?: object): any;
  post(url: string, options?: object): void;
  put(url: string, options?: object): void;
  patch(url: string, options?: object): void;
  delete(url: string, options?: object): void;
  reset(...fields: (keyof T)[]): void;
  clearErrors(...fields: (keyof T)[]): void;
  submit(method: string, url: string, options?: object): void;
  transform(callback: (data: T) => object): void;
} & T;
