# Fonts Directory

This directory contains font files used by the 3D components and specialized UI elements in the application.

## Included Fonts

- inter-medium.woff - Inter font in Medium weight for 3D text elements
- inter-regular.woff - Inter font in Regular weight for 3D text elements

## Usage in 3D Text

When using fonts with the Text component from @react-three/drei:

```jsx
<Text
  font="/fonts/inter-medium.woff"
  fontSize={0.3}
  color="white"
  anchorX="center"
  anchorY="middle"
>
  Text Content
</Text>
```
