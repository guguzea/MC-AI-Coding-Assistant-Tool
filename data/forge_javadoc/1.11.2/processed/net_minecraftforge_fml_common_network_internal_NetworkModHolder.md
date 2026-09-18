# NetworkModHolder

## Class signature

```java
public class NetworkModHolder extends java.lang.Object
```

## Constructors

- `public NetworkModHolder( ModContainer container)`
- `public NetworkModHolder( ModContainer container, NetworkModHolder.NetworkChecker checker)`
- `public NetworkModHolder( ModContainer container, java.lang.Class<?> modClass, @Nullable java.lang.String acceptableVersionRange, ASMDataTable table)`

## Methods

- `public boolean acceptVersion(java.lang.String version)`
- `public boolean check(java.util.Map<java.lang.String,java.lang.String> data, Side side)`
- `public int getLocalId()`
- `public int getNetworkId()`
- `public ModContainer getContainer()`
- `public void setNetworkId(int value)`
- `public void testVanillaAcceptance()`
- `public boolean acceptsVanilla( Side from)`