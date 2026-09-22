---
title: "PlacedBlockTrigger"
description: "public class PlacedBlockTrigger extends java.lang.Object implements ICriterionTrigger<PlacedBlockTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/PlacedBlockTrigger.html"
sourceType: javadoc
---

# PlacedBlockTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.PlacedBlockTrigger

## Class signature

```java
public class PlacedBlockTrigger extends java.lang.Object implements ICriterionTrigger<PlacedBlockTrigger.Instance>
```

## Constructors

- `PlacedBlockTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PlacedBlockTrigger.Instance> listener)`
- `PlacedBlockTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PlacedBlockTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, BlockPos pos, ItemStack item)`
