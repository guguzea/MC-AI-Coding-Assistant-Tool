---
title: "IAttributeInstance"
description: "public interface IAttributeInstance"
package: "net/minecraft/entity/ai/attributes"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/ai/attributes/IAttributeInstance.html"
sourceType: javadoc
---

# IAttributeInstance

## Class signature

```java
public interface IAttributeInstance
```

## Methods

- `IAttribute getAttribute()`
- `double getBaseValue()`
- `void setBaseValue(double baseValue)`
- `java.util.Collection< AttributeModifier > getModifiersByOperation(int operation)`
- `java.util.Collection< AttributeModifier > getModifiers()`
- `boolean hasModifier( AttributeModifier modifier)`
- `AttributeModifier getModifier(java.util.UUID uuid)`
- `void applyModifier( AttributeModifier modifier)`
- `void removeModifier( AttributeModifier modifier)`
- `void removeModifier(java.util.UUID p_188479_1_)`
- `void removeAllModifiers()`
- `double getAttributeValue()`
