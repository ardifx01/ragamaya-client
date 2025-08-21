"use client";
import React, { useState } from "react";
import {
    IconArrowLeft,
    IconBuildingStore,
    IconDashboard,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {Sidebar, SidebarBody, SidebarLink} from "@/components/ui/dashboard/sidebar";
import {Image} from "@heroui/react";

export default function SidebarDemo() {
    const links = [
        {
            label: "Dashboard",
            href: "#",
            icon: (
                <IconDashboard className="h-5 w-5 shrink-0 text-gray-300" />
            ),
        },
        {
            label: "Produk",
            href: "#",
            icon: (
                <IconBuildingStore className="h-5 w-5 shrink-0 text-gray-300" />
            ),
        },
        {
            label: "Settings",
            href: "#",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-gray-300" />
            ),
        },
        {
            label: "Logout",
            href: "#",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-gray-300" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                "px-0 flex min-h-screen flex-1 flex-col overflow-hidden rounded-md border border-gray-800 md:flex-row bg-black",
                "h-[60vh]", // for your use case, use `h-screen` instead of `h-[60vh]`
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <span className="font-bold text-white">{open ? 'RagaMaya' : 'RM'}</span>
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard />
        </div>
    );
}

// Dummy dashboard component with content
const Dashboard = () => {
    return (
        <div className="flex flex-1">
            <div className="flex h-full w-full flex-1 flex-col gap-2 border border-gray-800 bg-black p-2 md:p-10">
                <div className="flex gap-2">
                    {[...new Array(4)].map((i, idx) => (
                        <div
                            key={"first-array-demo-1" + idx}
                            className="h-20 w-full animate-pulse rounded-lg bg-gray-800 border border-gray-700"
                        ></div>
                    ))}
                </div>
                <div className="flex flex-1 gap-2">
                    {[...new Array(2)].map((i, idx) => (
                        <div
                            key={"second-array-demo-1" + idx}
                            className="h-full w-full animate-pulse rounded-lg bg-gray-800 border border-gray-700"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};