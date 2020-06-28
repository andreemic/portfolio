class UpdateShader {
  static getFragSource() {
    let index = Math.floor(Math.random() * (this.velGenerators.length));
    return this.fragSource.replace("%gen_velocity_code%", this.velGenerators[index]); 

  }


  //vec2 p = particle position
  //vec2 v 
  static velGenerators = [
    `
      v = -p;
    `,
    `
      v.x = 0.5;
      v.y = 0.5;
    `,
    `
      p.y += 0.6;
      v.x = p.y;
      v.y = -p.y;
     `,
    `
      v.x = cos(p.y) * 0.5;
      v.y = -sin(pow(p.y, 2.0) + pow(p.x, 2.0)) * 0.5;
    `,
    `
      p += vec2(1, 1);
      v.x = (p.y+p.x);
      v.y = -min(sin(sin(p.x*p.y)),p.x*cos(p.y));
    `,
    `
      v.x = cos((max(sin((p.x+p.y)),p.y)-p.x));
      v.y = p.x;
    `,
    `
      p.y -= 0.6;
      p = p * 2.0;

      float num_rays = 10.0;
      float thrust = 1.3;
      float radial_rate = 1.4;
      float wiggle_rate = 20.0;

      vec2 p_orth = vec2(-p.y, p.x);
      float angle = atan(p.y/p.x) + 3.14159*(1.0 - sign(p.x))/2.0;
      float a = sin(radial_rate*length(p))+1.0;
      v += p*thrust;
      v += p*sin(wiggle_rate*a) + p_orth*cos(wiggle_rate*a);
      v *= 1.0/length(v);
      v *= (1.0 + sin(num_rays*angle));
      v /= log(length(p));


    `

  ]


  static fragSource = `
    precision highp float;

    uniform sampler2D u_particles_x;
    uniform sampler2D u_particles_y;
    uniform int u_out_dimension;

    uniform float u_speed_factor;
    uniform float u_rand_seed;
    uniform float u_drop_rate;
    uniform float u_drop_rate_bump;
    uniform vec2 u_click_coord;
    //uniform vec2 u_device_orientation;

    // pseudo-random generator
    const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
    float rand(const vec2 co) {
        float t = dot(rand_constants.xy, co);
        return fract(sin(t) * (rand_constants.z + t));
    }

    varying vec2 v_tex_pos; //particle position on particle state texture

    vec2 gen_velocity(vec2 p) {
      p = -2.0 * p + 1.0;
      vec2 v;
      %gen_velocity_code%
      return v;
    }

    vec4 encodeFloatRGBA(highp float val) {
        if (val == 0.0) {
            return vec4(0.0, 0.0, 0.0, 0.0);
        }
        float mag = abs(val);
        float exponent = floor(log2(mag));
        // Correct log2 approximation errors.
        exponent += float(exp2(exponent) <= mag / 2.0);
        exponent -= float(exp2(exponent) > mag);
        float mantissa;
        if (exponent > 100.0) {
            mantissa = mag / 1024.0 / exp2(exponent - 10.0) - 1.0;
        } else {
            mantissa = mag / float(exp2(exponent)) - 1.0;
        }
        float a = exponent + 127.0; // Write exponent centered around 0 to first byte.
        mantissa *= 256.0;          // Shift mantissa 8 bits to the left. 
        float b = floor(mantissa);  // Write first 8 bits of mantissa, disregard
        mantissa -= b;              // Throw out written bits
        mantissa *= 256.0;          // Shift left bits 8 bits to the left.
        float c = floor(mantissa);  // repeat but take care of sign beat.
        mantissa -= c;
        mantissa *= 128.0;
        float d = floor(mantissa) * 2.0 + float(val < 0.0);
        return vec4(a, b, c, d) / 255.0;
    }
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
      vec2 pos = vec2( //particle position on screen
        decodeFloatRGBA(texture2D(u_particles_x, v_tex_pos)),
        decodeFloatRGBA(texture2D(u_particles_y, v_tex_pos)) 
      );

     
      vec2 velocity = gen_velocity(pos);
      float speed = length(velocity);
      vec2 new_pos = fract(1.0 + pos + velocity * u_speed_factor);


      // Random seed for particle drop
      vec2 seed = (pos + v_tex_pos) * u_rand_seed;

      // Chance to drop a particle in a random position
      float drop_rate = u_drop_rate + speed * u_drop_rate_bump;
      if (rand(seed) < u_drop_rate) {  
        new_pos = vec2(
          rand(seed + 1.3),
          rand(seed + 2.1));
      } else if (u_click_coord.x > 0.0) {
          new_pos += velocity / pow(distance(u_click_coord * 100.0, pos * 100.0), 2.0);
        }

      // encode the new particle position back into RGBA
      if (u_out_dimension == 0) gl_FragColor = encodeFloatRGBA(new_pos.x);
      else if (u_out_dimension == 1) gl_FragColor = encodeFloatRGBA(new_pos.y);
    }`
};

export default UpdateShader;
