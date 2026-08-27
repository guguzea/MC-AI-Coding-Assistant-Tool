[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.4，仅作结构/流程提示，不是 1.21.10 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.10) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-sound
description: Fabric 声音系统。SoundEvent、SoundEvents、SoundCategory。触发词：声音、Sound、SoundEvent
platform: fabric
version: "1.21.10"
dependencies: []
mappings: yarn
---

# 声音系统（Fabric 1.21.3）

## 快速开始

```java
// 1. 创建 SoundEvent
private static final SoundEvent MY_SOUND = Registry.register(
    Registries.SOUND_EVENT,
    Identifier.of(MOD_ID, "my_sound"),
    SoundEvent.of(Identifier.of(MOD_ID, "my_sound"))
);

// 2. 播放声音
player.playSound(MY_SOUND, 1.0f, 1.0f);
```

## Decision: 选择声音用途

```
IF 在世界中播放声音
  → World.playSound()

IF 在 GUI 中播放声音
  → ClientPlayerEntity.playSound()

IF 循环播放
  → 使用 SoundInstance
```

## 常见错误

- ❌忘记在 resources 中添加声音文件 — 声音文件不存在

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 声音事件通过 Registry.register() 注册 |
| `mc-item` | 物品可以播放声音 |
| `mc-entity` | 实体可以播放声音 |
