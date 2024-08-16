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
    vec3 specular = sunColor * pow( max(0.0, dot(n, h)), 128.0 );

    vec3 C = mix(vec3(0.0), vec3(1.0), diffuse + vec3(0.0,0.0,0.1) + specular);

    // PBR TEST SHADING MODEL -------------------------------------------------

    vec3 upwelling = vec3(0.0, 0.2, 0.3);
    vec3 sky = vec3(0.69, 0.84, 1.0);
    vec3 air = vec3(0.1, 0.1, 0.1);
    float kDiffuse = 0.91;
    float snell = 1.33;

    // REFLECTIVITY
    float R;
    vec3 I = lightDir;
    vec3 N = fragNormal;
    float costhetai = abs( dot(I, N) );
    float thetai = acos( costhetai );
    float sinthetat = sin(thetai) / snell;
    float thetat = asin( sinthetat );

    // Check for direct hit
    if (thetai == 0.0) {
        R = (snell - 1.0) / (snell + 1.0);
        R = R * R;
    } else {
        float fs = sin(thetat - thetai) / sin(thetat + thetai);
        float ts = tan(thetat - thetai) / tan(thetat + thetai);
        R = 0.5 * ( fs*fs + ts*ts );
    }

    vec3 dPE = fragView;
    float dist = kDiffuse * length(dPE);
    dist = exp(-dist);

    vec3 Ci = dist * ( R * sky + (1-R) * upwelling) + (1-dist) * air;

    outColor = vec4(C, 1.0);
}
