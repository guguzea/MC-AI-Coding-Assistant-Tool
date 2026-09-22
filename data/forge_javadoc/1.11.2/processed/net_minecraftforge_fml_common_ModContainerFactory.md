# ModContainerFactory

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.ModContainerFactory

## Class signature

```java
public class ModContainerFactory extends java.lang.Object
```

## Methods

- `ModContainer build(ASMModParser modParser, java.io.File modSource, ModCandidate container)`
- `static ModContainerFactory instance()`
- `void registerContainerType(org.objectweb.asm.Type type, java.lang.Class<? extends ModContainer> container)`

## Fields

- `static java.util.Map<org.objectweb.asm.Type, java.lang.reflect.Constructor<? extends ModContainer>> modTypes`