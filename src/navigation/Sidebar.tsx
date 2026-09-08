"use client";

import React, { useState, useMemo } from "react";
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
  SafetyCertificateOutlined,
  DeploymentUnitOutlined,
  BankOutlined,
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
  children?: MenuItem[];
}

export const allMenuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: "g-materi",
    icon: <BookOutlined />,
    label: "Kelola Materi",
    children: [
      {
        key: "level",
        label: <Link href="/level">Level</Link>,
        icon: <DeploymentUnitOutlined />,
      },
      {
        key: "course",
        label: <Link href="/course">Course</Link>,
        icon: <BlockOutlined />,
      },
      {
        key: "question",
        label: <Link href="/code_question">Question</Link>,
        icon: <QuestionCircleOutlined />,
      },
    ],
  },
  {
    key: "g-pengguna",
    icon: <UserOutlined />,
    label: "Kelola Pengguna",
    children: [
      {
        key: "roles",
        label: <Link href="/roles">Roles</Link>,
        icon: <SafetyCertificateOutlined />,
      },
      {
        key: "kelas",
        label: <Link href="/kelas">Kelas</Link>,
        icon: <BankOutlined />,
      },
      {
        key: "users",
        label: <Link href="/users">Users</Link>,
        icon: <TeamOutlined />,
      },
      {
        key: "approval",
        label: <Link href="/approval">Approval</Link>,
        icon: <AppstoreAddOutlined />,
      },
      {
        key: "permission",
        label: <Link href="/permission">Permission</Link>,
        icon: <SettingOutlined />,
      },
    ],
  },
  {
    key: "g-report",
    icon: <BarChartOutlined />,
    label: "Report",
    children: [
      {
        key: "hasil-belajar",
        label: <Link href="/report">Hasil Belajar</Link>,
        icon: <BarChartOutlined />,
      },
      {
        key: "leaderboard",
        label: <Link href="/leaderboard">Leaderboard</Link>,
        icon: <TrophyOutlined />,
      },
    ],
  },
  {
    key: "g-gamifikasi",
    icon: <TrophyOutlined />,
    label: "Gamifikasi",
    children: [
      {
        key: "badge",
        label: <Link href="/badge">Badge Settings</Link>,
        icon: <SettingOutlined />,
      },
    ],
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const getActiveState = () => {
    let activeKey = "dashboard";
    let parentKey = "";

    const findActive = (items: MenuItem[], parent?: string) => {
      for (const item of items) {
        const labelProps = (item.label as React.ReactElement<{ href?: string }>)?.props;
        const itemHref = labelProps?.href;
        if (itemHref && pathname.startsWith(itemHref)) {
          activeKey = item.key;
          if (parent) parentKey = parent;
        }
        if (item.children) {
          findActive(item.children, item.key);
        }
      }
    };

    findActive(allMenuItems);
    if (pathname === "/dashboard") activeKey = "dashboard";
    return { activeKey, parentKey };
  };

  const { activeKey, parentKey } = getActiveState();

  const defaultOpenKeys = useMemo(
    () => (parentKey ? [parentKey] : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [openKeys, setOpenKeys] = useState<string[]>(
    collapsed ? [] : defaultOpenKeys
  );

  const handleOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
  };

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
              items={allMenuItems as MenuProps["items"]}
            />
          </div>
        </div>
      </Sider>
    </ConfigProvider>
  );
};

export default Sidebar;
