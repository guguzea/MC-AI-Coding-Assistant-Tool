# ASMModParser

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.discovery.asm.ASMModParser

## Class signature

```java
public class ASMModParser extends java.lang.Object
```

## Constructors

- `ASMModParser(java.io.InputStream stream)`

## Methods

- `void addAnnotationArray(java.lang.String name)`
- `void addAnnotationEnumProperty(java.lang.String name, java.lang.String desc, java.lang.String value)`
- `void addAnnotationProperty(java.lang.String key, java.lang.Object value)`
- `void addSubAnnotation(java.lang.String name, java.lang.String desc)`
- `void beginNewTypeName(java.lang.String typeQName, int classVersion, java.lang.String superClassQName, java.lang.String[] interfaces)`
- `void endArray()`
- `void endSubAnnotation()`
- `java.util.LinkedList<ModAnnotation> getAnnotations()`
- `Type getASMSuperType()`
- `Type getASMType()`
- `int getClassVersion()`
- `void sendToTable(ASMDataTable table, ModCandidate candidate)`
- `void startClassAnnotation(java.lang.String annotationName)`
- `void startFieldAnnotation(java.lang.String fieldName, java.lang.String annotationName)`
- `void startMethodAnnotation(java.lang.String methodName, java.lang.String methodDescriptor, java.lang.String annotationName)`
- `java.lang.String toString()`
- `void validate()`