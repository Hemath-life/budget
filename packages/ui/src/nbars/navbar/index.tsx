import { cn } from '#/lib/utils';
import { ProfileDropdown } from '#/forms/profile-dropdown';
import { ThemeSwitch } from '#/common/theme';
import { Header } from './header';
import { TopNav } from './top-nav';
import { Search } from '#/common';

const topNav = [
    {
        title: 'Overview',
        href: 'dashboard/overview',
        isActive: true,
        disabled: false,
    },
    {
        title: 'Customers',
        href: 'dashboard/customers',
        isActive: false,
        disabled: true,
    },
    {
        title: 'Products',
        href: 'dashboard/products',
        isActive: false,
        disabled: true,
    },
    {
        title: 'Settings',
        href: 'dashboard/settings',
        isActive: false,
        disabled: true,
    },
];

interface HeaderNavProps {
    // showSearch?: boolean
    // showThemeSwitch?: boolean
    // showProfileDropdown?: boolean
    // showTopNav?: boolean
    fixed?: boolean;
    className?: string;
    variant?: 'search-first' | 'title-first' | 'minimal';
    logout?: () => void;
}

export const HeaderNav = (
    props: HeaderNavProps = {
        // showSearch: true,
        // showThemeSwitch: true,
        // showProfileDropdown: true,
        // showTopNav: true,
        fixed: false,
        className: '',
        variant: 'title-first',
    },
) => {
    const {
        // showSearch,
        // showThemeSwitch,
        // showProfileDropdown,
        // showTopNav,
        className,
        variant,
        fixed,
        logout,
    } = { ...props };

    const renderHeaderContent = () => {
        switch (variant) {
            case 'search-first':
                return (
                    <>
                        <Search />
                        <div
                            className={cn(
                                `ml-auto flex items-center gap-4`,
                                className,
                            )}
                        >
                            <ThemeSwitch />
                            <ProfileDropdown logout={logout} />
                        </div>
                    </>
                );
            case 'title-first':
                return (
                    <>
                        <TopNav links={topNav} />
                        <div
                            className={cn(
                                `ml-auto flex items-center space-x-4`,
                                className,
                            )}
                        >
                            <Search />
                            <ThemeSwitch />
                            <ProfileDropdown logout={logout} />
                        </div>
                    </>
                );
            default:
                return (
                    <>
                        <TopNav links={topNav} />
                        <div className="ml-auto flex items-center space-x-4">
                            <Search />
                            <ThemeSwitch />
                            <ProfileDropdown logout={logout} />
                        </div>
                    </>
                );
        }
    };

    return (
        <>
            <Header fixed={fixed}>{renderHeaderContent()}</Header>
        </>
    );
};
