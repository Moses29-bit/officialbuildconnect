from pathlib import Path

p = Path("intro-preview.html")
text = p.read_text(encoding="utf-8")
start = text.find('<div id="boot"')
end = text.find('<button id="snd"')
if start < 0 or end < 0 or end < start:
    raise SystemExit(f"markers missing {start} {end}")
frag = Path("_intro_fragment.html").read_text(encoding="utf-8")
p.write_text(text[:start] + frag + text[end:], encoding="utf-8")
print("spliced", start, end)
