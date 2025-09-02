import Header from '@/partials/Header';
import Overlay from '@/Components/Overlay';
import Preloader from '@/Components/Preloader';
import Sidebar from '@/partials/Sidebar';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import Toast from '@/Components/Toast';
export default function AuthenticatedLayout({ children }) {
    // Global Asset Prop To Get asset() path it uses Laravel Default asset() Method
    const { asset } = usePage().props;

    // Application Logo Sate With Default Images
    const [ApplicationLogoLight, setApplicationLogoLight] = useState(
        asset + 'assets/images/Logo/Logo.png',
    );
    const [ApplicationLogoDark, setApplicationLogoDark] = useState(
        asset + 'assets/images/Logo/Logo.png',
    );

    // Global Auth user Prop
    const user = usePage().props.auth.user;

    // Global Flash Messages Prop Can be Assessble Via (flash.success || flash.error)
    const { flash } = usePage().props;

    // Managing Loader State
    const [loaded, setLoaded] = useState(true);

    // Managing SidebarToggle State
    const [sidebarToggle, setSidebarToggle] = useState(() => {
        const saved = localStorage.getItem('sidebarToggle');
        if (saved === null) {
            return false;
        }
        try {
            const parsed = JSON.parse(saved);
            if (typeof parsed === 'boolean') {
                return parsed;
            }
            localStorage.removeItem('sidebarToggle');
            return false;
        } catch (error) {
            localStorage.removeItem('sidebarToggle');
            return false;
        }
    });

    // Managing Dark Mode State
    const [darkMode, setDarkMode] = useState(false);

    return (
        <>
            <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-gray-900">
                <Preloader loaded={loaded} setLoaded={setLoaded} />

                <Sidebar
                    sidebarToggle={sidebarToggle}
                    setSidebarToggle={setSidebarToggle}
                    ApplicationLogoLight={ApplicationLogoLight}
                    ApplicationLogoDark={ApplicationLogoDark}
                />

                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Overlay sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />

                    <Header
                        sidebarToggle={sidebarToggle}
                        setSidebarToggle={setSidebarToggle}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        ApplicationLogoLight={ApplicationLogoLight}
                        ApplicationLogoDark={ApplicationLogoDark}
                        user={user}
                    />

                    <Toast flash={flash} />

                    <main>
                        <div className="max-w-(--breakpoint-2xl) mx-auto p-4 md:p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
