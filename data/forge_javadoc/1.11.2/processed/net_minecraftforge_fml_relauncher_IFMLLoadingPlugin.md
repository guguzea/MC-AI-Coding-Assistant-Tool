# IFMLLoadingPlugin

## Class signature

```java
public interface IFMLLoadingPlugin
```

## Methods

- `java.lang.String[] getASMTransformerClass()`
- `java.lang.String getModContainerClass()`
- `@Nullable java.lang.String getSetupClass()`
- `void injectData(java.util.Map<java.lang.String,java.lang.Object> data)`
- `java.lang.String getAccessTransformerClass()`

## Description

The base plugin that provides class name meta information to FML to enhance the classloading lifecycle for mods in FML