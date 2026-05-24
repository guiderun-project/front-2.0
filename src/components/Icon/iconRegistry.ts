import type { ComponentType, SVGProps } from "react";

import ChevronDownLinedIcon from "@/assets/icons/chevron-down-lined.svg?react";
import ChevronLeftLinedIcon from "@/assets/icons/chevron-left-lined.svg?react";
import ChevronRightLinedIcon from "@/assets/icons/chevron-right-lined.svg?react";
import ChevronUpLinedIcon from "@/assets/icons/chevron-up-lined.svg?react";
import CheckLinedIcon from "@/assets/icons/check-lined.svg?react";
import DeleteLinedIcon from "@/assets/icons/delete-lined.svg?react";
import DownloadLinedIcon from "@/assets/icons/download-lined.svg?react";
import EditLinedIcon from "@/assets/icons/edit-lined.svg?react";
import HelpCircleFilledIcon from "@/assets/icons/help-circle-filled.svg?react";
import HomeFilledIcon from "@/assets/icons/home-filled.svg?react";
import HomeLinedIcon from "@/assets/icons/home-lined.svg?react";
import LinkLinedIcon from "@/assets/icons/link-lined.svg?react";
import ListFilledIcon from "@/assets/icons/list-filled.svg?react";
import ListLinedIcon from "@/assets/icons/list-lined.svg?react";
import MoreVerticalLinedIcon from "@/assets/icons/more-vertical-lined.svg?react";
import PlusLinedIcon from "@/assets/icons/plus-lined.svg?react";
import SearchLinedIcon from "@/assets/icons/search-lined.svg?react";
import ShareLinedIcon from "@/assets/icons/share-lined.svg?react";
import TrashLinedIcon from "@/assets/icons/trash-lined.svg?react";
import UserFilledIcon from "@/assets/icons/user-filled.svg?react";
import UserLinedIcon from "@/assets/icons/user-lined.svg?react";
import UserXLinedIcon from "@/assets/icons/user-x-lined.svg?react";

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const iconRegistry = {
  "chevron-down-lined": ChevronDownLinedIcon,
  "chevron-left-lined": ChevronLeftLinedIcon,
  "chevron-right-lined": ChevronRightLinedIcon,
  "chevron-up-lined": ChevronUpLinedIcon,
  "check-lined": CheckLinedIcon,
  "delete-lined": DeleteLinedIcon,
  "download-lined": DownloadLinedIcon,
  "edit-lined": EditLinedIcon,
  "help-circle-filled": HelpCircleFilledIcon,
  "home-filled": HomeFilledIcon,
  "home-lined": HomeLinedIcon,
  "link-lined": LinkLinedIcon,
  "list-filled": ListFilledIcon,
  "list-lined": ListLinedIcon,
  "more-vertical-lined": MoreVerticalLinedIcon,
  "plus-lined": PlusLinedIcon,
  "search-lined": SearchLinedIcon,
  "share-lined": ShareLinedIcon,
  "trash-lined": TrashLinedIcon,
  "user-filled": UserFilledIcon,
  "user-lined": UserLinedIcon,
  "user-x-lined": UserXLinedIcon,
} as const satisfies Record<string, SvgIconComponent>;

export type IconName = keyof typeof iconRegistry;
