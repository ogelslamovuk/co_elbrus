from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
img_dir = root / 'public' / 'images'

for path in sorted(img_dir.iterdir()):
    if path.suffix.lower() not in {'.jpg', '.jpeg', '.webp'}:
        continue
    before = path.stat().st_size
    im = ImageOps.exif_transpose(Image.open(path))
    if im.mode != 'RGB':
        im = im.convert('RGB')
    max_width = 1280 if path.suffix.lower() == '.webp' else 1600
    if im.width > max_width:
        ratio = max_width / im.width
        im = im.resize((max_width, round(im.height * ratio)), Image.Resampling.LANCZOS)
    tmp = path.with_suffix(path.suffix + '.new')
    if path.suffix.lower() == '.webp':
        quality = 54 if path.name == 'fiagdon-river-1280.webp' else 58
        im.save(tmp, 'WEBP', quality=quality, method=6)
    else:
        im.save(tmp, 'JPEG', quality=76, optimize=True, progressive=True)
    tmp.replace(path)
    after = path.stat().st_size
    print(f'{path.name}: {before} -> {after}')
