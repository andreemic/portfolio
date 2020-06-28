export default `
precision highp float;
attribute float a_index;

uniform sampler2D u_particles_x;
uniform sampler2D u_particles_y;
uniform float u_particles_size;
uniform float u_aspect_ratio;

varying vec2 v_particle_pos;

highp float decodeFloatRGBA( vec4 v ) {
  float a = floor(v.r * 255.0 + 0.5);
  float b = floor(v.g * 255.0 + 0.5);
  float c = floor(v.b * 255.0 + 0.5);
  float d = floor(v.a * 255.0 + 0.5);
  float exponent = a - 127.0;
  float sign = 1.0 - mod(d, 2.0)*2.0;
  float mantissa = float(a > 0.0)
                  + b / 256.0
                  + c / 65536.0
                  + floor(d / 2.0) / 8388608.0;
  return sign * mantissa * exp2(exponent);
}

void main() {

  // Decode color of u_particles at the right spot into position
  vec2 particle_coord = vec2(
    fract(a_index / u_particles_size),
    floor(a_index / u_particles_size) / u_particles_size
  );

  v_particle_pos = vec2(
    decodeFloatRGBA(texture2D(u_particles_x, particle_coord)),
    decodeFloatRGBA(texture2D(u_particles_y, particle_coord)) 
  );

  // Translate from color (0, 1) to clip space (-1, 1)
  // Imagine as scaling bottom-right quadrant to the top left 
  // to cover all quadrants.
  // (0,0) goes to (-1, 1), etc.
  gl_PointSize = 2.0;
  gl_Position = vec4((2.0 * v_particle_pos.x - 1.0) / u_aspect_ratio, 1.0 - 2.0 * v_particle_pos.y, 0.0, 1.0);
}

`;
