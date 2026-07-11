# Example Mod - AI 开发指南

> 本文件是 AI 助手在开发此模组时的参考指南。

## 快速开始

1. 运行 `gradlew setupDecompWorkspace` 设置开发环境
2. 运行 `gradlew idea` 或 `gradlew eclipse` 生成 IDE 项目
3. 打开 IDE 导入项目
4. 运行 `gradlew runClient` 启动游戏

## Forge 1.12.2 关键点

- **Java**: 必须使用 Java 8
- **Gradle**: 4.9 + ForgeGradle 2.3
- **注册**: 使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>`
- **pack_format**: 4
- **Mappings**: stable_39 (MCP SRG)

## 项目结构

```
src/main/java/com/example/examplemod/
├── ExampleMod.java      # 主类
├── CommonProxy.java     # 通用代理
└── client/
    └── ClientProxy.java # 客户端代理

src/main/resources/
├── mcmod.info          # Mod 元数据
├── pack.mcmeta        # 资源包标识
└── assets/
    └── examplemod/    # 资源文件
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `gradlew setupDecompWorkspace` | 设置反编译环境 |
| `gradlew runClient` | 运行客户端 |
| `gradlew runServer` | 运行服务端 |
| `gradlew build` | 构建发布版本 |
| `gradlew reobfJar` | 重新混淆 jar |
