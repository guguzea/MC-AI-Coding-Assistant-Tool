# GameRules

## Class signature

```java
public class GameRules extends java.lang.Object
```

## Constructors

- `public GameRules()`

## Methods

- `public void addGameRule(java.lang.String key, java.lang.String value, GameRules.ValueType type)`
- `public void setOrCreateGameRule(java.lang.String key, java.lang.String ruleValue)`
- `public java.lang.String getString(java.lang.String name)`
- `public boolean getBoolean(java.lang.String name)`
- `public int getInt(java.lang.String name)`
- `public NBTTagCompound writeToNBT()`
- `public void readFromNBT( NBTTagCompound nbt)`
- `public java.lang.String[] getRules()`
- `public boolean hasRule(java.lang.String name)`
- `public boolean areSameType(java.lang.String key, GameRules.ValueType otherValue)`

## Description

Gets the boolean Game Rule value.