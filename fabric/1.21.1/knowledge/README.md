# Fabric 1.21.1 知识库

本知识库包含 Minecraft Fabric 模组开发的通用知识、已知错误模式（反模式）和版本迁移指南。

## 目录结构

```
knowledge/
├── README.md                    # 本文件
├── common/                      # 通用知识
│   ├── glossary.md               # 术语表
│   └── datapack-format.md        # 数据包格式速查
├── antipatterns/                 # 反模式库（按症状分类）
│   ├── yarn-mappings.md          # Yarn 映射相关
│   ├── item.md                   # 物品相关
│   ├── mixin.md                  # Mixin 相关
│   ├── gradle.md                 # Gradle/Loom 相关
│   └── networking.md             # 网络通信相关
├── version-changes/              # 版本迁移指南
│   └── 1.20.x.md                # 1.19.x → 1.20.x 变化
└── porting/                      # 跨平台移植指南
    ├── fabric-to-forge.md        # Fabric → Forge
    └── forge-to-fabric.md        # Forge → Fabric
```

## 快速查询

### 遇到编译/构建错误？

1. 先查阅 `antipatterns/gradle.md`
2. 检查 `build.gradle` 和 `gradle.properties`
3. 尝试 `./gradlew clean loom`

### 遇到注册问题？

1. 查阅 `antipatterns/` 目录下对应的主题
2. 检查 Registry.register() 调用
3. 确认 mod ID 一致性

### 遇到版本兼容问题？

1. 查阅 `version-changes/1.20.x.md`
2. 确认 Java 版本（1.21.x 需要 Java 21）
3. 确认 Loom 版本

## 扩展阅读

- [Fabric Wiki](https://fabricmc.net/wiki/documentation)
- [Fabric API Javadoc](https://fabricmc.net/javadoc/)
- [Yarn Mappings](https://github.com/FabricMC/yarn)
