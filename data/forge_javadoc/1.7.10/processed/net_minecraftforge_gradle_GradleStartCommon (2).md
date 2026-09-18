# GradleStartCommon

## Class signature

```java
public abstract class GradleStartCommon extends java.lang.Object
```

## Constructors

- `public GradleStartCommon()`

## Methods

- `protected abstract void setDefaultArguments(java.util.Map<java.lang.String,java.lang.String> argMap)`
- `protected abstract void preLaunch(java.util.Map<java.lang.String,java.lang.String> argMap, java.util.List<java.lang.String> extras)`
- `protected abstract java.lang.String getBounceClass()`
- `protected abstract java.lang.String getTweakClass()`
- `protected void launch(java.lang.String[] args) throws java.lang.Throwable`
- `protected static java.lang.Class getFmlClass(java.lang.String classname) throws java.lang.ClassNotFoundException`
- `public static java.lang.Class getFmlClass(java.lang.String classname, java.lang.ClassLoader loader) throws java.lang.ClassNotFoundException`