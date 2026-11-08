import sys, re, json
from bs4 import BeautifulSoup

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

title = soup.title.string.strip() if soup.title and soup.title.string else ""
desc_tag = soup.find("meta", attrs={"name": "description"})
description = desc_tag["content"].strip() if desc_tag and desc_tag.get("content") else ""

out = []
out.append(f"# {title}")
out.append("")
if description:
    out.append(f"**Meta description:** {description}")
    out.append("")

# Remove script/style/noscript
for tag in soup(["script", "style", "noscript"]):
    tag.decompose()

# Find iframes anywhere (widgets/embeds)
iframes = soup.find_all("iframe")
if iframes:
    out.append("## Embeds / iframes found")
    for ifr in iframes:
        src = ifr.get("src", "")
        title_attr = ifr.get("title", "")
        out.append(f"- src=`{src}` title=`{title_attr}`")
    out.append("")

# Walk the body in document order, picking headings, paragraphs, list items, links, images
body = soup.body or soup

seen_texts = set()

def clean(t):
    return re.sub(r"\s+", " ", t).strip()

for el in body.find_all(["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "span", "a", "img", "button"]):
    name = el.name
    if name == "img":
        alt = el.get("alt", "")
        src = el.get("src", "")
        if alt and alt.strip():
            line = f"[image: {alt.strip()}] ({src[:80]})"
            key = ("img", line)
            if key not in seen_texts:
                out.append(line)
                seen_texts.add(key)
        continue
    text = clean(el.get_text(" ", strip=True))
    if not text or len(text) < 2:
        continue
    # skip if this text is fully contained in a text we've already emitted from a descendant/ancestor duplicate pass for span/a within p
    if name in ("span", "a") and el.find_parent(["p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "button"]):
        continue
    prefix = {
        "h1": "# ", "h2": "## ", "h3": "### ", "h4": "#### ", "h5": "##### ", "h6": "###### ",
        "li": "- ", "button": "[button] ", "a": "[link] ", "p": "", "span": "",
    }.get(name, "")
    key = (name, text)
    if key in seen_texts:
        continue
    seen_texts.add(key)
    out.append(f"{prefix}{text}")

print("\n".join(out))
