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

layout(location = 0) out vec3 fragPos;

void main() {
    uint index = gl_VertexIndex;
    vec3 position = vertices[index].pos;
    vec3 color = vertices[index].color;

    gl_Position = ubo.proj * ubo.view * ubo.model * vec4(position, 1.0);
    fragPos = gl_Position.xyz;
}