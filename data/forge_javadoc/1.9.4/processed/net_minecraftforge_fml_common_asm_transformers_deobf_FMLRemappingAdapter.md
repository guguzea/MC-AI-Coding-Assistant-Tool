# FMLRemappingAdapter

## Class signature

```java
public class FMLRemappingAdapter extends org.objectweb.asm.commons.RemappingClassAdapter
```

## Constructors

- `public FMLRemappingAdapter(org.objectweb.asm.ClassVisitor cv)`

## Methods

- `public void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `protected org.objectweb.asm.MethodVisitor createRemappingMethodAdapter(int access, java.lang.String newDesc, org.objectweb.asm.MethodVisitor mv)`