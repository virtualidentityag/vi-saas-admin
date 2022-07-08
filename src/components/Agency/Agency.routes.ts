interface TabType {
  title: string;
  url: string;
}

type TabsType = TabType[];

const agencyRoutes: TabsType = [
  {
    title: "Allgemeines",
    url: "/allgemeines",
  },
  {
    title: "Erstberatung",
    url: "/erstberatung",
  },
];

export default agencyRoutes;
