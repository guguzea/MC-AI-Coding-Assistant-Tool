---
title: "UsedTotemTrigger"
description: "public class UsedTotemTrigger extends java.lang.Object implements ICriterionTrigger<UsedTotemTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/UsedTotemTrigger.html"
sourceType: javadoc
---

# UsedTotemTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.UsedTotemTrigger

## Class signature

```java
public class UsedTotemTrigger extends java.lang.Object implements ICriterionTrigger<UsedTotemTrigger.Instance>
```

## Constructors

- `UsedTotemTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<UsedTotemTrigger.Instance> listener)`
- `UsedTotemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<UsedTotemTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, ItemStack item)`
