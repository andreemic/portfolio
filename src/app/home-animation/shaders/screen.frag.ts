export default `precision highp float;

uniform sampler2D u_screen;
uniform float u_opacity;

varying vec2 v_tex_pos;

void main() {
  vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);

  //Helps guarantee fading even if u_opacity ~= 1.0
  gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
}`
