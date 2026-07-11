---
version: "1.21.1"
platform: fabric
description: |
  Fabric 1.21.1 Fabric API 模块速查卡。

## Fabric API 概览

Fabric API 是模块化设计，每个模块独立引入。

### 基础依赖

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
```

## 常用模块

| 模块 | 依赖 | 说明 |
|------|------|------|
| item-api | fabric-item-api-v1 | Item 交互、Capability |
| events | fabric-events-attack-v0, fabric-events-interaction-v0 | 事件系统 |
| screen | fabric-screen-api-v1 | GUI Screen 扩展 |
| renderer | fabric-renderer-api-v1 | 自定义渲染器 |
| renderer-indigo | fabric-renderer-indigo | 默认渲染器实现 |
| particles | fabric-rendering-data-attachment-v1 | 粒子渲染数据 |
| data | fabric-datagen-api-v0 | 数据生成器 |
| networking | fabric-networking-api-v1 | 网络通信（旧版，1.21+ 不推荐） |
| commands | fabric-command-api-v2 | 命令系统 |

## 示例：引入模块

```groovy
// build.gradle
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
    modImplementation "net.fabricmc.fabric-api:fabric-screen-api-v1:9.1.1+1.21"
    modImplementation "net.fabricmc.fabric-api:fabric-command-api-v2:3.1.2+1.21"
}
```

## 常用 API

### ItemEvents（fabric-events-interaction-v0）

```java
ItemEvents.USE_ITEM_ON_BLOCK.register((player, world, hand, hitResult) -> {
    if (!world.isClient && player.getStackInHand(hand).isOf(Items.DIAMOND)) {
        return ActionResult.SUCCESS;
    }
    return ActionResult.PISTON;
});
```

### HandledScreens（fabric-screen-api-v1）

```java
HandledScreens.register(
    MY_SCREEN_HANDLER,
    MyScreen::new
);
```

## 注意事项

- ❌ 1.21+ 网络通信应使用新系统，不推荐 fabric-networking-api-v1
- ✅ 推荐选择性引入具体模块而非全部引入
- ✅ 查看 [Fabric API Javadoc](https://fabricmc.net/wiki/documentation:fabric_api) 获取最新 API
