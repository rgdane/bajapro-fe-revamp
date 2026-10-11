"use client";

import React, { useMemo, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BlockOutlined,
  UserOutlined,
  BarChartOutlined,
  BookOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  SettingOutlined,
  TrophyOutlined,
  QuestionCircleOutlined,
  DeploymentUnitOutlined,
  BankOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Layout, Menu, ConfigProvider, Button } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  /** Full URL untuk item tunggal (leaf). */
  path?: string;
  /** Base path grouping; child otomatis di-resolve jadi `${basePath}/${key}`. */
  basePath?: string;
  children?: MenuItem[];
}

interface ResolvedMenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  href?: string;
  children?: ResolvedMenuItem[];
}

function resolveItems(items: MenuItem[], inheritedBase = ""): ResolvedMenuItem[] {
  return items.map((item) => {
    const basePath = item.basePath ?? inheritedBase;
    const href = item.path ?? (basePath && !item.children ? `${basePath}/${item.key}` : undefined);
    return {
      key: item.key,
      icon: item.icon,
      label: item.label,
      href,
      children: item.children ? resolveItems(item.children, basePath) : undefined,
    };
  });
}

function toMenuProps(items: ResolvedMenuItem[]): MenuProps["items"] {
  return items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.href ? <Link href={item.href}>{item.label}</Link> : item.label,
    children: item.children ? toMenuProps(item.children) : undefined,
  }));
}

export const allMenuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    key: "manage-course",
    icon: <BookOutlined />,
    label: "Kelola Materi",
    basePath: "/manage-material",
    children: [
      { key: "level", icon: <DeploymentUnitOutlined />, label: "Level" },
      { key: "course", icon: <BlockOutlined />, label: "Course" },
      { key: "question", icon: <QuestionCircleOutlined />, label: "Question" },
    ],
  },
  {
    key: "manage-user",
    icon: <UserOutlined />,
    label: "Kelola Pengguna",
    basePath: "/manage-user",
    children: [
      { key: "kelas", icon: <BankOutlined />, label: "Kelas" },
      { key: "sekolah", icon: <ApartmentOutlined />, label: "Sekolah" },
      { key: "user", icon: <TeamOutlined />, label: "Users" },
      { key: "approval", icon: <AppstoreAddOutlined />, label: "Approval" },
      { key: "permission", icon: <SettingOutlined />, label: "Permission" },
    ],
  },
  {
    key: "g-report",
    icon: <BarChartOutlined />,
    label: "Report",
    basePath: "/report",
    children: [
      { key: "hasil-belajar", icon: <BarChartOutlined />, label: "Hasil Belajar", path: "/report" },
      { key: "leaderboard", icon: <TrophyOutlined />, label: "Leaderboard", path: "/leaderboard" },
    ],
  },
  {
    key: "manage-gamification",
    icon: <TrophyOutlined />,
    label: "Gamifikasi",
    basePath: "/badge",
    children: [{ key: "badge", icon: <SettingOutlined />, label: "Badge Settings", path: "/badge" }],
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const resolvedItems = useMemo(() => resolveItems(allMenuItems), []);

  const { activeKey, parentKey } = useMemo(() => {
    let activeKey = "dashboard";
    let parentKey = "";

    const findActive = (items: ResolvedMenuItem[], parent?: string) => {
      for (const item of items) {
        if (item.href && pathname.startsWith(item.href)) {
          activeKey = item.key;
          if (parent) parentKey = parent;
        }
        if (item.children) {
          findActive(item.children, item.key);
        }
      }
    };

    findActive(resolvedItems);
    return { activeKey, parentKey };
  }, [pathname, resolvedItems]);

  const [openKeys, setOpenKeys] = useState<string[]>(parentKey ? [parentKey] : []);

  const handleOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const menuItems = useMemo(() => toMenuProps(resolvedItems), [resolvedItems]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemColor: "#595959",
            itemSelectedColor: "#531DAB",
            itemHoverColor: "#531DAB",
            groupTitleColor: "#8C8C8C",
            itemHoverBg: "#EEE8F7",
            itemSelectedBg: "#EEE8F7",
            subMenuItemBg: "transparent",
            fontSize: 14,
          },
        },
        token: {
          colorPrimary: "#531DAB",
        },
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={250}
        style={{
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Logo Area */}
          <div
            style={{
              padding: "16px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
              flexShrink: 0,
            }}
          >
            {!collapsed && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#531DAB",
                  }}
                >
                  BAJAPRO
                </span>
              </div>
            )}
            <Button
              type="text"
              icon={
                collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", color: "#531DAB" }}
            />
          </div>

          {/* Menu Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              paddingBottom: 100,
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[activeKey]}
              openKeys={openKeys}
              onOpenChange={handleOpenChange}
              items={menuItems}
            />
          </div>
        </div>
      </Sider>
    </ConfigProvider>
  );
};

export default Sidebar;