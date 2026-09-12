"use client";

import React from "react";
import { Input as AntInput, InputProps as AntInputProps } from "antd";
import type { SearchProps as AntSearchProps } from "antd/es/input/Search";

const { Search: AntSearch } = AntInput;

export interface InputProps extends AntInputProps {}
export interface SearchProps extends AntSearchProps {}

export const Input: React.FC<InputProps> = (props) => {
  return <AntInput {...props} />;
};

export const SearchInput: React.FC<SearchProps> = (props) => {
  return <AntSearch {...props} />;
};

export default Input;
