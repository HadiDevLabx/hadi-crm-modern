# 3D Models Directory

This directory is for storing 3D model files (.glb, .gltf) used by the application's 3D components.

## Default Models

- default-avatar.glb - Default avatar model for 3D user representations
- cube.glb - Simple cube for testing and fallback purposes

## Usage Guidelines

1. Models should be optimized for web use (reduced poly count, compressed textures)
2. Prefer .glb format for smaller file sizes and single-file convenience
3. Keep models under 2MB for optimal loading performance
4. Use draco compression where applicable for larger models

## Adding New Models

When adding new models:
1. Include them in this directory
2. Update any relevant component files to reference the new models
3. Consider adding fallback options for accessibility and performance
