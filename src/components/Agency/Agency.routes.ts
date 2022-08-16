interface TabType {
  title: string;
  url: string;
}

type TabsType = TabType[];

const agencyRoutes: TabsType = [
  {
    title: "Allgemeines",
    url: "/general",
  },
  {
    title: "Erstberatung",
    url: "/initial-meeting",
  },
];

export default agencyRoutes;
