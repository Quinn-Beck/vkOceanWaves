#version 450

struct Vertex {
	vec3 pos;
	vec3 norm;
	vec3 color;
};

layout(binding = 0) uniform ParameterUBO {
    mat4 model;
    mat4 view;
    mat4 proj;
    float deltaTime;
} ubo;

layout(std140, binding = 2) buffer VertexSSBO {
    Vertex vertices[];
};

layout(location = 0) out vec3 fragCoord;
layout(location = 1) out vec3 fragNormal;
layout(location = 2) out vec3 fragView;

void main() {
    uint index = gl_VertexIndex;
    vec3 position = vertices[index].pos;
    vec3 normal = vertices[index].norm;
    vec3 color = vertices[index].color;

    vec4 viewPosition = ubo.view * ubo.model * vec4(position, 1.0);
    fragCoord = viewPosition.xyz;
    fragNormal = normal;
    fragView = (ubo.view * vec4(0.0, 13.0, 40.0, 1.0)).xyz;

    gl_Position = ubo.proj * viewPosition;
}