---
name: mc-cloth-config
description: Fabric Cloth Config 配置系统。ConfigBuilder、ConfigCategory、ConfigEntryBuilder。触发词：Cloth Config、ConfigBuilder、ConfigEntryBuilder、ConfigScreen
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# Cloth Config（Fabric 1.19.4）

## 概述

Cloth Config 是 Fabric 官方推荐的配置库，提供类型安全的配置系统和 GUI。

## 添加依赖

```groovy
// build.gradle
// TODO(未核实)：Cloth Config 是第三方库，本包未走 ingest_loader_api 入库，其坐标与 API 面一律未核实。
//   旧稿钉的 `cloth-config-fabric:11.0.106+1.20.1` 有两重问题：
//   (1) 版本线写的是 +1.20.1，却出现在 1.19.4 档；
//   (2) https://maven.shedaniel.me/me/shedaniel/cloth/cloth-config-fabric/maven-metadata.xml
//       实读 200 / 126 条 version，其中**没有** 11.0.106。
//   核实前必须让用户用自己的 jar 跑一次 ingest_loader_api 再逐签名回填，禁止凭记忆换版本号。
dependencies {
    // modApi "me.shedaniel.cloth:cloth-config-fabric:<待核实：1.19.4 线>" {
    //     exclude group: "net.fabricmc.fabric-api"
    // }
}
```

## 基本配置

```java
// 1. 创建配置选项类
// TODO(未核实)：Cloth Config 属第三方库，本包无 ingest_loader_api 记录，
//   下面整段类名 / 方法链均未核实（ConfigSerializable、ConfigCategory.createBuilder、
//   ConfigEntry.BoolOption、ConfigEntry.IntSliderOption 均无本档一手出处）。
//   照抄前必须先用用户自备的 cloth-config jar 跑 ingest_loader_api 再逐签名回填。
public class ModConfig implements ConfigSerializable {  // TODO(未核实)
    @ConfigEntry.Gui.Excluded  // TODO(未核实)
    public ConfigBuilder builder = ConfigBuilder.create()
        .title(Text.literal("My Mod Config"))
        .category(ConfigCategory.createBuilder()  // TODO(未核实)
            .name(Text.literal("General"))
            .option(ConfigEntry.BoolOption.createBuilder(true)  // TODO(未核实)
                .name(Text.literal("Enable Feature"))
                .tooltip(Text.literal("Enable or disable the feature"))
                .build())
            .option(ConfigEntry.IntSliderOption.createBuilder(10, 1, 100)  // TODO(未核实)
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
// TODO(未核实)：整段 Cloth Config 客户端 API 面在本档均无一手出处（第三方库未 ingest_loader_api 入库）。
//   ConfigScreen 的构造签名、ClothConfigScreenBuilder / ClothConfigBuilder 这两个类型名、
//   build(...) 的覆写签名、addLabel、EntryBuilder.startBooleanToggle / startIntSlider
//   全部需要用户用自己的 cloth-config jar 跑 ingest_loader_api 后逐签名核实，禁止照抄。
public class MyConfigScreen extends ConfigScreen {  // TODO(未核实)
    public MyConfigScreen(@Nullable Screen parent) {
        super(parent, (me.shedaniel.clothconfig2.gui.ClothConfigScreenBuilder) null);  // TODO(未核实)
    }

    @Override
    public void build(Screen parent, Consumer<AbstractConfigListEntry> consumer,
                      ClothConfigBuilder builder) {  // TODO(未核实)
        builder.setGlobalErrorSupplier(...);
        builder.setSavingRunnable(() -> {
            // 保存配置
        });

        builder.addLabel(Text.literal("My Configuration"));  // TODO(未核实)
        builder.addEntry(EntryBuilder.startBooleanToggle(  // TODO(未核实)
                Text.translatable("config.my_mod.enable_feature"))
            .setDefaultValue(true)
            .setSaveConsumer(v -> enableFeature = v)
            .build());

        builder.addEntry(EntryBuilder.startIntSlider(  // TODO(未核实)
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
        // TODO(未核实)：`ClothConfigAddon.setNewDefaultValue(...)` 是编造成员 —— 本包语料与
        //   data/fabric_1.19.4/mappings/yarn-mappings.json 中无 ClothConfigAddon 这个类，
        //   且配置屏幕入口通常由 Mod Menu（另一个第三方库）提供，两者都未走 ingest_loader_api。
        //   核实前不要照抄；下面这行已注释掉：
        // ClothConfigAddon.setNewDefaultValue(new Identifier(MOD_ID, "config"), new ModConfig());
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
