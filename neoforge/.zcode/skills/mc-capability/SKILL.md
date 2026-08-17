---
name: mc-capability
description: Minecraft NeoForge Data Attachments。AttachmentType、DeferredRegister on ATTACHMENT_TYPES、getData/setData。触发词：AttachmentType、Data Attachment、ATTACHMENTS、getData、setData
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mcp
---

# Data Attachments（NeoForge 1.20.4+）

> 1.21+ / 26.1 以该档 `neoforge/<ver>` Skill 与核实表为准；本扁平 Skill **不得**覆盖 26.1 核实表。
> NeoForge 1.20.4+ 推荐 **Data Attachments**，不是 Forge `ICapabilitySerializable` / `AttachCapabilitiesEvent`。

## 快速开始

```java
public class ExampleData {
    private int value = 0;
    public int getValue() { return value; }
    public void setValue(int v) { this.value = v; }
}

public class ModAttachments {
    public static final DeferredRegister<AttachmentType<?>> ATTACHMENTS =
        DeferredRegister.create(NeoForgeRegistries.ATTACHMENT_TYPES, MOD_ID);

    public static final DeferredHolder<AttachmentType<?>, AttachmentType<ExampleData>> EXAMPLE =
        ATTACHMENTS.register("example_data", () ->
            AttachmentType.builder(() -> new ExampleData()).serialize(CODEC).build());
}
```

在 mod 构造函数中：`ModAttachments.ATTACHMENTS.register(modEventBus);`

## 读写

```java
ExampleData data = player.getData(ModAttachments.EXAMPLE);
data.setValue(10);
player.setData(ModAttachments.EXAMPLE, data);
```

## 不要用

- `ICapabilitySerializable` / `AttachCapabilitiesEvent` / `LazyOptional.getCapability` 当 NeoForge 1.20.4+ 推荐路径
- 把 Forge `CapabilityManager` / `CapabilityToken` 抄进 NeoForge
