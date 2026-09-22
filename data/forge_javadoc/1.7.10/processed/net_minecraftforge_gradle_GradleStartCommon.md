# GradleStartCommon

**Inheritance:** java.lang.Object → net.minecraftforge.gradle.GradleStartCommon

## Class signature

```java
public abstract class GradleStartCommon extends java.lang.Object
```

## Constructors

- `GradleStartCommon()`

## Methods

- `protected abstract java.lang.String getBounceClass()`
- `protected static java.lang.Class getFmlClass(java.lang.String classname)`
- `static java.lang.Class getFmlClass(java.lang.String classname, java.lang.ClassLoader loader)`
- `protected abstract java.lang.String getTweakClass()`
- `protected void launch(java.lang.String[] args)`
- `protected abstract void preLaunch(java.util.Map<java.lang.String, java.lang.String> argMap, java.util.List<java.lang.String> extras)`
- `protected abstract void setDefaultArguments(java.util.Map<java.lang.String, java.lang.String> argMap)`

## Fields

- `static java.util.Map<java.lang.String, java.io.File> coreMap`
- `protected static Logger LOGGER`