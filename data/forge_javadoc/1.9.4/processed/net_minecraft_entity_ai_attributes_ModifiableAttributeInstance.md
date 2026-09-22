# ModifiableAttributeInstance

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.attributes.ModifiableAttributeInstance

## Class signature

```java
public class ModifiableAttributeInstance extends java.lang.Object implements IAttributeInstance
```

## Constructors

- `ModifiableAttributeInstance(AbstractAttributeMap attributeMapIn, IAttribute genericAttributeIn)`

## Methods

- `void applyModifier(AttributeModifier modifier)`
- `protected void flagForUpdate()`
- `IAttribute getAttribute()`
- `double getAttributeValue()`
- `double getBaseValue()`
- `AttributeModifier getModifier(java.util.UUID uuid)`
- `java.util.Collection<AttributeModifier> getModifiers()`
- `java.util.Collection<AttributeModifier> getModifiersByOperation(int operation)`
- `boolean hasModifier(AttributeModifier modifier)`
- `void removeAllModifiers()`
- `void removeModifier(AttributeModifier modifier)`
- `void removeModifier(java.util.UUID p_188479_1_)`
- `void setBaseValue(double baseValue)`