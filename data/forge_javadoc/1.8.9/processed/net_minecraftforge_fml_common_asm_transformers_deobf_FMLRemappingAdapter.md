# FMLRemappingAdapter

## Class signature

```java
public class FMLRemappingAdapter extends RemappingClassAdapter
```

## Constructors

- `public FMLRemappingAdapter(ClassVisitor cv)`

## Methods

- `public void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `protected MethodVisitor createRemappingMethodAdapter(int access, java.lang.String newDesc, MethodVisitor mv)`