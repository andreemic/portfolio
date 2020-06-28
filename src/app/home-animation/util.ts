/*
 * Constructs a program from vertex shader source and fragment shader source GLSL.
 */
export function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

  //Create shader program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Linking shader program failed: ' + gl.getProgramInfoLog(program));
    return null;
  }

  //Create object containing program, attribute locations and uniform locations
  const wrapper = { 
    program: program,
    attributes: {},
    uniforms: {}
  };

  const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < numAttributes; i++) {
    const attr = gl.getActiveAttrib(program, i);
    wrapper['attributes'][attr.name] = gl.getAttribLocation(program, attr.name);
  }
  
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numUniforms; i++) {
    const uniform = gl.getActiveUniform(program, i);
    wrapper['uniforms'][uniform.name] = gl.getUniformLocation(program, uniform.name);
  }


  return wrapper;
} 

/*
 * Constructs a shader from source GLSL.
 */
function createShader(gl: WebGLRenderingContext, type: any, source: string) {
  const shader = gl.createShader(type);

  //Send source to the shader object
  gl.shaderSource(shader, source);

  //Compile sader program
  gl.compileShader(shader);

  //See if compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { 
    throw new Error('Compiling shaders failed: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/*
 * Creates a WebGLTexture and binds a 2D texture image to it.
 */
export function createTexture(gl: WebGLRenderingContext, filter: any, data: any, width: number, height: number) {
  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

  gl.bindTexture(gl.TEXTURE_2D, null); //unbind texture
  
  return texture;
}

/*
 * Activates and binds a given WebGLTexture to a WebGLRenderingContext.
 */
export function bindTexture(gl: WebGLRenderingContext, texture: WebGLTexture, unit: number) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

/*
 * Create a WebGLBuffer with data.
 */
export function createBuffer(gl: WebGLRenderingContext, data: ArrayBuffer) {
  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
  return buffer;
}

/*
 * Bind attribute to a WebGL context.
 * Used to tell an attribute how to get data out of a buffer.
 * Note: type is hard-coded to float.
 */
export function bindAttribute(gl: WebGLRenderingContext, buffer: WebGLBuffer, attribute: GLint, numComponents: GLint) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
  
  let error;
  if (error = gl.getError()) {
    throw new Error(error);
  }
}

/*
 * Bind a framebuffer to a WebGL context.
 * Attach texture to the framebuffer if provided.
 */
export function bindFramebuffer(gl: WebGLRenderingContext, framebuffer: WebGLFramebuffer, texture?: WebGLTexture) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  if (texture) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }
}
