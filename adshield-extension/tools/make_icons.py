#!/usr/bin/env python3
"""Generate AdShield PNG icons without any third-party dependencies.

Draws a green shield with a white "no entry" (circle + slash) mark at sizes
16, 32, 48 and 128. Uses 4x supersampling for smooth edges.
"""
import os
import struct
import zlib

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")
SS = 4  # supersampling factor

# Brand colours
SHIELD_TOP = (47, 125, 79)     # #2f7d4f
SHIELD_BOT = (36, 109, 140)    # #246d8c
WHITE = (255, 255, 255)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def point_in_poly(x, y, poly):
    inside = False
    n = len(poly)
    j = n - 1
    for i in range(n):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside


def shield_poly():
    # Normalised shield outline (0..1).
    return [
        (0.15, 0.14), (0.85, 0.14),
        (0.85, 0.52), (0.72, 0.78),
        (0.50, 0.92), (0.28, 0.78),
        (0.15, 0.52),
    ]


def render(size):
    big = size * SS
    poly = shield_poly()
    cx, cy, r = 0.50, 0.46, 0.215
    ring_w = 0.052

    # Supersampled RGBA buffer, no filter bytes (plain row-major pixels).
    hi = bytearray(big * big * 4)
    for py in range(big):
        for px in range(big):
            nx = (px + 0.5) / big
            ny = (py + 0.5) / big
            rgb = (0, 0, 0)
            a = 0
            if point_in_poly(nx, ny, poly):
                a = 255
                rgb = lerp(SHIELD_TOP, SHIELD_BOT, ny)
                # "no entry" mark: ring + diagonal slash
                dx, dy = nx - cx, ny - cy
                dist = (dx * dx + dy * dy) ** 0.5
                on_ring = abs(dist - r) <= ring_w
                slash = abs(dx + dy) / (2 ** 0.5)
                on_slash = dist <= (r + ring_w) and slash <= ring_w
                if on_ring or on_slash:
                    rgb = WHITE
            base = (py * big + px) * 4
            hi[base] = rgb[0]
            hi[base + 1] = rgb[1]
            hi[base + 2] = rgb[2]
            hi[base + 3] = a

    # Downsample SSxSS blocks -> final size, prefixing each row with filter 0.
    out = bytearray()
    n = SS * SS
    for y in range(size):
        out.append(0)  # PNG filter type 0
        for x in range(size):
            ar = ag = ab = aa = 0
            for sy in range(SS):
                for sx in range(SS):
                    base = ((y * SS + sy) * big + (x * SS + sx)) * 4
                    ar += hi[base]
                    ag += hi[base + 1]
                    ab += hi[base + 2]
                    aa += hi[base + 3]
            out += bytes((ar // n, ag // n, ab // n, aa // n))
    return out


def write_png(path, size, raw):
    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data +
                struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw), 9)
    with open(path, "wb") as f:
        f.write(sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b""))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for size in (16, 32, 48, 128):
        raw = render(size)
        write_png(os.path.join(OUT_DIR, "icon%d.png" % size), size, raw)
        print("wrote icon%d.png" % size)


if __name__ == "__main__":
    main()
