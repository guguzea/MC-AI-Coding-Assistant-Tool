---
name: mc-cloth-config
description: Fabric Cloth Config 配置系统。ConfigBuilder、ConfigCategory、ConfigEntryBuilder。触发词：Cloth Config、ConfigBuilder、ConfigEntryBuilder、ConfigScreen
platform: fabric
version: "1.21.3"
dependencies: []
mappings: yarn
---

# Cloth Config（Fabric 1.21.3）

## 概述

Cloth Config 是 Fabric 官方推荐的配置库，提供类型安全的配置系统和 GUI。

## 添加依赖

```groovy
// build.gradle
repositories {
    maven { url "https://maven.shedaniel.me/" }   // Cloth 的 maven 坐标在这个仓库，缺这段解析不到
}

dependencies {
    modApi "me.shedaniel.cloth:cloth-config-fabric:16.0.143" {
        exclude group: "net.fabricmc.fabric-api"
    }
}
```

> **坐标复核（读取日期 2026-09-13）**：原写 `11.0.106+1.20.1` 是 1.20.1 档的版本号，与本档 MC 1.21.3 不匹配。现值 `16.0.143`：`curl -sS -o /dev/null -w '%{http_code}' https://maven.shedaniel.me/me/shedaniel/cloth/cloth-config-fabric/16.0.143/cloth-config-fabric-16.0.143.pom` → **200**；Modrinth `project/cloth-config/version?game_versions=["1.21.3"]&loaders=["fabric"]` 首条即 `16.0.143+fabric`。再次复核：`curl -sS "https://api.modrinth.com/v2/project/cloth-config/version?limit=400"`。
> **未核实**：本节以下代码里的 `ConfigSerializable`、`ConfigEntry.BoolOption.createBuilder(...)` 等成员名本轮未逐条对上游 javadoc 复核（只改坐标），需要单独立项。

## 基本配置

```java
// 1. 创建配置选项类
public class ModConfig implements ConfigSerializable {
    @ConfigEntry.Gui.Excluded
    public ConfigBuilder builder = ConfigBuilder.create()
        .title(Text.literal("My Mod Config"))
        .category(ConfigCategory.createBuilder()
            .name(Text.literal("General"))
            .option(ConfigEntry.BoolOption.createBuilder(true)
                .name(Text.literal("Enable Feature"))
                .tooltip(Text.literal("Enable or disable the feature"))
                .build())
            .option(ConfigEntry.IntSliderOption.createBuilder(10, 1, 100)
                .name(Text.literal("Value"))
                .build())
            .build())
        .save(() -> {
            // 保存配置时的回调
        });

    public boolean enableFeature = true;
    public int value = 10;

    @Override
    public ConfigSerializer<?> getSerializer() {
        return builder.getSerializer();
    }
}
```

## 使用 ConfigBuilder

```java
public class MyConfigScreen extends ConfigScreen {
    public MyConfigScreen(@Nullable Screen parent) {
        super(parent, (me.shedaniel.clothconfig2.gui.ClothConfigScreenBuilder) null);
    }

    @Override
    public void build(Screen parent, Consumer<AbstractConfigListEntry> consumer,
                      ClothConfigBuilder builder) {
        builder.setGlobalErrorSupplier(...);
        builder.setSavingRunnable(() -> {
            // 保存配置
        });

        builder.addLabel(Text.literal("My Configuration"));
        builder.addEntry(EntryBuilder.startBooleanToggle(
                Text.translatable("config.my_mod.enable_feature"))
            .setDefaultValue(true)
            .setSaveConsumer(v -> enableFeature = v)
            .build());

        builder.addEntry(EntryBuilder.startIntSlider(
                Text.translatable("config.my_mod.value"), 10, 100)
            .setDefaultValue(50)
            .setSaveConsumer(v -> value = v)
            .build());
    }
}
```

## 配置屏幕入口

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // 注册配置屏幕
        ClothConfigAddon.setNewDefaultValue(
            Identifier.of(MOD_ID, "config"), new ModConfig()
        );
    }
}
```

## 常见错误

- ❌忘记 `exclude group: "net.fabricmc.fabric-api"` — 依赖冲突
- ❌在服务端创建 ConfigScreen — ConfigScreen 是客户端的
- ❌忘记在 `fabric.mod.json` 中声明 cloth-config 依赖

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Cloth Config 提供配置 GUI |
| `mc-registry` | 配置通过 Registry 持久化 |
