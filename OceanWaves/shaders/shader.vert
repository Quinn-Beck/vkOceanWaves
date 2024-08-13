#version 450

struct Vertex {
	vec3 pos;
	vec3 norm;
	vec3 color;
};

layout(binding = 0) uniform ParameterUBO {
    vec3 eye;
    mat4 model;
    mat4 view;
    mat4 invView;
    mat4 normalMat;
    mat4 proj;
    float deltaTime;
} ubo;

layout(std140, binding = 2) buffer VertexSSBO {
    Vertex vertices[];
};

layout(location = 0) out vec3 fragCoord;
layout(location = 1) out vec3 fragNormal;
layout(location = 2) out vec3 fragView;
layout(location = 3) out vec3 lightDir;

void main() {
    uint index = gl_VertexIndex;

    // Vertex attributes in world space
    vec3 position = vertices[index].pos;
    vec3 normal = vertices[index].norm;
    vec3 color = vertices[index].color;

    // TODO: Update this for dynamic camera, will likely need to fetch location each frame
    // Get eye position from inverse view matrix
    // vec3 eyePosition = vec3(ubo.invView[0][3], ubo.invView[1][3], ubo.invView[2][3]);

    vec4 vertPosition = ubo.view * ubo.model * vec4(position, 1.0);

    fragCoord = vec3(vertPosition) / vertPosition.w;
    fragNormal = normalize(vec3(ubo.normalMat * vec4(normal, 1.0)));
    fragView = normalize((ubo.view * ubo.model * vec4(ubo.eye - position, 1.0)).xyz);
    lightDir = normalize((ubo.view * ubo.model * vec4(0.0,20.0,-20.0,1.0)).xyz);

    gl_Position = ubo.proj * ubo.view * ubo.model * vec4(position, 1.0);
}