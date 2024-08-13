#version 450

layout(location = 0) in vec3 fragCoord;
layout(location = 1) in vec3 fragNormal;
layout(location = 2) in vec3 fragView;
layout(location = 3) in vec3 lightDir;

layout(location = 0) out vec4 outColor;

const vec3 ambient = vec3(64.0, 156.0, 255.0) / 255.0;
const vec3 mate = vec3(0.0, 40.0, 133.0) / 255.0;
const vec3 sunCoord = vec3(0.0, 10.0, -40.0);
const vec3 sunColor = vec3(1.0, 1.0, 1.0);
const float sunPower = 4.0;
const vec3 specColor = vec3(1.0, 1.0, 1.0);
const float shininess = 50.0;
const float screenGamma = 2.2;

// light ray
    vec3 l = lightDir;

void main() {
    // surface normal
    vec3 n = fragNormal;

    // view ray
    vec3 v = fragView;

    // halfway ray
    vec3 h = normalize(l+v);

    // lambertian diffuse
    vec3 diffuse = sunColor * max(0.0, dot(l, n)) * 0.5 + 0.5;
          diffuse *= diffuse * ambient;

    // specular reflection
    vec3 specular = sunColor * pow( max(0.0, dot(n, h)), 50.0 );

    vec3 C = mix(vec3(0.0), vec3(1.0), diffuse + vec3(0.0,0.0,0.1) + specular);


    outColor = vec4(C, 1.0);
}
