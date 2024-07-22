#version 450

layout(location = 0) in vec3 fragCoord;
layout(location = 1) in vec3 fragNormal;
layout(location = 2) in vec3 fragView;

layout(location = 0) out vec4 outColor;

const vec3 ambient = vec3(151.0,235.0,219.0) / 255.0;
const vec3 mate = vec3(0.0, 40.0, 133.0) / 255.0;
const vec3 sunCoord = vec3(0.0,10.0,0.0);
const vec3 sunColor = vec3(1.0, 1.0, 1.0);
const float sunPower = 1.0;
const vec3 specColor = vec3(1.0, 1.0, 1.0);
const float shininess = 256.0;
const float screenGamma = 2.2;

void main() {
    vec3 viewDir = normalize(fragCoord - fragView);
    vec3 sunDir  = normalize(sunCoord - fragCoord);
    vec3 halfDir = normalize(viewDir + sunDir);

    float sunDistance = pow(length(sunDir), 2);

    float sunDiff = clamp( dot(fragNormal,sunDir),0.0,1.0);
    float specAngle = clamp( dot(halfDir, fragNormal),0.0,1.0);
    float specular = pow(specAngle, shininess);
    float fresnel = pow(1 - dot(viewDir, fragNormal), 5);
        
    vec3 tempColor  = mate * sunDiff * sunColor * sunPower / sunDistance;
         tempColor += specColor * specular * fresnel * sunColor * sunPower / sunDistance;
         tempColor = clamp(tempColor,0.0,1.0);

    // vec3 gammaCorrected = pow(tempColor, vec3(1.0 / screenGamma));

    outColor = vec4(tempColor, 1.0);
}