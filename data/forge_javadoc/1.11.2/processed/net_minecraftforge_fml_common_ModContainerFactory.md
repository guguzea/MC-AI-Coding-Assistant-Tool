# ModContainerFactory

## Class signature

```java
public class ModContainerFactory extends java.lang.Object
```

## Methods

- `public static ModContainerFactory instance()`
- `public void registerContainerType(org.objectweb.asm.Type type, java.lang.Class<? extends ModContainer > container)`
- `@Nullable public ModContainer build( ASMModParser modParser, java.io.File modSource, ModCandidate container)`