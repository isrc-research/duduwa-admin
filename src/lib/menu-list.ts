import { PersonIcon } from "@radix-ui/react-icons";
import {
  LayoutGrid,
  LucideIcon,
  LandPlot,
  UsersRound,
  AreaChart,
  FormInput,
  GitPullRequest,
  Building2,
  ScanBarcode,
  Store,
  User2Icon,
  Paperclip,
  Home,
  PersonStanding,
  Cloud,
} from "lucide-react";

export type Role = "admin" | "superadmin" | "enumerator";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  roles?: Role[];
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  roles?: Role[];
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

const menuConfig: Menu[] = [
  {
    href: "/",
    label: "गृहपृष्ठ",
    icon: LayoutGrid,
    roles: ["admin", "superadmin", "enumerator"],
  },
  {
    href: "/qr-code",
    label: "क्यूआर कोड",
    icon: ScanBarcode,
    roles: ["enumerator"],
  },
  {
    href: "/requested-areas",
    label: "अनुरोध गरिएका क्षेत्रहरू",
    icon: LandPlot,
    roles: ["enumerator"],
  },
  {
    href: "/account",
    label: "प्रयोगकर्ता खाता",
    icon: User2Icon,
    roles: ["enumerator"],
  },
  {
    href: "/collections",
    label: "मेरो संकलनहरू",
    icon: Paperclip,
    roles: ["enumerator"],
  },

  {
    href: "/ward",
    label: "वडाहरू",
    icon: AreaChart,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/area",
    label: "क्षेत्रहरू",
    icon: LandPlot,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/buildings",
    label: "भवनहरू",
    icon: Building2,
    roles: ["admin", "superadmin"],
  },
  {
    href: "/businesses",
    label: "व्यवसायहरू",
    icon: Store,
    roles: ["admin", "superadmin"],
  },
  {
    href: "/families",
    label: "परिवारहरू",
    icon: UsersRound,
    roles: ["admin", "superadmin"],
  },
  {
    href: "/submissions",
    label: "पेश गरिएका डाटा",
    icon: Paperclip,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/wardwise",
    label: "वडागत डाटा",
    icon: Home,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/enumeratorwise",
    label: "सर्वेक्षक अनुसार डाटा",
    icon: PersonStanding,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/aggregate",
    label: "समग्र डाटा",
    icon: Cloud,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/individuals",
    label: "व्यक्तिहरू",
    icon: User2Icon,
    roles: ["admin", "superadmin"],
  },
  {
    href: "/deaths",
    label: "मृत्युहरू",
    icon: GitPullRequest,
    roles: ["admin", "superadmin"],
  },
  {
    href: "/enumerators",
    label: "सर्वेक्षकहरू",
    icon: UsersRound,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
];

export function getMenuList(pathname: string, userRole: Role): Group[] {
  const filteredMenus = menuConfig.filter(
    (menu) => !menu.roles || menu.roles.includes(userRole),
  );

  return [
    {
      groupLabel: "",
      menus: filteredMenus,
    },
  ];
}
