[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.3，仅作结构/流程提示，不是 1.21.4 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.4) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-cloth-config
description: Fabric Cloth Config 配置系统。ConfigBuilder、ConfigCategory、ConfigEntryBuilder。触发词：Cloth Config、ConfigBuilder、ConfigEntryBuilder、ConfigScreen
platform: fabric
version: "1.21.4"
dependencies: []
mappings: yarn
---

# Cloth Config（Fabric 1.21.3）

## 概述

Cloth Config 是 Fabric 官方推荐的配置库，提供类型安全的配置系统和 GUI。

## 添加依赖

```groovy
// build.gradle
dependencies {
    modApi "me.shedaniel.cloth:cloth-config-fabric:11.0.106+1.20.1" {
        exclude group: "net.fabricmc.fabric-api"
    }
}
```

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
