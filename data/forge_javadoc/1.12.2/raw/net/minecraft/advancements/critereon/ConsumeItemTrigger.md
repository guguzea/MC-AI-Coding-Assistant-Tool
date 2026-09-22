---
title: "ConsumeItemTrigger"
description: "public class ConsumeItemTrigger extends java.lang.Object implements ICriterionTrigger<ConsumeItemTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/ConsumeItemTrigger.html"
sourceType: javadoc
---

# ConsumeItemTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ConsumeItemTrigger

## Class signature

```java
public class ConsumeItemTrigger extends java.lang.Object implements ICriterionTrigger<ConsumeItemTrigger.Instance>
```

## Constructors

- `ConsumeItemTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ConsumeItemTrigger.Instance> listener)`
- `ConsumeItemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ConsumeItemTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, ItemStack item)`
