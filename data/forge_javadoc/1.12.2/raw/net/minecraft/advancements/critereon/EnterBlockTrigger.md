---
title: "EnterBlockTrigger"
description: "public class EnterBlockTrigger extends java.lang.Object implements ICriterionTrigger<EnterBlockTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EnterBlockTrigger.html"
sourceType: javadoc
---

# EnterBlockTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EnterBlockTrigger

## Class signature

```java
public class EnterBlockTrigger extends java.lang.Object implements ICriterionTrigger<EnterBlockTrigger.Instance>
```

## Constructors

- `EnterBlockTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EnterBlockTrigger.Instance> listener)`
- `EnterBlockTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EnterBlockTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, IBlockState state)`
