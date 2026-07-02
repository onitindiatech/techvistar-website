import os
import struct

def get_image_info(filepath):
    """Returns (width, height) and format of an image file."""
    with open(filepath, 'rb') as f:
        head = f.read(32)
        if len(head) < 24:
            return None
        if head.startswith(b'\x89PNG\r\n\x1a\n'):
            w, h = struct.unpack('>ii', head[16:24])
            return (w, h), 'PNG'
        elif head.startswith(b'\xff\xd8'):
            # JPEG: search for SOF marker
            f.seek(0)
            size = 2
            ftype = 0
            while True:
                f.seek(size, 1)
                b = f.read(4)
                if not b:
                    break
                ftype, l = struct.unpack('>HH', b)
                if ftype in (0xFFC0, 0xFFC2):
                    f.seek(1, 1)
                    h, w = struct.unpack('>HH', f.read(4))
                    return (w, h), 'JPEG'
                size = l - 2
    return None

for f in ['1.jpg', '2.jpg', '3.jpg', '4.jpg', 'qq.jpg', 'ww.png']:
    p = os.path.join('frontend/src/assets', f)
    if os.path.exists(p):
        info = get_image_info(p)
        print(f"{f}: {info}")
