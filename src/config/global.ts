import { AppUser } from 'models/AppUser';

export interface GlobalState {
  loading: boolean;

  language: string;

  fallbackLanguage: string;
  user?: AppUser;

  toggleSideBar: boolean;

}

export const initialGlobalState: GlobalState = {
  loading: false,
  language: 'vi',
  fallbackLanguage: 'vi',
  user: null,
  toggleSideBar: true,
};
