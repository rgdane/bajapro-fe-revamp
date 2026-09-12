"use client";

import React from "react";
import { Layout, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

export const Footer: React.FC = () => (
  <AntFooter
    style={{
      textAlign: "center",
      background: "#ffffff",
      padding: "20px 0px",
      borderTop: "1px solid #f0f0f0",
    }}
  >
    <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
      2026 © <span style={{ color: "#531DAB", fontWeight: 600 }}>BAJAPRO</span>. All Rights Reserved.
    </Text>
  </AntFooter>
);

export default Footer;
