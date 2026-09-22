---
title: "InventoryChangeTrigger"
description: "public class InventoryChangeTrigger extends java.lang.Object implements ICriterionTrigger<InventoryChangeTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/InventoryChangeTrigger.html"
sourceType: javadoc
---

# InventoryChangeTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.InventoryChangeTrigger

## Class signature

```java
public class InventoryChangeTrigger extends java.lang.Object implements ICriterionTrigger<InventoryChangeTrigger.Instance>
```

## Constructors

- `InventoryChangeTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<InventoryChangeTrigger.Instance> listener)`
- `InventoryChangeTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<InventoryChangeTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, InventoryPlayer inventory)`
