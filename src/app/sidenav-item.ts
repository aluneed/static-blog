export interface SidenavItem {
  name: string;
  path: string;
}

export const sidenavItemList: SidenavItem[] = [
  {
    name: "Home",
    path: "/"
  },
  {
    name: 'Blog',
    path: '/blog',
  },
  {
    name: 'This Project',
    path: 'https://github.com/aluneed/static-blog',
  },
  {
    name: 'Projects',
    path: '/projects'
  },
  {
    name: "Site Map",
    path: '/sitemap'
  },
  {
    name: 'GitHub',
    path: "https://github.com/aluneed"
  },
  {
    name: 'About Me',
    path: '/about',
  }
]