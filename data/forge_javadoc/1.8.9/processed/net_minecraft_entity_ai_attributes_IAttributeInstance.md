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
- `java.util.Collection< AttributeModifier > func_111122_c()`
- `boolean hasModifier( AttributeModifier modifier)`
- `AttributeModifier getModifier(java.util.UUID uuid)`
- `void applyModifier( AttributeModifier modifier)`
- `void removeModifier( AttributeModifier modifier)`
- `void removeAllModifiers()`
- `double getAttributeValue()`

## Description

Get the Attribute this is an instance of