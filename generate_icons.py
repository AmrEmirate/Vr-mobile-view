import zlib
import struct
import math

def write_png(filename, width, height, rgba_data):
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png += struct.pack('>I', len(ihdr)) + b'IHDR' + ihdr + struct.pack('>I', zlib.crc32(b'IHDR' + ihdr) & 0xffffffff)
    
    # IDAT chunk
    raw = bytearray()
    for y in range(height):
        raw.append(0) # Filter byte: None
        start = y * width * 4
        raw.extend(rgba_data[start:start + width * 4])
        
    compressed = zlib.compress(bytes(raw), 9)
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', zlib.crc32(b'IDAT' + compressed) & 0xffffffff)
    
    # IEND chunk
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', zlib.crc32(b'IEND') & 0xffffffff)
    
    with open(filename, 'wb') as f:
        f.write(png)

def render_vr_icon(size):
    buf = bytearray(size * size * 4)
    cx, cy = size / 2.0, size / 2.0
    r_corner = size * 0.22
    
    # Colors
    bg_color = (11, 15, 25, 255)       # #0b0f19
    headset_color = (2, 132, 199, 255) # #0284c7
    lens_bg = (9, 13, 22, 255)         # #090d16
    lens_cyan = (56, 189, 248, 255)    # #38bdf8
    white = (255, 255, 255, 220)
    
    def set_pixel(x, y, color):
        if 0 <= x < size and 0 <= y < size:
            idx = (y * size + x) * 4
            buf[idx] = color[0]
            buf[idx+1] = color[1]
            buf[idx+2] = color[2]
            buf[idx+3] = color[3]

    for y in range(size):
        for x in range(size):
            # Background with rounded corners
            dx = max(0, abs(x - cx) - (size * 0.45 - r_corner))
            dy = max(0, abs(y - cy) - (size * 0.45 - r_corner))
            dist = math.sqrt(dx*dx + dy*dy)
            
            if dist > r_corner:
                continue # transparent outside rounded box
                
            set_pixel(x, y, bg_color)
            
            # Headset body box
            hx0, hx1 = size * 0.15, size * 0.85
            hy0, hy1 = size * 0.26, size * 0.74
            
            if hx0 <= x <= hx1 and hy0 <= y <= hy1:
                # Nose cutout
                is_nose = (size * 0.42 <= x <= size * 0.58) and (y >= size * 0.62)
                if not is_nose:
                    set_pixel(x, y, headset_color)
            
            # Left Eye Lens
            left_lens_cx, left_lens_cy = size * 0.35, size * 0.48
            lens_rad = size * 0.14
            dist_l = math.hypot(x - left_lens_cx, y - left_lens_cy)
            if dist_l <= lens_rad:
                set_pixel(x, y, lens_cyan if dist_l > lens_rad * 0.75 else lens_bg)
                if math.hypot(x - (left_lens_cx - size*0.04), y - (left_lens_cy - size*0.04)) <= size*0.035:
                    set_pixel(x, y, white)

            # Right Eye Lens
            right_lens_cx, right_lens_cy = size * 0.65, size * 0.48
            dist_r = math.hypot(x - right_lens_cx, y - right_lens_cy)
            if dist_r <= lens_rad:
                set_pixel(x, y, lens_cyan if dist_r > lens_rad * 0.75 else lens_bg)
                if math.hypot(x - (right_lens_cx - size*0.04), y - (right_lens_cy - size*0.04)) <= size*0.035:
                    set_pixel(x, y, white)

    return bytes(buf)

sizes = [16, 32, 48, 128]
for s in sizes:
    data = render_vr_icon(s)
    write_png(f"icons/icon{s}.png", s, s, data)
    print(f"Generated icons/icon{s}.png ({s}x{s})")
