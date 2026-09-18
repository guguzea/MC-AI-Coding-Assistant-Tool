# ModContainerFactory

## Class signature

```java
public class ModContainerFactory extends java.lang.Object
```

## Methods

- `public static ModContainerFactory instance()`
- `public void registerContainerType(Type type, java.lang.Class<? extends ModContainer > container)`
- `public ModContainer build( ASMModParser modParser, java.io.File modSource, ModCandidate container)`