"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { Alert, App, Button, Card, Flex, Input, Space, Tag, Typography } from "antd";
import { ArrowLeftOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { sandboxServices } from "@/features/sandbox/services/sandboxServices";
import type { PistonRunResult } from "@/features/sandbox/types/sandboxTypes";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

const { Title, Paragraph } = Typography;

const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, BAJAPRO!");
    }
}
`;

export default function SandboxPage() {
  const { message } = App.useApp();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [stdin, setStdin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PistonRunResult | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await sandboxServices.run(code, stdin);
      setResult(res.data);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Gagal menjalankan kode");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f4", padding: 24 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <div>
            <Title level={3} style={{ marginBottom: 0, marginTop: 0 }}>
              Java Sandbox
            </Title>
            <Paragraph style={{ color: "gray", marginBottom: 0 }}>
              Tulis dan jalankan kode Java langsung di browser.
            </Paragraph>
          </div>
          <Link href="/manage-material/course">
            <Button icon={<ArrowLeftOutlined />}>Kembali</Button>
          </Link>
        </Flex>

        <Card style={{ marginTop: 16, borderRadius: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
            <CodeMirror
              value={code}
              height="360px"
              theme={oneDark}
              extensions={[java()]}
              onChange={(val) => setCode(val)}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <Typography.Text strong>Input (stdin)</Typography.Text>
            <Input.TextArea
              rows={2}
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Input program (opsional)"
              style={{ marginTop: 8 }}
            />
          </div>

          <Space style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              loading={loading}
              onClick={handleRun}
              style={{ backgroundColor: "#531DAB" }}
            >
              Jalankan
            </Button>
          </Space>

          {result && (
            <Card
              size="small"
              style={{ marginTop: 16, background: "#1e1e2e", borderRadius: 8 }}
              styles={{ body: { color: "#cdd6f4" } }}
            >
              <Space style={{ marginBottom: 8 }}>
                <Tag color="blue">{result.language}</Tag>
                <Tag>{result.version}</Tag>
                {result.run.code !== null && result.run.code !== 0 && (
                  <Tag color="red">exit {result.run.code}</Tag>
                )}
              </Space>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontFamily: "Consolas, Monaco, monospace",
                  fontSize: 13,
                }}
              >
                {result.run.stdout || result.run.output || "(tanpa output)"}
              </pre>
              {result.run.stderr && (
                <pre
                  style={{
                    margin: "8px 0 0",
                    whiteSpace: "pre-wrap",
                    color: "#f38ba8",
                    fontFamily: "Consolas, Monaco, monospace",
                    fontSize: 13,
                  }}
                >
                  {result.run.stderr}
                </pre>
              )}
            </Card>
          )}

          <Alert
            type="info"
            showIcon
            style={{ marginTop: 16 }}
            message="Eksekusi memakai Piston. Jika gagal menghubungi sandbox, pastikan container Piston berjalan."
          />
        </Card>
      </div>
    </div>
  );
}
