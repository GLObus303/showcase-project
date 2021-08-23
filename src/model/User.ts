export type UserInfoType = {
  id: string;
} & AuthUserInfoType;

export type AuthUserInfoType = {
  name: string;
  group: 'basic' | 'owner' | 'admin' | 'superadmin';
};
