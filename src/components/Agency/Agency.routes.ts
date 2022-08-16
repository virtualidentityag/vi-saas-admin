interface TabType {
  title: string;
  url: string;
  condition?: (show: boolean) => void;
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
    condition: (show) => show,
  },
];

export default agencyRoutes;
