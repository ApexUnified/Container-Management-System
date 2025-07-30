import Header from '@/partials/Header';
import Overlay from '@/Components/Overlay';
import Preloader from '@/Components/Preloader';
import Sidebar from '@/partials/Sidebar';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Toast from '@/Components/Toast';
export default function AuthenticatedLayout({ children }) {


    // Global General Setting Prop
    const { generalSetting } = usePage().props;

    // Global Asset Prop To Get asset() path it uses Laravel Default asset() Method
    const { asset } = usePage().props;


    // Application Logo Sate With Default Images
    const [ApplicationLogoLight, setApplicationLogoLight] = useState(asset + "assets/images/Logo/ApplicationLogoLight.png");
    const [ApplicationLogoDark, setApplicationLogoDark] = useState(asset + "assets/images/Logo/ApplicationLogoDark.png");


    // For Updating Application Logo
    useEffect(() => {

        // Assigning Application logos
        if (generalSetting?.app_main_logo_light) {
            setApplicationLogoLight(asset + "assets/images/Logo/" + generalSetting?.app_main_logo_light);
        }

        if (generalSetting?.app_main_logo_dark) {
            setApplicationLogoDark(asset + "assets/images/Logo/" + generalSetting?.app_main_logo_dark);
        }



    }, []);


    // Global Auth user Prop
    const user = usePage().props.auth.user;

    // Global Flash Messages Prop Can be Assessble Via (flash.success || flash.error)
    const { flash } = usePage().props;

    // Managing Loader State
    const [loaded, setLoaded] = useState(true);


    // Managing SidebarToggle State
    const [sidebarToggle, setSidebarToggle] = useState(false);

    // Managing Dark Mode State
    const [darkMode, setDarkMode] = useState(false);


    return (
        <>

            <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-gray-900">
                <Preloader loaded={loaded} setLoaded={setLoaded} />



                <Sidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} ApplicationLogoLight={ApplicationLogoLight} ApplicationLogoDark={ApplicationLogoDark} />



                <div
                    className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto"
                >
                    <Overlay sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />



                    <Header sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} darkMode={darkMode} setDarkMode={setDarkMode} ApplicationLogoLight={ApplicationLogoLight} ApplicationLogoDark={ApplicationLogoDark} user={user} />



                    <Toast
                        flash={flash}
                    />



                    <main>
                        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                            {children}
                        </div>
                    </main>

                </div>

            </div>

        </>
    );
}
