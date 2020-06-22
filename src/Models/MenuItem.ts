export interface MenuItem {
  title?: string;
  url?: string;
  imageUrl?: string;
  subMenu?: MenuItem[];
  external?: boolean;
}
