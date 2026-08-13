# Animation State Machine Files

Animation State Machine (ASM) Files are the meat of the animation API. These define how the animation is carried out and how to use the clips defined in the armature file.

## Concepts

The ASM contains *parameters*, *clips*, *states*, and *transitions*.

### States

The Animation *State* Machine can be in many different *states*. You define which states there are in the states section.

### Transitions

Transistions define which states are allowed to go to other states, for example allowing a `closed` state to go to an `open` state.


<!-- key:🟠 role:常见错误 -->


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note Transitions do not define animations that are played between states, however. If you want to do that you must create an additional state that plays an animation then uses an event to go to the next state.

### Parameters


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note Parameters are called TimeValues in the code, hence the naming convention of SomethingValue.

All parameters take an input, usually the current game time in seconds as a float (factoring in partial ticks) and outputs another time. This output is then used as the input to a clip, telling it the current progress of the animation.

Each parameter can either be defined in the ASM or when you load the ASM in the code. Load-time parameters are usually of the type `VariableValue`, which returns a value changeable in-code, ignoring its input. Other types allow you to do math on the input (`SimpleExprValue`), return a constant (`ConstValue`), refer to other parameters (`ParameterValue`), return the input unmodified (`IdentityValue`) and perform composition of two parameters (`CompositionValue`).

### Clips


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note Clips can either be ASM-clips, ones that are defined in the ASM, or armature-clips, ones that are defined in the armature file. For the rest of this page, &ldquo;clips&rdquo; will refer to ASM-clips unless otherwise stated.


<!-- key:🟠 role:常见错误 -->

A clip takes in an input, usually the time, and does something to the model with it. Different types of clips do different things, the simplest being animating an armature-clip (`ModelClip`). You can also override the input to another ASM-clip (`TimeClip`), trigger an event while animating another clip if the input is positive (`TriggerClip`), smoothly blend between two clips (`SlerpClip`), refer to another clip in the ASM (`ClipReference`) or do nothing (`IdentityClip`).

### Events

Various things can trigger events in the ASM. Events in the ASM are represented using only text. Some events are special, with text that is formatted like this: `!event_type:event_value`. Right now there is only one kind of `event_type`, namely `transition`. This tries to transition to whatever state is defined in the `event_value`. Anything else is a normal event and can be used from the `pastEvents` callback, but more information about that is on the [implementing](../implementing/) page.

## Code API


<!-- key:🔴 role:新手必读 (Warning) -->

> **Warning**: Warning The ASM code API can only be used client side. When storing ASMs in code, use the side-agnostic IAnimationStateMachine interface.

ASMs can be loaded by calling `ModelLoaderRegistry.loadASM`. It takes two parameters, the first being a `ResourceLocation` denoting where the ASM is stored, and second an ImmutableMap of load-time defined parameters.

An example: ``` @Nullable private final IAnimationStateMachine asm; private final VariableValue cycle = new VariableValue(4); public Spin() { asm = proxy.loadASM(new ResourceLocation(MODID, "asms/block/rotatest.json"), ImmutableMap.of("cycle_length", cycle)); } ```


<!-- key:🟠 role:常见错误 -->

Here, an ASM is loaded (from a sidedproxy to avoid crashing on server) with one extra parameter, named `cycle_length`. This parameter is of the type `VariableValue`, so we can set it from within our code.

Using an ASM instance, you can get the current state with `.currentState()` and transition to another state with `.transition(nextState)`

`VariableValue` parameters can have their value set by calling `.setValue`, but you can not read this value back. There is no need to inform the ASM of this change, it happens automatically.

## File Format

The ASMs are stored in json files. The location does not matter, but they are usually placed in an `asms` folder.

First, a simple example: ``` { "parameters": { "anim_cycle": ["/", "#cycle_length"] }, "clips": { "default": ["apply", "forgedebugmodelanimation:block/rotatest@default", "#anim_cycle" ] }, "states": [ "default" ], "transitions": {}, "start_state": "default" } ```

As stated above, the files have parameters, clips, states and transitions, as well as the starting state of the ASM.

All of these tags are required, even if they are empty.

### Parameters

```
{
    "name": 
} ``` <p>Different types of parameters have different formats for `<parameter_definition>`, and the simple ones are:

- <li>`IdentityValue`: the string `#identity`,
- <li>`ParameterValue`: the parameter to reference, prefixed with `#`, e.g. `#my_awesome_parameter`
- <li>`ConstValue`: a number to use as the constant to return

#### Mathematical expression (`SimpleExprValue)

Format: <code>[ regex("[+\\-*/mMrRfF]+"), <parameter_definition>, ... ]`

##### Examples:

```toml
[ "+", 4 ]
[ "/+", 5, 1]
[ "++", 2, "#other" ]
[ "++", "#other", [ "compose", "#cycle", 3] ]
```

##### Explanation

The `SimpleExprValue` takes its input and applies operations to it. The first parameter is the sequence of operations to apply, and the rest represent the operands to those operations. The input to each operation is either the input to this entire parameter (for the first operation) or the result of the previous operation.

##### Operations (case-sensitive):

Operator | Meaning
--- | ---
`+` | `output = input + arg`
`-` | `output = input - arg`
`*` | `output = input * arg`
`/` | `output = input / arg`
`m` | `output = min(input, arg)`
`M` | `output = max(input, arg)`
`r` | `output = floor(input / arg) * arg`
`R` | `output = ceil(input / arg) * arg`
`f` | `output = input - floor(input / arg) * arg`
`F` | `output = ceil(input / arg) * arg - input`

##### Example explanations:

- <li>input + 4
- <li>(input / 5) + 1
- <li>input + 2 + value of parameter `other`
- <li>input + value of parameter `other` + value of parameter `cycle` given input 3

#### Function composition (`CompositionValue)

Format: <code>[ "compose", <parameter_definition>, <parameter_definition> ]`

##### Examples:

```toml
[ "compose", "#cycle", 3]
[ "compose", "#test", "#other"]
[ "compose", [ "+", 3], "#other"]
[ "compose", [ "compose", "#other2", "#other3"], "#other"]
```

##### Explanation

`CompositionValue` takes two parameter definitions as inputs, and does `value1(value2(input))`. In other words, it chains the two inputs, calling the second one with the given input, and the first one with the output of the second one.

##### Example explanations:

- <li>value of parameter `cycle` when given input 3
- <li>value of parameter `test` when given the output of parameter other when called with the current input
- <li>3 + the output of other with the current `input`
- <li>`other2(other3(other(input)))` because `value1` = `other2(other3(input))` and `value2` = `other(input)`

### Clips

```
{
    "name": <clip_definition>
}
```

As with parameters, different kinds of clips have different formats for `<clip_definition>`, but the simple ones are:

- <li>`IdentityClip`: the string `#identity`
- <li>`ClipReference`: the clip name prefixed with `#`, e.g. `#my_amazing_clip`
- <li>`ModelClip`: a model resource location + `@` + the name of the armature-clip, e.g. `mymod:block/test@default` or `mymod:block/test#facing=east@moving`

#### Overriding input (`TimeClip)

Format: <code>[ "apply", <clip_definition>, <parameter_definition> ]`

##### Examples:

```toml
["apply", "mymod:block/animated_thing@moving", "#cycle_time"]
["apply", [ "apply", "mymod:block/animated_thing@moving", [ "+", 3 ] ], "#cycle"]
```

##### Explanation

The `TimeClip` takes another clip and applies it using a custom parameter instead of the current time. Usually used to apply a `ModelClip` with a parameter instead of the current time.

##### Example explanations:

- <li>apply the armature-clip for model `mymod:block/animated_thing` named moving with the output of the parameter `cycle_time`
- <li>apply the armature-clip for model `mymod:block/animated_thing` named moving with 3 + the output of the parameter `cycle`

#### Triggering an event (`TriggerClip)

Format: <code>[ "trigger_positive", <clip_definition>, <parameter_definition>, "<event_text>"]`

##### Examples

```toml
[ "trigger_positive", "#default", "#end_cycle", "!transition:moving" ]
[ "trigger_positive", "mymod:block/animated_thing@moving", "#end_cycle", "boop" ]
```

##### Explanation

The `TriggerClip` visually acts as a `TimeClip`, but also fires the event in `event_text` when the `parameter_description` goes positive. At the same time, it applies the clip in `clip_definition` with the same `parameter_description`.

##### Example explanations

- <li>apply the clip with name default given the input of parameter `end_cycle`, and when `end_cycle` is positive transition to the `moving` state
- <li>apply the armature-clip `mymod:block/animated_thing@moving` with parameter `end_cycle`, and when `end_cycle` is positive fire event `"boop"`

#### Blend between two clips (`SlerpClip)

Format: <code>[ "slerp", <clip_definition>, <clip_definition>, <parameter_definition>, <parameter_definition> ]`

##### Examples

```toml
[ "slerp", "#closed", "#open", "#identity", "#progress" ]
[ "slerp", [ "apply", "#move", "#mover"], "#end", "#identity", "#progress" ]
```

##### Explanation

The `SlerpClip` performs a spherical linear blend between two separate clips. In other words, it will morph one clip into another smoothly. The two `clip_definition`s are the clips to blend from and to respectively. The first `parameter_definition` is the &ldquo;input&rdquo;. Both the from and to clips are passed the output of this parameter with the current animation time. The second `parameter_definition` is the &ldquo;progress&rdquo;, a value between 0 and 1 to denote how far into the blend we are. Combining this clip with trigger_positive and transition special events can allow for simple transitions between two solid states.

###### Example explanations

- <li>blend the closed clip to the open clip, giving both clips the unaltered time as input and blend progress `#progress`.
- <li>blend the result of the move clip when given the input parameter `mover` to the end clip with the unaltered time as the input with blend progress `#progress`.

### States

The states section of the file is simply a list of all possible states. For example ``` "states": [ "open", "closed", "opening", "closing", "dancing" ] ``` defines 5 states: open, closed, opening, closing and dancing.

## Transitions

The transitions section defines which states can go to what other states. A state can go to 0, 1, or many other states. To define a state as going to no other states, omit it from the section. To define a state as going to only one other state, create a key with the value of the state it can go to, for example `"open": "opening"`. To define a state as going to many other states, do the same as if it were going to only one other state but make the value a list of all possible recieving states instead, for example: `"open": ["closed", "opening"]`.

A more full example:

```
"transitions": {
  "open": "closing",
  "closed": [ "dancing", "opening" ],
  "closing": "closed",
  "opening": "open",
  "dancing": "closed"
}
```

This example means that:

- <li>the open state can go to the closing state
- <li>the closed state can go to either the dancing or opening state
- <li>the closing state can go to the closed state
- <li>the opening state can go to the open state
- <li>the dancing state can go to the closed state