"use client";

import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";

export type ButtonProps = AntButtonProps;

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <AntButton {...props}>{children}</AntButton>;
};

export default Button;
