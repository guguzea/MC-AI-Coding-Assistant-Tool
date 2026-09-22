# ModelBook

**Inheritance:** java.lang.Object → net.minecraft.client.model.ModelBase → net.minecraft.client.model.ModelBook

## Class signature

```java
public class ModelBook extends ModelBase
```

## Constructors

- `ModelBook()`

## Methods

- `void render(Entity entityIn, float p_78088_2_, float p_78088_3_, float p_78088_4_, float p_78088_5_, float p_78088_6_, float scale)` — Sets the models various rotation angles then renders the model.
- `void setRotationAngles(float p_78087_1_, float p_78087_2_, float p_78087_3_, float p_78087_4_, float p_78087_5_, float p_78087_6_, Entity entityIn)` — Sets the model's various rotation angles.

## Fields

- `ModelRenderer bookSpine` — The renderer of spine of the book
- `ModelRenderer coverLeft` — Left cover renderer (when facing the book)
- `ModelRenderer coverRight` — Right cover renderer (when facing the book)
- `ModelRenderer flippingPageLeft` — Right cover renderer (when facing the book)
- `ModelRenderer flippingPageRight` — Right cover renderer (when facing the book)
- `ModelRenderer pagesLeft` — The left pages renderer (when facing the book)
- `ModelRenderer pagesRight` — The right pages renderer (when facing the book)