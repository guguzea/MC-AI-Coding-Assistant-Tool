# NetworkModHolder

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.internal.NetworkModHolder

## Class signature

```java
public class NetworkModHolder extends java.lang.Object
```

## Constructors

- `NetworkModHolder(ModContainer container)`
- `NetworkModHolder(ModContainer container, java.lang.Class<?> modClass, java.lang.String acceptableVersionRange, ASMDataTable table)`
- `NetworkModHolder(ModContainer container, NetworkModHolder.NetworkChecker checker)`

## Methods

- `boolean acceptsVanilla(Side from)`
- `boolean acceptVersion(java.lang.String version)`
- `boolean check(java.util.Map<java.lang.String, java.lang.String> data, Side side)`
- `ModContainer getContainer()`
- `int getLocalId()`
- `int getNetworkId()`
- `void setNetworkId(int value)`
- `void testVanillaAcceptance()`