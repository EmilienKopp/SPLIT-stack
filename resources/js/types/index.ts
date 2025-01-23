import type { User as UserModel } from '$models';

export type User = UserModel;

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  },
  enums: {
    roles: SelectOption[];

  }
};