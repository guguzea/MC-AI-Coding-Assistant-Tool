---
title: "ModifiableAttributeInstance"
description: "public class ModifiableAttributeInstance extends java.lang.Object implements IAttributeInstance"
package: "net/minecraft/entity/ai/attributes"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/attributes/ModifiableAttributeInstance.html"
sourceType: javadoc
---

# ModifiableAttributeInstance

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.attributes.ModifiableAttributeInstance

## Class signature

```java
public class ModifiableAttributeInstance extends java.lang.Object implements IAttributeInstance
```

## Constructors

- `ModifiableAttributeInstance(BaseAttributeMap attributeMapIn, IAttribute genericAttributeIn)`

## Methods

- `void applyModifier(AttributeModifier modifier)`
- `protected void flagForUpdate()`
- `java.util.Collection<AttributeModifier> func_111122_c()`
- `IAttribute getAttribute()` — Get the Attribute this is an instance of
- `double getAttributeValue()`
- `double getBaseValue()`
- `AttributeModifier getModifier(java.util.UUID uuid)` — Returns attribute modifier, if any, by the given UUID
- `java.util.Collection<AttributeModifier> getModifiersByOperation(int operation)`
- `boolean hasModifier(AttributeModifier modifier)`
- `void removeAllModifiers()`
- `void removeModifier(AttributeModifier modifier)`
- `void setBaseValue(double baseValue)`
