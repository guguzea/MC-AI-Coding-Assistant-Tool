---
name: mc-cloth-config
description: Fabric Cloth Config 配置系统。ConfigBuilder、ConfigCategory、ConfigEntryBuilder。触发词：Cloth Config、ConfigBuilder、ConfigEntryBuilder、ConfigScreen
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---
<!-- external-apis: cloth-config, jdk -->

<!-- cloth-version-inject v=1.21.11 coord=21.11.153 state=active textApi=literal -->

# Cloth Config（Fabric 1.21.11）

## 概述

Cloth Config 是 Fabric 侧广泛使用的**第三方**配置库（不是 Fabric 官方组件，也没有「官方推荐」这一说），提供类型安全的配置系统与配置 GUI。

本件下列类名/方法名已按上游构件 `cloth-config-21.11.153-fabric.jar`（Modrinth `21.11.153+fabric`，sha 可复核）逐条 `javap` 核实，**不是**从记忆或邻档推的。它仍不属于 loader API：升级 cloth 版本后要按新 jar 重核。

## 添加依赖

```groovy
// build.gradle
repositories {
    maven { url "https://maven.shedaniel.me/" }   // Cloth 的 maven 坐标在这个仓库，缺这段解析不到
}

dependencies {
    modApi("me.shedaniel.cloth:cloth-config-fabric:21.11.153") {
        exclude group: "net.fabricmc.fabric-api"
    }
}
```

> **坐标复核**：原写 `15.0.131+1.21` 是 1.21 档的版本号，与本档 MC 1.21.11 不匹配。现值 `21.11.153`：`curl -sS -o /dev/null -w '%{http_code}' https://maven.shedaniel.me/me/shedaniel/cloth/cloth-config-fabric/21.11.153/cloth-config-fabric-21.11.153.pom` → **200**；Modrinth `project/cloth-config/version?game_versions=["1.21.11"]&loaders=["fabric"]` 首条即 `21.11.153+fabric`。再次复核：`curl -sS "https://api.modrinth.com/v2/project/cloth-config/version?limit=400"`。

> 版本怎么定（一手判据，实取 `maven.shedaniel.me/.../cloth-config-fabric/maven-metadata.xml`，126 条）：
> cloth 的版本号形态**从来不带 `+<MC>` 后缀**；MC 线绑在「该版 pom 里 fabric-api 依赖的后缀」上。对照：
> `4.x → +1.16`｜`5.x → +1.17`｜`6.x → +1.18`｜`7.0.x → +1.19`｜`8.x → +1.19.1`｜`9.x → +1.19.3`｜`10.0.x → +1.19.4`｜
> `11.x → +1.20`｜`12.x → +1.20.2`｜`13.0.x → +1.20.4`；1.20.5 起改由 jar 内 `fabric.mod.json` 的 `depends.minecraft` 判定：
> `14.0.x → >=1.20.5`｜`15.0.x → >=1.21`｜`16.0.x → >=1.21.2`｜`17.0.x / 18.0.x → >=1.21.4`｜`19.0.x → >=1.21.6`｜`20.0.x / 21.11.x → >=1.21.9`｜`26.1.x → >=26.1`｜`26.2.x → >=26.2`。
> 换 MC 线时必须按上表重新核，不许把别档的版本号抄过来。

## 路线 A：注解 + AutoConfig（推荐，代码最少）

真实的 class/annotation 是 `me.shedaniel.autoconfig.*`（**不是** `ConfigSerializable` —— 该名字在 21.11.153 jar 里 0 命中）：

```java
import me.shedaniel.autoconfig.AutoConfig;
import me.shedaniel.autoconfig.ConfigData;
import me.shedaniel.autoconfig.ConfigHolder;
import me.shedaniel.autoconfig.annotation.Config;
import me.shedaniel.autoconfig.serializer.GsonConfigSerializer;

@Config(name = "mymod")                    // 注解方法名就是 name()
public class ModConfig implements ConfigData {
    public boolean enableFeature = true;   // 本件自造示例字段，没有任何 MC 符号出处

    public int value = 10;

    public transient boolean runtimeOnly;
}

// ModInitializer#onInitialize()
public static final ConfigHolder<ModConfig> HOLDER =
        AutoConfig.register(ModConfig.class, GsonConfigSerializer::new);
```

- `AutoConfig.register(Class<T extends ConfigData>, ConfigSerializer.Factory<T>)` → `ConfigHolder<T>`（javap 核实）。
- `ConfigHolder<T>`：`getConfig()` / `save()` / `load()` / `setConfig(T)` / `resetToDefault()` / `registerSaveListener(ConfigSerializeEvent.Save<T>)` / `registerLoadListener(...)`。
- `ConfigData` 只有一个 default 方法 `validatePostLoad() throws ConfigData.ValidationException`，需要校验就覆写它。
- `ConfigEntry.BoundedDiscrete` / `ConfigEntry.Gui.Excluded` 等注解都在 `me.shedaniel.autoconfig.annotation.ConfigEntry` 下；具体可用的注解只有 jar 里那 12 个嵌套类型（见 jar 清单）。

## 路线 B：手动 ConfigBuilder（自定义 GUI）

```java
import me.shedaniel.clothconfig2.api.ConfigBuilder;
import me.shedaniel.clothconfig2.api.ConfigCategory;
import me.shedaniel.clothconfig2.api.ConfigEntryBuilder;
import net.minecraft.client.gui.screen.Screen;

public static Screen buildScreen(Screen parent, ModConfig config) {
    ConfigBuilder builder = ConfigBuilder.create()
            .setParentScreen(parent)
            .setTitle(Text.literal("My Mod Config"));

    ConfigCategory general = builder.getOrCreateCategory(Text.literal("General"));
    ConfigEntryBuilder entries = builder.entryBuilder();

    general.addEntry(entries.startBooleanToggle(Text.literal("Enable Feature"), config.enableFeature) // enableFeature 本件自造示例字段，没有任何 MC 符号出处
            .setDefaultValue(true)
            .setSaveConsumer(v -> config.enableFeature = v) // enableFeature 同上：本件自造示例字段，没有任何 MC 符号出处
            .build());

    general.addEntry(entries.startIntSlider(Text.literal("Value"), config.value, 1, 100)
            .setDefaultValue(10)
            .setSaveConsumer(v -> config.value = v)
            .build());

    builder.setSavingRunnable(() -> { /* 写盘 */ });
    return builder.build();
}
```

已核实的签名（`javap` @ `cloth-config-21.11.153-fabric.jar`）：

- `ConfigBuilder.create()`；实例方法 `setParentScreen(Screen)` / `setTitle(Text)` / `getOrCreateCategory(Text)` / `entryBuilder()` / `setSavingRunnable(Runnable)` / `build() → Screen`。
- `ConfigCategory#addEntry(AbstractConfigListEntry)`（**不是** `.option(...)` / `ConfigCategory.createBuilder()` —— 这两个名字在 jar 里 0 命中）。
- `ConfigEntryBuilder.create()`；`startBooleanToggle(Text, boolean)` → `BooleanToggleBuilder`；`startIntSlider(Text, int, int, int)` → `IntSliderBuilder`。
- `BooleanToggleBuilder` / `IntSliderBuilder` 都有 `setDefaultValue(...)` / `setSaveConsumer(Consumer<...>)` / `setTooltip(Text...)` / `requireRestart()` / `build()`。

## 配置屏幕入口

用 AutoConfig 路线时，屏幕由库生成：

```java
Screen screen = AutoConfig.getConfigScreen(ModConfig.class, parent).get();
```

`AutoConfig.getConfigScreen(Class<T>, Screen)` 返回 `Supplier<Screen>`（javap 核实）。⚠️ 它在 21.11.153 里标了 `@Deprecated(forRemoval = true)`（实测 `compileJava` 给出 `[removal] ... 已过期且标记为待删除`），新代码优先用上面的路线 B；AutoConfig 路线保留 `ConfigHolder` 的读写用途即可。`ClothConfigAddon` / `ClothConfigScreenBuilder` / `ClothConfigBuilder` 这几个名字在 21.11.153 jar 里 **0 命中**，不要写。

## 常见错误

- ❌忘记 `exclude group: "net.fabricmc.fabric-api"` — 依赖冲突
- ❌在服务端创建 ConfigScreen — 配置屏幕是客户端的
- ❌忘记在 `fabric.mod.json` 中声明 cloth-config 依赖

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Cloth Config 提供配置 GUI |
| `mc-registry` | 配置通过 Registry 持久化 |
