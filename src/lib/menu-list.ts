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
    label: "Home",
    icon: LayoutGrid,
    roles: ["admin", "superadmin", "enumerator"],
  },
  {
    href: "/qr-code",
    label: "QR Code",
    icon: ScanBarcode,
    roles: ["enumerator"],
  },
  {
    href: "/requested-areas",
    label: "Requested Areas",
    icon: LandPlot,
    roles: ["enumerator"],
  },
  {
    href: "/account",
    label: "User Account", 
    icon: User2Icon,
    roles: ["enumerator"],
  },
  {
    href: "/collections",
    label: "My Collections", 
    icon: Paperclip,
    roles: ["enumerator"],
  },
  
  {
    href: "/ward",
    label: "Wards",
    icon: AreaChart,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/area", 
    label: "Areas",
    icon: LandPlot,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/buildings",
    label: "Buildings",
    icon: Building2,
    roles: ["admin", "superadmin"],
  },
  {
    href: "/businesses",
    label: "Businesses", 
    icon: Store,
    roles: ["admin", "superadmin"],
  },
  {
    href: "/families",
    label: "Families",
    icon: UsersRound,
    roles: ["admin", "superadmin"],
  },
{
    href: "/submissions",
    label: "Submissions",
    icon: Paperclip, 
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href:"/wardwise",
    label: "Wardwise Data",
    icon:Home,
    roles: ["admin", "superadmin"],
    submenus:[],
  },
 {
    href:"/enumeratorwise",
    label: "Enumerator Wise Data",
    icon:PersonStanding,
    roles: ["admin", "superadmin"],
    submenus:[],
  },
  {
    href: "/individuals",
    label: "Individuals",
    icon: User2Icon,
    roles: ["admin", "superadmin"],
  },
  {
    href: "/deaths",
    label: "Deaths",
    icon: GitPullRequest,
    roles: ["admin", "superadmin"],
  },
  {
    href: "/enumerators",
    label: "Enumerators",
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
