#version 450

layout(location = 0) in vec3 fragCoord;
layout(location = 1) in vec3 fragNormal;
layout(location = 2) in vec3 fragView;

layout(location = 0) out vec4 outColor;

const vec3 ambient = vec3(64.0, 156.0, 255.0) / 255.0;
const vec3 mate = vec3(0.0, 40.0, 133.0) / 255.0;
const vec3 sunCoord = vec3(0.0, 10.0, -40.0);
const vec3 sunColor = vec3(1.0, 1.0, 1.0);
const float sunPower = 4.0;
const vec3 specColor = vec3(1.0, 1.0, 1.0);
const float shininess = 128.0;
const float screenGamma = 2.2;

vec3 lightDir = normalize(vec3(1.0, -1.0, -40.0));

void main() {
    //vec3 viewDir = normalize(fragView - fragCoord);
    vec3 sunDir  = normalize(fragCoord - sunCoord);
    //vec3 halfDir = normalize(viewDir - sunDir);

    float sunDistance = length(sunDir) * length(sunDir);
    float snell = 1.33;

    //float lambertian = max( dot(fragNormal,sunDir), 0.0);
    //float specAngle = max( dot(halfDir, fragNormal), 0.0);
    //float specular = pow(specAngle, shininess);
    // Schlick-Fresnel
    //float R0 = pow( (1.0-1.33) / (1.0+1.33) , 2);
    //float fresnel = R0 + (1 - R0) * pow(1 - dot(viewDir, fragNormal), 5);

    vec3 upwelling = vec3(0.0, 0.2, 0.3);
    vec3 sky = vec3(0.69, 0.84, 1.0);
    vec3 air = vec3(0.1, 0.1, 0.1);
    float kDiffuse = 0.91;

    // REFLECTIVITY
    float R;
    vec3 I = sunDir;
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
    //float fresnel = 0.04 + (1.0 - 0.04) * pow(1 - dot(-viewDir, fragNormal), 5);

    vec3 dPE = fragView;
    float dist = kDiffuse * length(dPE);
    dist = exp(-dist);

    //vec3 ambient = air * 0.1;
    //vec3 diffuse = lambertian * sunColor * sunPower / sunDistance;
    //vec3 specularColor = specular * fresnel * sunColor * sunPower / sunDistance;

    vec3 Ci = dist * ( R * sky + (1-R) * upwelling) + (1-dist) * air;
        
    //vec3 tempColor  = mate * lambertian * sunColor * sunPower / sunDistance;
    //     tempColor += specColor * specular * fresnel * sunColor * sunPower / sunDistance;
    //     tempColor += 0.05 * ambient;
    //     tempColor = clamp(tempColor,0.0,1.0);

    // Ci = pow( Ci, vec3(0.4545) );


    /*
    vec3 v = fragView;
    vec3 n = fragNormal;

    // reflected ray
    vec3 r = 2.0*(dot(v, n))*n - lightDir;

    // blend factors
    float t = (dot(n, lightDir) + 1.0) / 2.0;
    float s = clamp(100.0*dot(r,v) - 97, 0.0, 1.0);

    // tones
    vec3 cCool = vec3(0.0, 0.0, 0.55) + 0.25*mate;
    vec3 cWarm = vec3(0.3, 0.3, 0.0) + 0.25*mate;

    vec3 C = s*specColor + (1.0-s)*(t*cWarm + (1.0-t)*cCool);
    */

    outColor = vec4(Ci, 1.0);
}
