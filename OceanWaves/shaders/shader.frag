#version 450

layout(location = 0) in vec3 fragPos;

layout(location = 0) out vec4 outColor;

void main() {
    outColor = vec4(fragPos.xyz, 1.0);
}