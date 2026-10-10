"use client";

import React, { useEffect } from "react";
import { Modal, Form } from "antd";
import type { FormInstance, ModalProps } from "antd";

export interface MasterFormModalProps<TValues extends object = Record<string, unknown>>
  extends Omit<ModalProps, "onOk" | "confirmLoading"> {
  mode?: "create" | "edit";
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: TValues) => Promise<void> | void;
  submitLoading?: boolean;
  initialValues?: TValues;
  fields: React.ReactNode;
  /** Form instance eksternal, agar pemanggil bisa memantau nilai field (mis. cascading role/sekolah). */
  form?: FormInstance;
}

export const MasterFormModal = <TValues extends object = Record<string, unknown>>({
  mode = "create",
  open,
  onCancel,
  onSubmit,
  submitLoading = false,
  initialValues,
  fields,
  form: externalForm,
  title,
  okText = "Simpan",
  cancelText = "Batal",
  width = 640,
  ...rest
}: MasterFormModalProps<TValues>) => {
  const [internalForm] = Form.useForm();
  const form = externalForm ?? internalForm;

  const defaultTitle = mode === "create" ? "Tambah Data" : "Edit Data";

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [open, mode, initialValues, form]);

  return (
    <Modal
      open={open}
      title={title ?? defaultTitle}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={submitLoading}
      okText={okText}
      cancelText={cancelText}
      width={width}
      afterClose={() => form.resetFields()}
      {...rest}
    >
      <Form form={form} layout="vertical" onFinish={(values) => onSubmit(values as TValues)}>
        {fields}
      </Form>
    </Modal>
  );
};

export default MasterFormModal;