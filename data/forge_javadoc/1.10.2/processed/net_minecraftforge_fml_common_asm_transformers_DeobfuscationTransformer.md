# DeobfuscationTransformer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.asm.transformers.DeobfuscationTransformer

## Class signature

```java
public class DeobfuscationTransformer extends java.lang.Object implements net.minecraft.launchwrapper.IClassTransformer, net.minecraft.launchwrapper.IClassNameTransformer
```

## Constructors

- `DeobfuscationTransformer()`

## Methods

- `java.lang.String remapClassName(java.lang.String name)`
- `byte[] transform(java.lang.String name, java.lang.String transformedName, byte[] bytes)`
- `java.lang.String unmapClassName(java.lang.String name)`