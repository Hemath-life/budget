import { sidebarData as defaultSidebarData } from './data/sidebar-data';
import { NavGroup } from './nav-group';
import { NavUser } from './nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from './sidebar';
import { TeamSwitcher } from './team-switcher';
import type { SidebarData } from '../../layout/types';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    sidebarData?: SidebarData;
}

export function AppSidebar({
    sidebarData = defaultSidebarData,
    ...props
}: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" variant="floating" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={sidebarData.teams} />
            </SidebarHeader>
            <SidebarContent>
                {sidebarData.navGroups.map((props) => (
                    <NavGroup key={props.title} {...props} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={sidebarData.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
