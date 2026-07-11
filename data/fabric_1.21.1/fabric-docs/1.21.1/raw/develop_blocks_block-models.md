# blocks block models

> 来源：https://docs.fabricmc.net/develop/blocks/block-models
> 版本：1.21.1
> GitHub 路径：develop/blocks/block-models.md
> 抓取源：vitepress
> 抓取时间：2026-07-11T14:04:45.836Z
> SHA256：8e9976f8cbdaa4b9ae2a2ab31e9288b51d47d824d7877f25d5ad3b28d4a5548c
> 分支：main

# Block Models 26.1.2 ​
A guide to writing and understanding block models.This page will guide you through writing your own block models and understanding all their options and possibilities.

## What Are Block Models? ​
Block models are essentially the definition of a block's looks and visuals. They specify a texture, model translation, rotation, scale and other attributes.

Models are stored as JSON files in your resources folder.

## File Structure ​
Every block model file has a defined structure that has to be followed. It starts with empty curly brackets, which represent the root tag of the model. Here's a brief scheme of how block models are structured:

json{
  "parent": "...",
  "ambientocclusion": "true/false",
  "display": {
    "<position>": {
      "rotation": [0.0, 0.0, 0.0],
      "translation": [0.0, 0.0, 0.0],
      "scale": [0.0, 0.0, 0.0]
    }
  },
  "textures": {
    "particle": "...",
    "<texture_variable>": "..."
  },
  "elements": [
    {
      "from": [0.0, 0.0, 0.0],
      "to": [0.0, 0.0, 0.0],
      "rotation": {
        "origin": [0.0, 0.0, 0.0],
        "axis": "...",
        "angle": "...",
        "rescale": "true/false"
      },
      "shade": "true/false",
      "light_emission": "...",
      "faces": {
        "<key>": {
          "uv": [0, 0, 0, 0],
          "texture": "...",
          "cullface": "...",
          "rotation": "...",
          "tintindex": "..."
        }
      }
    }
  ]
}1234567891011121314151617181920212223242526272829303132333435363738
### Parent ​
json{
  "parent": "..."
}123Loads a different model with all its attributes from the given path, as an identifier (namespace:path).

Set this tag to builtin/generated to use a model created from the specified icon. Rotation can be achieved via blockstates.

### Ambient Occlusion ​
json{
  "ambientocclusion": "true/false"
}123This tag specifies whether to use ambient occlusion. Defaults to true.

### Display ​
json{
  "display": {
    "<position>": {
      "rotation": [0.0, 0.0, 0.0],
      "translation": [0.0, 0.0, 0.0],
      "scale": [0.0, 0.0, 0.0]
    }
  }
}123456789This tag is responsible for setting the model translation, rotation and scale in a specified position.

The position object can be one of the following strings, which define what the model will look like in different positions:

ValueDescription`firstperson_righthand`Right hand, as seen in first-person`firstperson_lefthand`Left hand, as seen in first-person`thirdperson_righthand`Right hand, as seen in third-person (F5)`thirdperson_lefthand`Left hand, as seen in third-person (F5)`gui`When in a GUI, for example the inventory`head`When put on the player's head, for example a banner`ground`When on the ground`fixed`When put in an item frameFurthermore, each position can contain these three values, in the form of an array of floats:

json{
  "rotation": [0.0, 0.0, 0.0],
  "translation": [0.0, 0.0, 0.0],
  "scale": [0.0, 0.0, 0.0]
}123451. rotation: Three floats. Specifies the rotation of the model according to the scheme [x, y, z].
2. translation: Three floats. Specifies the translation of the model according to the scheme [x, y, z]. Values must be between -80 and 80; anything outside of this range is set to the closest extremum.
3. scale: Three floats. Specifies the scale of the model according to the scheme [x, y, z]. The maximum value is 4, bigger values are treated as 4.

### Textures ​
json{
  "textures": {
    "particle": "...",
    "<texture_variable>": "..."
  }
}123456The textures tag holds the textures of the model, in the form of an identifier or a texture variable. It contains three additional objects:

1. particle: String. Defines the texture to load particles from. This texture is also used as an overlay if you are in a nether portal, and used for water and lava's still textures. Is also considered a texture variable that can be referenced as #particle.
2. : String. Creates a variable and assigns a texture. Can be later referenced with the # prefix (e.g., "top": "namespace:path" ⇒ #top)

### Elements ​
json{
  "elements": [
    {
      "from": [0.0, 0.0, 0.0],
      "to": [0.0, 0.0, 0.0],
      "rotation": {
        "origin": [0.0, 0.0, 0.0],
        "axis": "...",
        "angle": "...",
        "rescale": "true/false"
      },
      "shade": "true/false",
      "light_emission": "...",
      "faces": {
        "<face>": {
          "uv": [0, 0, 0, 0],
          "texture": "...",
          "cullface": "...",
          "rotation": "...",
          "tintindex": "..."
        }
      }
    }
  ]
}12345678910111213141516171819202122232425Contains all elements of a model, which can only be cubic. If both parent and elements tags are set, this file's elements tag overrides the parent's one.

json{
  "from": [0.0, 0.0, 0.0],
  "to": [0.0, 0.0, 0.0]
}1234from specifies the starting point of the cuboid according to the scheme [x, y, z], relative to the lower left corner. to specifies the ending point. A cuboid as big as a standard block would start at [0, 0, 0] and end at [16, 16, 16]. The values of both must be between -16 and 32, which means that every block model can be at most 3×3 blocks big.

json{
  "rotation": {
    "origin": [0.0, 0.0, 0.0],
    "axis": "...",
    "angle": "...",
    "rescale": "true/false"
  }
}12345678rotation defines the rotation of an element. It contains four more values:

1. origin: Three floats. Sets the center of the rotation according to the scheme [x, y, z].
2. axis: String. Specifies the direction of rotation, and must be one of these: x, y and z.
3. angle: Float. Specifies the angle of rotation. Ranges from -45 to 45.
4. rescale: Boolean. Specifies whether to scale the faces across the whole block. Defaults to false.
json{
  "shade": "true/false"
}123shade defines if shadows are rendered. Defaults to true.

json{
  "light_emission": "..."
}123light_emission defines the minimum light level that the element can receive. It can range between 0 and 15. Defaults to 0.

json{
  "faces": {
    "<key>": {
      "uv": [0, 0, 0, 0],
      "texture": "...",
      "cullface": "...",
      "rotation": 0,
      "tintindex": 0
    }
  }
}1234567891011faces holds all faces of a cuboid. If a face is not set, it will not be rendered. Its keys () can be one of: down, up, north, south, west or east. Each key contains the properties for that face:

1. uv: Four integers. Defines the area of the texture to use according to the scheme [x1, y1, x2, y2]. If unset, it defaults to values equal to xyz position of the element. Flipping the values of x1 and x2 (for example from 0, 0, 16, 16 to 16, 0, 0, 16) flips the texture. UV is optional, and if not supplied, it's automatically generated based on the element's position.
2. texture: String. Specifies the texture of the face in the form of a texture variable, prepended with #.
3. cullface: String. Can be: down, up, north, south, west, or east. Specifies whether a face does not need to be rendered when there is a block touching it in the specified position. It also determines the side of the block to use the light level from for lighting the face, and if unset, defaults to the side.
4. rotation: Integer. Rotates the texture clockwise by the specified number of degrees in 90 degree increments. Rotation does not affect which part of the texture is used. Instead, it amounts to permutation of the selected texture vertices (selected implicitly, or explicitly though uv).
5. tintidex: Integer. Tints the texture on that face using a tint value. The default value, -1, indicates not to use the tint. Any other number is provided to BlockColors to get the tint value corresponding to that index (returns white when the block doesn't have a tint index defined).
Copied