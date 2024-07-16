#version 450

layout(location = 0) in vec3 fragCoord;
layout(location = 1) in vec3 fragNormal;
layout(location = 2) in vec3 fragView;

layout(location = 0) out vec4 outColor;

const vec3 mate = vec3(12.0, 29.0, 224.0) / 255.0;
const vec3 sunCoord = vec3(20.0,20.0,-20.0);
const vec3 sunColor = vec3(1.0, 1.0, 1.0);
const float sunPower = 5.0;
const vec3 specColor = vec3(1.0, 1.0, 1.0);
const float shininess = 32.0;
const float screenGamma = 2.2;

void main() {
    vec3 viewDir = normalize(fragCoord - fragView);
    vec3 sunDir  = normalize(sunCoord - fragCoord);
    vec3 halfDir = normalize(viewDir + sunDir);

    float sunDistance = pow(length(sunDir), 2);

    float sunDiff = clamp( dot(fragNormal,sunDir),0.0,1.0);
    float specAngle = clamp( dot(halfDir, fragNormal),0.0,1.0);
    float specular = pow(specAngle, shininess);
        
    vec3 tempColor  = mate * sunDiff * sunColor * sunPower / sunDistance;
         tempColor += specColor * specular * sunColor * sunPower / sunDistance;
         tempColor = clamp(tempColor,0.0,1.0);

    // vec3 gammaCorrected = pow(tempColor, vec3(1.0 / screenGamma));

    outColor = vec4(tempColor, 1.0);
}