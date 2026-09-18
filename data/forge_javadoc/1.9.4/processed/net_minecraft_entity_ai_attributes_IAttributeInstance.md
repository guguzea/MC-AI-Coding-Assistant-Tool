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
- `@Nullable AttributeModifier getModifier(java.util.UUID uuid)`
- `void applyModifier( AttributeModifier modifier)`
- `void removeModifier( AttributeModifier modifier)`
- `void removeModifier(java.util.UUID p_188479_1_)`
- `void removeAllModifiers()`
- `double getAttributeValue()`