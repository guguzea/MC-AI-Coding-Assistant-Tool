# Models

> 来源：https://docs.minecraftforge.net/en/1.20.1/resources/client/models
> 版本：1.20.1

# Models

The [model system](https://minecraft.wiki/w/Tutorials/Models#File_path) is Minecraft&rsquo;s way of giving blocks and items their shapes. Through the model system, blocks and items are mapped to their models, which define how they look. One of the main goals of the model system is to allow not only textures but the entire shape of a block/item to be changed by resource packs. Indeed, any mod that adds items or blocks also contains a mini-resource pack for their blocks and items.

## Model Files

Models and textures are linked through [`ResourceLocation`](../../../concepts/resources/#resourcelocation)s but are stored in the `ModelManager` using `ModelResourceLocation`s. Models are referenced in different locations through the block or item&rsquo;s registry name depending on whether they are referencing [block states](https://minecraft.wiki/w/Tutorials/Models#Block_states) or [item models](https://minecraft.wiki/w/Tutorials/Models#Item_models). Blocks will have their `ModelResourceLocation` represent their registry name along with a stringified version of its current [`BlockState`](../../../blocks/states/) while items will use their registry name followed by `inventory`.

> **Note**: Note JSON models only support cuboid elements; there is no way to express a triangular wedge or anything like it. To have more complicated models, another format must be used.

### Textures

Textures, like models, are contained within resource packs and are referred to with `ResourceLocation`s. In Minecraft, the [UV coordinates](https://en.wikipedia.org/wiki/UV_mapping) (0,0) are taken to mean the **top-left** corner. UVs are _*${1}_ from 0 to 16. If a texture is larger or smaller, the coordinates are scaled to fit. A texture should also be square, and the side length of a texture should be a power of two, as doing otherwise breaks mipmapping (e.g. 1x1, 2x2, 8x8, 16x16, and 128x128 are good. 5x5 and 30x30 are not recommended because they are not powers of 2. 5x10 and 4x8 are completely broken as they are not square.). Textures should only ever be not a square if it is [animated](https://minecraft.wiki/w/Resource_Pack?so=search#Animation).