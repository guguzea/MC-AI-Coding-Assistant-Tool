---
version: "1.12.2"
forgeVersion: "14.23.5.2858"
chapter: "models/advanced/imodelstate+part"
source: "https://docs.minecraftforge.net/en/1.12.x/models/advanced/imodelstate+part/"
sourceType: mkdocs
---
# `IModelState and <code>IModelPart

<code>IModelState` and `IModelPart` are a way to transform models (or parts thereof). An `IModelPart` represents the part of the model being transformed. An `IModelState` represents a function `IModelPart` → `TRSRTransform`. By applying the `IModelState` to an `IModelPart`, we get a `TRSRTransform` representing how to transform that part. Note that passing `Optional.absent()` to `IModelState::apply` has a different meaning than usual. Doing so means getting the transform for the *entire* model, instead of just a part of it.

One of the uses of this is animation. An `IModelState` can represent a certain frame of the animation and supply transforms to turn the original model into the current frame. By supplying different `IModelState`s over time, an animation can be performed. For example, the B3D model format supports this kind of animation directly through its nodes; however, the animation system is still WIP. Another, more common use case is Forge blockstate JSONs. The models within the blockstates can be transformed with `transform` tags, which translate into simple `IModelState`s that are passed into the contained models. Finally, another use case is [perspective aware models](../perspective/).

Which `IModelPart`s a certain model will use is dependent on the model itself. If I had a `B3DState` that dealt with B3D `NodeJoint`s and tried to use it on a vanilla JSON model, it wouldn&rsquo;t work as vanilla models have no idea what a `NodeJoint` is and will not even ask about them.