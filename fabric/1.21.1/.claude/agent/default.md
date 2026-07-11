# Cursor AI Coding Assistant — Fabric 默认配置

version: "1.21.1"

platform: fabric

platform_version: "1.21.1"

description: |
  Fabric 1.21.1 的默认 AI 编码助手指南。

mappings:
  - "Yarn (net.fabricmc:yarn:1.21.1+build.2:v2)"

rules_files:
  - "fabric/1.21.1/.cursor/rules/00-project-setup.mdc"
  - "fabric/1.21.1/.cursor/rules/01-registry.mdc"
  - "fabric/1.21.1/.cursor/rules/02-block.mdc"
  - "fabric/1.21.1/.cursor/rules/03-item.mdc"
  - "fabric/1.21.1/.cursor/rules/04-entity.mdc"
  - "fabric/1.21.1/.cursor/rules/05-events.mdc"
  - "fabric/1.21.1/.cursor/rules/06-networking.mdc"
  - "fabric/1.21.1/.cursor/rules/07-datagen.mdc"
  - "fabric/1.21.1/.cursor/rules/08-client-server.mdc"
  - "fabric/1.21.1/.cursor/rules/09-anti-patterns.mdc"
  - "fabric/1.21.1/.cursor/rules/10-gui.mdc"

scaffold_directory: "fabric/1.21.1/scaffold/"

knowledge_base: "fabric/1.21.1/knowledge/"

code_patterns: "fabric/1.21.1/code-patterns/"

special_instructions: |
  - 必须使用 Java 21（Fabric 1.21.x 要求）
  - 优先使用 Yarn 映射，禁止混用 MCP 或 Mojang
  - 客户端专用代码必须在 ClientModInitializer 中初始化
  - 所有注册通过 Registry.register() 在 onInitialize() 中执行
  - 1.21.x 网络系统使用 PayloadTypeRegistry 和 CustomPayload
