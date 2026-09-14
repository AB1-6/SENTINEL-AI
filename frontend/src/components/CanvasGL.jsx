import { useEffect, useRef } from 'react';

const vert = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const frag = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_accent;

// simple moving bands + noise-like function
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i + vec2(0.0,0.0));
  float b = hash(i + vec2(1.0,0.0));
  float c = hash(i + vec2(0.0,1.0));
  float d = hash(i + vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * vec2(u_resolution.x / u_resolution.y, 1.0);
  float t = u_time * 0.06;
  float n = noise(p * 3.0 + t);
  float bands = smoothstep(0.45 + 0.12 * sin(u_time*0.2), 0.55 + 0.12 * sin(u_time*0.2), p.y + 0.06 * n);
  vec3 color = mix(vec3(0.02,0.03,0.06), u_accent, pow(bands, 1.6));
  // reduce overall alpha so the canvas doesn't overpower the UI
  outColor = vec4(color, 0.06 + 0.12 * n);
}
`;

export default function CanvasGL() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: false });
    if (!gl) return;

    let prog, vao, start;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const v = compile(gl.VERTEX_SHADER, `#version 300 es
    in vec2 position; void main(){ gl_Position = vec4(position, 0.0, 1.0); }`);
    const f = compile(gl.FRAGMENT_SHADER, frag);
    prog = gl.createProgram();
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }

    const positions = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    vao = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vao);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0,0,canvas.width,canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    const u_resolution = gl.getUniformLocation(prog, 'u_resolution');
    const u_time = gl.getUniformLocation(prog, 'u_time');
    const u_accent = gl.getUniformLocation(prog, 'u_accent');

    function hexToRgb(h) {
      const v = getComputedStyle(document.getElementById('root')).getPropertyValue('--accent') || '#4dd7ff';
      const hex = v.trim();
      const m = hex.replace('#','');
      const r = parseInt(m.substring(0,2),16)/255;
      const g = parseInt(m.substring(2,4),16)/255;
      const b = parseInt(m.substring(4,6),16)/255;
      return [r,g,b];
    }

    function render(t) {
      if (!start) start = t;
      const time = (t - start) * 0.001;
      const accent = hexToRgb();
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      // position attribute
      const loc = gl.getAttribLocation(prog, 'position');
      if (loc >= 0) {
        gl.enableVertexAttribArray(loc);
        gl.bindBuffer(gl.ARRAY_BUFFER, vao);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      }
      gl.uniform2f(u_resolution, canvas.width, canvas.height);
      gl.uniform1f(u_time, time);
      gl.uniform3f(u_accent, accent[0], accent[1], accent[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="canvas-gl fixed inset-0 -z-20 pointer-events-none" />;
}
