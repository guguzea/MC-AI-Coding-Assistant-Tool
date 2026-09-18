# ASMModParser

## Class signature

```java
public class ASMModParser extends java.lang.Object
```

## Constructors

- `public ASMModParser(java.io.InputStream stream) throws java.io.IOException`

## Methods

- `public void beginNewTypeName(java.lang.String typeQName, int classVersion, java.lang.String superClassQName, java.lang.String[] interfaces)`
- `public void startClassAnnotation(java.lang.String annotationName)`
- `public void addAnnotationProperty(java.lang.String key, java.lang.Object value)`
- `public void startFieldAnnotation(java.lang.String fieldName, java.lang.String annotationName)`
- `public java.lang.String toString()`
- `public Type getASMType()`
- `public int getClassVersion()`
- `public Type getASMSuperType()`
- `public java.util.LinkedList< ModAnnotation > getAnnotations()`
- `public void validate()`
- `public void sendToTable( ASMDataTable table, ModCandidate candidate)`
- `public void addAnnotationArray(java.lang.String name)`
- `public void addAnnotationEnumProperty(java.lang.String name, java.lang.String desc, java.lang.String value)`
- `public void endArray()`
- `public void addSubAnnotation(java.lang.String name, java.lang.String desc)`
- `public void endSubAnnotation()`
- `public void startMethodAnnotation(java.lang.String methodName, java.lang.String methodDescriptor, java.lang.String annotationName)`