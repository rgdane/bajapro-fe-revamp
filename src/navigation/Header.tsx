"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Layout, Breadcrumb, Space, Avatar, Typography, Dropdown, MenuProps } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const titleFromPath = (path: string) => {
  const seg = path.split("/").filter(Boolean).pop() || "Dashboard";
  return seg.charAt(0).toUpperCase() + seg.slice(1);
};

export const Header: React.FC = () => {
  const pathname = usePathname();
  const title = titleFromPath(pathname);

  const items: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profil Saya",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Keluar",
    },
  ];

  return (
    <AntHeader
      style={{
        padding: "0 32px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
        height: "72px",
      }}
    >
      <Breadcrumb
        style={{ fontSize: "15px" }}
        items={[
          {
            title: <span style={{ color: "#531DAB", fontWeight: 600 }}>{title}</span>,
          },
        ]}
      />

      <Dropdown menu={{ items }} trigger={["click"]}>
        <Space style={{ cursor: "pointer", gap: "8px" }}>
          <Avatar
            style={{
              backgroundColor: "#FAAD14", // Secondary color from palette
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            A
          </Avatar>
          <Text
            style={{
              color: "#531DAB", // Primary color from palette
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Administrator
          </Text>
          <DownOutlined style={{ fontSize: "12px", color: "#531DAB", marginLeft: "4px" }} />
        </Space>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
