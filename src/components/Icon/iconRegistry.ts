import type { ComponentType, SVGProps } from "react";

import CalendarLinedIcon from "@/assets/icons/calendar-lined.svg?react";
import ChevronDownLinedIcon from "@/assets/icons/chevron-down-lined.svg?react";
import ChevronLeftLinedIcon from "@/assets/icons/chevron-left-lined.svg?react";
import ChevronRightLinedIcon from "@/assets/icons/chevron-right-lined.svg?react";
import ChevronUpLinedIcon from "@/assets/icons/chevron-up-lined.svg?react";
import CheckLinedIcon from "@/assets/icons/check-lined.svg?react";
import CheckThickLinedIcon from "@/assets/icons/check-thick-lined.svg?react";
import DeleteFilledIcon from "@/assets/icons/delete-filled.svg?react";
import DeleteLinedIcon from "@/assets/icons/delete-lined.svg?react";
import DownloadLinedIcon from "@/assets/icons/download-lined.svg?react";
import EditLinedIcon from "@/assets/icons/edit-lined.svg?react";
import HelpCircleFilledIcon from "@/assets/icons/help-circle-filled.svg?react";
import HomeFilledIcon from "@/assets/icons/home-filled.svg?react";
import HomeLinedIcon from "@/assets/icons/home-lined.svg?react";
import LinkLinedIcon from "@/assets/icons/link-lined.svg?react";
import ListFilledIcon from "@/assets/icons/list-filled.svg?react";
import ListLinedIcon from "@/assets/icons/list-lined.svg?react";
import MapLinedIcon from "@/assets/icons/map-lined.svg?react";
import MoonFilledIcon from "@/assets/icons/moon-filled.svg?react";
import MoonLinedIcon from "@/assets/icons/moon-lined.svg?react";
import MoreVerticalLinedIcon from "@/assets/icons/more-vertical-lined.svg?react";
import PlusLinedIcon from "@/assets/icons/plus-lined.svg?react";
import SearchLinedIcon from "@/assets/icons/search-lined.svg?react";
import ShareLinedIcon from "@/assets/icons/share-lined.svg?react";
import ShuffleLinedIcon from "@/assets/icons/shuffle-lined.svg?react";
import SunFilledIcon from "@/assets/icons/sun-filled.svg?react";
import SunLinedIcon from "@/assets/icons/sun-lined.svg?react";
import TrashLinedIcon from "@/assets/icons/trash-lined.svg?react";
import UserFilledIcon from "@/assets/icons/user-filled.svg?react";
import UserLinedIcon from "@/assets/icons/user-lined.svg?react";
import UserXLinedIcon from "@/assets/icons/user-x-lined.svg?react";

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const iconRegistry = {
  "calendar-lined": CalendarLinedIcon,
  "chevron-down-lined": ChevronDownLinedIcon,
  "chevron-left-lined": ChevronLeftLinedIcon,
  "chevron-right-lined": ChevronRightLinedIcon,
  "chevron-up-lined": ChevronUpLinedIcon,
  "check-lined": CheckLinedIcon,
  "check-thick-lined": CheckThickLinedIcon,
  "delete-filled": DeleteFilledIcon,
  "delete-lined": DeleteLinedIcon,
  "download-lined": DownloadLinedIcon,
  "edit-lined": EditLinedIcon,
  "help-circle-filled": HelpCircleFilledIcon,
  "home-filled": HomeFilledIcon,
  "home-lined": HomeLinedIcon,
  "link-lined": LinkLinedIcon,
  "list-filled": ListFilledIcon,
  "list-lined": ListLinedIcon,
  "map-lined": MapLinedIcon,
  "moon-filled": MoonFilledIcon,
  "moon-lined": MoonLinedIcon,
  "more-vertical-lined": MoreVerticalLinedIcon,
  "plus-lined": PlusLinedIcon,
  "search-lined": SearchLinedIcon,
  "share-lined": ShareLinedIcon,
  "shuffle-lined": ShuffleLinedIcon,
  "sun-filled": SunFilledIcon,
  "sun-lined": SunLinedIcon,
  "trash-lined": TrashLinedIcon,
  "user-filled": UserFilledIcon,
  "user-lined": UserLinedIcon,
  "user-x-lined": UserXLinedIcon,
} as const satisfies Record<string, SvgIconComponent>;

export type IconName = keyof typeof iconRegistry;
