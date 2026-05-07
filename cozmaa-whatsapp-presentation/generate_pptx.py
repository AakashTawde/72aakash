"""
Generate the Cozmaa WhatsApp Solution presentation as a .pptx file.

Usage:
    pip install python-pptx
    python3 generate_pptx.py

Output: cozmaa-whatsapp-solution.pptx (in the same directory)
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR


# ---------- Theme ----------
PRIMARY = RGBColor(0x0A, 0x7E, 0x8C)
PRIMARY_SOFT = RGBColor(0xE6, 0xF4, 0xF6)
SECONDARY = RGBColor(0x1B, 0x2D, 0x4F)
ACCENT = RGBColor(0xD4, 0xA8, 0x43)
BG = RGBColor(0xFF, 0xFF, 0xFF)
BG_SOFT = RGBColor(0xF7, 0xFA, 0xFB)
TEXT = RGBColor(0x2D, 0x34, 0x36)
MUTED = RGBColor(0x6B, 0x72, 0x80)
BORDER = RGBColor(0xE5, 0xE7, 0xEB)
SUCCESS = RGBColor(0x10, 0xB9, 0x81)
WARNING = RGBColor(0xF5, 0x9E, 0x0B)
WARNING_BG = RGBColor(0xFF, 0xFB, 0xEA)
DANGER = RGBColor(0xEF, 0x44, 0x44)
WHATSAPP_GREEN = RGBColor(0x25, 0xD3, 0x66)
WHATSAPP_DARK = RGBColor(0x07, 0x5E, 0x54)
DCFC = RGBColor(0xDC, 0xF8, 0xC6)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

FONT = "Calibri"


# ---------- Helpers ----------

def set_slide_bg(slide, color):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_rect(slide, left, top, width, height, fill=None, line=None,
             line_width=1.25, shape=MSO_SHAPE.ROUNDED_RECTANGLE, corner=0.05,
             shadow=False):
    s = slide.shapes.add_shape(shape, left, top, width, height)
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        # adjust corner radius
        try:
            s.adjustments[0] = corner
        except Exception:
            pass
    if fill is None:
        s.fill.background()
    else:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line
        s.line.width = Pt(line_width)
    if not shadow:
        # remove default shadow
        sp = s.shadow
        sp.inherit = False
    s.text_frame.text = ""
    s.text_frame.margin_left = Inches(0.15)
    s.text_frame.margin_right = Inches(0.15)
    s.text_frame.margin_top = Inches(0.1)
    s.text_frame.margin_bottom = Inches(0.1)
    return s


def add_text(slide, left, top, width, height, text,
             size=18, bold=False, color=TEXT, align="left", anchor="top",
             font=FONT, italic=False, line_spacing=1.15):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    if anchor == "middle":
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    elif anchor == "bottom":
        tf.vertical_anchor = MSO_ANCHOR.BOTTOM
    else:
        tf.vertical_anchor = MSO_ANCHOR.TOP
    lines = text.split("\n") if isinstance(text, str) else list(text)
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = {
            "left": PP_ALIGN.LEFT,
            "center": PP_ALIGN.CENTER,
            "right": PP_ALIGN.RIGHT,
        }[align]
        p.line_spacing = line_spacing
        run = p.add_run()
        run.text = line
        run.font.name = font
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.italic = italic
        run.font.color.rgb = color
    return tb


def add_runs(slide, left, top, width, height, runs,
             align="left", anchor="top", line_spacing=1.2, font=FONT):
    """runs = list of dicts {text, size, bold, color, italic} OR a list of such lists for multiple paragraphs."""
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    if anchor == "middle":
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    elif anchor == "bottom":
        tf.vertical_anchor = MSO_ANCHOR.BOTTOM

    if runs and isinstance(runs[0], dict):
        runs = [runs]

    for pi, paragraph_runs in enumerate(runs):
        p = tf.paragraphs[0] if pi == 0 else tf.add_paragraph()
        p.alignment = {
            "left": PP_ALIGN.LEFT,
            "center": PP_ALIGN.CENTER,
            "right": PP_ALIGN.RIGHT,
        }[align]
        p.line_spacing = line_spacing
        for r in paragraph_runs:
            run = p.add_run()
            run.text = r["text"]
            run.font.name = r.get("font", font)
            run.font.size = Pt(r.get("size", 18))
            run.font.bold = r.get("bold", False)
            run.font.italic = r.get("italic", False)
            color = r.get("color", TEXT)
            run.font.color.rgb = color
    return tb


def add_arrow(slide, left, top, width=Inches(0.5), height=Inches(0.4), color=ACCENT):
    s = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, left, top, width, height)
    s.fill.solid()
    s.fill.fore_color.rgb = color
    s.line.fill.background()
    return s


def slide_header(slide, number, eyebrow, title, eyebrow_color=PRIMARY):
    # Top accent bar
    bar = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.33), Inches(0.12)
    )
    bar.fill.solid()
    bar.fill.fore_color.rgb = eyebrow_color
    bar.line.fill.background()

    add_text(
        slide,
        Inches(0.6), Inches(0.35), Inches(12), Inches(0.4),
        eyebrow.upper(),
        size=14, bold=True, color=eyebrow_color,
    )
    add_text(
        slide,
        Inches(0.6), Inches(0.7), Inches(12), Inches(0.9),
        title,
        size=36, bold=True, color=SECONDARY,
    )
    # Footer
    add_text(
        slide,
        Inches(0.6), Inches(7.05), Inches(12.13), Inches(0.3),
        f"{number:02d} / 18  ·  Cozmaa WhatsApp Chat Solution",
        size=10, color=MUTED, align="right",
    )


def new_blank_slide(prs, bg=BG):
    layout = prs.slide_layouts[6]  # blank
    slide = prs.slides.add_slide(layout)
    set_slide_bg(slide, bg)
    return slide


# ---------- Slides ----------

def slide_01_title(prs):
    s = new_blank_slide(prs, bg=BG)

    # decorative chat bubbles
    for (x, y, sz) in [(0.8, 1.0, 0.6), (12.0, 1.5, 0.5), (1.5, 6.2, 0.55),
                       (11.5, 5.5, 0.6), (6.4, 0.6, 0.45)]:
        b = add_rect(
            s, Inches(x), Inches(y), Inches(sz), Inches(sz),
            fill=PRIMARY_SOFT, shape=MSO_SHAPE.OVAL
        )

    # Logo placeholder
    logo = add_rect(
        s, Inches(6.16), Inches(1.4), Inches(1.0), Inches(1.0),
        fill=PRIMARY, corner=0.25
    )
    add_text(
        s, Inches(6.16), Inches(1.4), Inches(1.0), Inches(1.0),
        "C", size=48, bold=True, color=WHITE, align="center", anchor="middle"
    )

    # Title
    add_runs(
        s, Inches(0.6), Inches(2.7), Inches(12.13), Inches(2.0),
        [
            [{"text": "WhatsApp Chat Solution", "size": 54, "bold": True, "color": SECONDARY}],
            [
                {"text": "for ", "size": 54, "bold": True, "color": SECONDARY},
                {"text": "Cozmaa.com", "size": 54, "bold": True, "color": PRIMARY},
            ],
        ],
        align="center",
    )

    # Subtitle
    add_text(
        s, Inches(0.6), Inches(4.9), Inches(12.13), Inches(0.6),
        "How customers will chat with us — directly from our website",
        size=22, color=MUTED, align="center",
    )

    # Tagline
    add_text(
        s, Inches(0.6), Inches(5.7), Inches(12.13), Inches(0.5),
        "A SIMPLE GUIDE  ·  NO TECHNICAL JARGON",
        size=12, bold=True, color=ACCENT, align="center",
    )


def slide_02_problem(prs):
    s = new_blank_slide(prs)
    slide_header(s, 2, "The Gap", "Our Current Problem")

    def card(left_in, color, emoji_text, title, steps, result_icon, result_text, result_color):
        card_top = Inches(2.0)
        card_w = Inches(5.7)
        card_h = Inches(4.4)
        rect = add_rect(s, Inches(left_in), card_top, card_w, card_h,
                        fill=BG_SOFT, line=color, line_width=2.25, corner=0.05)
        add_text(s, Inches(left_in + 0.25), Inches(2.15), Inches(2), Inches(0.7),
                 emoji_text, size=44)
        add_text(s, Inches(left_in + 0.25), Inches(2.85), Inches(5.2), Inches(0.5),
                 title, size=22, bold=True, color=SECONDARY)
        for i, step in enumerate(steps):
            add_runs(
                s, Inches(left_in + 0.3), Inches(3.45 + i * 0.55), Inches(5.2), Inches(0.55),
                [
                    {"text": f"{i+1}. ", "size": 16, "color": MUTED, "bold": True},
                    {"text": step, "size": 16, "color": TEXT},
                ],
            )
        add_text(s, Inches(left_in + 0.25), Inches(5.85), Inches(5.2), Inches(0.5),
                 f"{result_icon}  {result_text}",
                 size=18, bold=True, color=result_color)

    card(0.6, SUCCESS, "📱", "Mobile Visitor",
         ["Clicks chat button on cozmaa.com",
          "WhatsApp app opens instantly",
          "Starts chatting — done."],
         "✅", "Easy. We get the lead.", SUCCESS)
    card(7.0, DANGER, "💻", "Desktop Visitor",
         ["Clicks chat button on cozmaa.com",
          "Sees WhatsApp Web — needs phone & QR scan",
          "Most people give up here"],
         "❌", "We lose them before they reach us.", DANGER)

    add_text(s, Inches(0.6), Inches(6.55), Inches(12.13), Inches(0.45),
             "A big chunk of our website visitors are on desktops. They drop off before reaching us.",
             size=15, italic=True, color=MUTED, align="center")


def speech_bubble(s, left, top, width, height, text, border_color, point_left=True):
    rect = add_rect(s, left, top, width, height,
                    fill=WHITE, line=border_color, line_width=2.5, corner=0.08)
    add_text(s, left + Inches(0.3), top + Inches(0.2),
             width - Inches(0.6), height - Inches(0.4),
             text, size=20, color=TEXT, anchor="middle")
    # tail
    tail_w = Inches(0.3)
    tail_h = Inches(0.4)
    tail_top = top + Inches(0.7)
    if point_left:
        tail = s.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, left - tail_w, tail_top, tail_w, tail_h)
        tail.rotation = 270
    else:
        tail = s.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, left + width, tail_top, tail_w, tail_h)
        tail.rotation = 90
    tail.fill.solid()
    tail.fill.fore_color.rgb = border_color
    tail.line.fill.background()


def slide_03_customers(prs):
    s = new_blank_slide(prs)
    slide_header(s, 3, "The Customer's View", "What Customers Actually Want")

    add_text(s, Inches(0.6), Inches(2.2), Inches(4.5), Inches(3),
             "👩‍💻", size=200, align="center", anchor="middle")

    speech_bubble(
        s, Inches(5.6), Inches(2.6), Inches(7.2), Inches(2.0),
        "\"I just want to ask a quick question. Without downloading anything, scanning any QR codes, or filling forms.\"",
        PRIMARY, point_left=True,
    )

    add_text(s, Inches(0.6), Inches(5.8), Inches(12.13), Inches(0.6),
             "Customers want to chat instantly. Right there. On the website. No extra steps.",
             size=20, bold=True, color=SECONDARY, align="center")


def slide_04_we_want(prs):
    s = new_blank_slide(prs)
    slide_header(s, 4, "Our View", "What We Want (the Business Side)")

    speech_bubble(
        s, Inches(0.6), Inches(2.6), Inches(7.2), Inches(2.0),
        "\"I want to reply from my phone, like normal WhatsApp. Not learn a complicated software with menus and dashboards.\"",
        ACCENT, point_left=False,
    )

    add_text(s, Inches(8.3), Inches(2.2), Inches(4.5), Inches(3),
             "👨‍⚕️", size=200, align="center", anchor="middle")

    add_text(s, Inches(0.6), Inches(5.8), Inches(12.13), Inches(0.6),
             "We want simplicity. All customer chats in one place — managed easily, on our phone.",
             size=20, bold=True, color=SECONDARY, align="center")


def slide_05_overview(prs):
    s = new_blank_slide(prs)
    slide_header(s, 5, "The Solution", "How It Works — End to End")

    add_text(s, Inches(0.6), Inches(1.85), Inches(12.13), Inches(0.4),
             "Customer types on our website. We get it on our phone. We reply. Done.",
             size=15, italic=True, color=MUTED)

    nodes = [
        ("💻", "Customer's Laptop", "Visits cozmaa.com"),
        ("💬", "Chat Widget", "On our website"),
        ("☁️", "WhatsApp Cloud", "Meta's network"),
        ("📱", "Our Business App", "Notifies us"),
        ("👨‍⚕️", "We Reply", "From anywhere"),
    ]
    n = len(nodes)
    node_w = 2.0
    arrow_w = 0.45
    total_w = n * node_w + (n - 1) * arrow_w
    start_left = (13.33 - total_w) / 2
    top = 3.0

    for i, (icon, label, sub) in enumerate(nodes):
        left = start_left + i * (node_w + arrow_w)
        add_rect(s, Inches(left), Inches(top), Inches(node_w), Inches(2.4),
                 fill=BG_SOFT, line=PRIMARY, line_width=2, corner=0.1)
        add_text(s, Inches(left), Inches(top + 0.15), Inches(node_w), Inches(0.85),
                 icon, size=44, align="center")
        add_text(s, Inches(left + 0.1), Inches(top + 1.05), Inches(node_w - 0.2), Inches(0.7),
                 label, size=14, bold=True, color=SECONDARY, align="center")
        add_text(s, Inches(left + 0.1), Inches(top + 1.7), Inches(node_w - 0.2), Inches(0.6),
                 sub, size=11, color=MUTED, align="center")
        if i < n - 1:
            arrow_left = left + node_w + 0.05
            add_arrow(s, Inches(arrow_left), Inches(top + 1.05),
                      width=Inches(arrow_w - 0.05), height=Inches(0.3), color=ACCENT)

    add_text(s, Inches(0.6), Inches(6.0), Inches(12.13), Inches(0.5),
             "The customer never leaves our website. We never leave our phone.",
             size=18, bold=True, color=SECONDARY, align="center")


def slide_06_business_api(prs):
    s = new_blank_slide(prs)
    slide_header(s, 6, "Meet the Tech (Briefly)", "Meet WhatsApp Business API")

    # Big WhatsApp circle
    circle = add_rect(s, Inches(0.8), Inches(2.2), Inches(3.5), Inches(3.5),
                      fill=WHATSAPP_GREEN, shape=MSO_SHAPE.OVAL)
    add_text(s, Inches(0.8), Inches(2.2), Inches(3.5), Inches(3.5),
             "🟢", size=160, align="center", anchor="middle")

    # Description
    add_runs(
        s, Inches(4.8), Inches(2.0), Inches(8.0), Inches(1.4),
        [
            {"text": "It's the official, professional version of WhatsApp — made by ", "size": 17, "color": TEXT},
            {"text": "Meta (the same company that owns WhatsApp)", "size": 17, "color": TEXT, "bold": True},
            {"text": " — for businesses like ours.", "size": 17, "color": TEXT},
        ],
        line_spacing=1.4,
    )

    bullets = [
        ("✅", "100% official and legal"),
        ("✅", "Same WhatsApp experience for customers"),
        ("✅", "Built for businesses to handle many chats at once"),
    ]
    for i, (icon, text) in enumerate(bullets):
        top = 3.6 + i * 0.85
        add_rect(s, Inches(4.8), Inches(top), Inches(8.0), Inches(0.7),
                 fill=BG_SOFT, line=BORDER, line_width=1, corner=0.1)
        add_runs(
            s, Inches(5.0), Inches(top + 0.05), Inches(7.6), Inches(0.6),
            [
                {"text": f"{icon}   ", "size": 18},
                {"text": text, "size": 18, "color": SECONDARY, "bold": True},
            ],
            anchor="middle",
        )


def slide_07_reality_check(prs):
    s = new_blank_slide(prs, bg=WARNING_BG)
    slide_header(s, 7, "⚠️ Important — Read Carefully",
                 "One thing to understand before we go further")

    # Big warning callout
    add_rect(s, Inches(0.6), Inches(2.0), Inches(12.13), Inches(1.05),
             fill=WHITE, line=WARNING, line_width=2.5, corner=0.07)
    add_runs(
        s, Inches(0.9), Inches(2.05), Inches(11.5), Inches(1.0),
        [
            {"text": "We will ", "size": 22, "color": SECONDARY, "bold": True},
            {"text": "NOT", "size": 26, "color": DANGER, "bold": True},
            {"text": " use the green WhatsApp app you have on your phone right now.",
             "size": 22, "color": SECONDARY, "bold": True},
        ],
        anchor="middle",
    )

    # Two phone "screens"
    def phone(left_in, header_color, header_title, label, msgs):
        # frame
        add_rect(s, Inches(left_in), Inches(3.4), Inches(2.6), Inches(2.9),
                 fill=RGBColor(0x11, 0x11, 0x11), corner=0.13)
        # header
        add_rect(s, Inches(left_in + 0.1), Inches(3.5), Inches(2.4), Inches(0.5),
                 fill=header_color, corner=0.15)
        add_text(s, Inches(left_in + 0.2), Inches(3.55), Inches(2.2), Inches(0.4),
                 header_title, size=11, bold=True, color=WHITE, anchor="middle")
        # chat area
        add_rect(s, Inches(left_in + 0.1), Inches(4.0), Inches(2.4), Inches(2.2),
                 fill=RGBColor(0xEC, 0xE5, 0xDD), corner=0.0)
        for i, (side, text) in enumerate(msgs):
            top_in = 4.1 + i * 0.6
            if side == "in":
                add_rect(s, Inches(left_in + 0.2), Inches(top_in), Inches(1.7), Inches(0.5),
                         fill=WHITE, corner=0.2)
                add_text(s, Inches(left_in + 0.27), Inches(top_in + 0.05),
                         Inches(1.6), Inches(0.4),
                         text, size=8, color=TEXT, anchor="middle")
            else:
                add_rect(s, Inches(left_in + 0.7), Inches(top_in), Inches(1.7), Inches(0.5),
                         fill=DCFC, corner=0.2)
                add_text(s, Inches(left_in + 0.77), Inches(top_in + 0.05),
                         Inches(1.6), Inches(0.4),
                         text, size=8, color=TEXT, anchor="middle")
        add_text(s, Inches(left_in - 0.2), Inches(6.4), Inches(3.0), Inches(0.4),
                 label, size=13, bold=True, color=SECONDARY, align="center")

    phone(2.5, WHATSAPP_DARK, "Family Group", "1️⃣  Personal WhatsApp",
          [("in", "Beta, dinner kab?"), ("out", "8 baje pahunchunga")])

    # X mark
    add_text(s, Inches(5.5), Inches(4.4), Inches(2.3), Inches(1.5),
             "✕", size=72, bold=True, color=DANGER, align="center", anchor="middle")

    phone(8.2, PRIMARY, "Patient — Priya", "2️⃣  Business API (Cozmaa)",
          [("in", "Hair transplant info?"), ("out", "Sure, sharing now!")])

    add_text(s, Inches(0.6), Inches(6.85), Inches(12.13), Inches(0.4),
             "These two CANNOT mix. It's a Meta rule — not something we can change.",
             size=14, bold=True, color=SECONDARY, align="center")


def slide_08_where_to_reply(prs):
    s = new_blank_slide(prs)
    slide_header(s, 8, "So where will I reply from?",
                 "A separate app — but it FEELS like WhatsApp")

    # phone mockup on left
    left_in = 0.8
    add_rect(s, Inches(left_in), Inches(2.0), Inches(3.0), Inches(4.7),
             fill=RGBColor(0x11, 0x11, 0x11), corner=0.13)
    add_rect(s, Inches(left_in + 0.1), Inches(2.1), Inches(2.8), Inches(0.55),
             fill=PRIMARY, corner=0.12)
    add_text(s, Inches(left_in + 0.25), Inches(2.15), Inches(2.6), Inches(0.45),
             "Cozmaa Inbox", size=12, bold=True, color=WHITE, anchor="middle")
    add_rect(s, Inches(left_in + 0.1), Inches(2.65), Inches(2.8), Inches(3.95),
             fill=RGBColor(0xEC, 0xE5, 0xDD), corner=0.0)
    msgs = [
        ("in", "Hi, looking for hair transplant info"),
        ("out", "Hello! Sharing our packages now 🙂"),
        ("in", "Cost kitna hota hai approx?"),
        ("out", "Starting ₹65,000 — depends on grafts"),
    ]
    for i, (side, text) in enumerate(msgs):
        top_in = 2.8 + i * 0.85
        if side == "in":
            add_rect(s, Inches(left_in + 0.2), Inches(top_in), Inches(2.0), Inches(0.7),
                     fill=WHITE, corner=0.2)
            add_text(s, Inches(left_in + 0.3), Inches(top_in + 0.05),
                     Inches(1.8), Inches(0.6),
                     text, size=9, color=TEXT, anchor="middle")
        else:
            add_rect(s, Inches(left_in + 0.7), Inches(top_in), Inches(2.0), Inches(0.7),
                     fill=DCFC, corner=0.2)
            add_text(s, Inches(left_in + 0.8), Inches(top_in + 0.05),
                     Inches(1.8), Inches(0.6),
                     text, size=9, color=TEXT, anchor="middle")

    # Bullets on right
    rows = [
        ("📱", "Looks and works exactly like WhatsApp"),
        ("💬", "Same chat bubbles, same green vibe"),
        ("🔔", "Notifications come the same way"),
        ("🆕", "Only difference — a different app icon on your phone"),
    ]
    for i, (icon, text) in enumerate(rows):
        top = 2.3 + i * 0.65
        add_runs(
            s, Inches(4.5), Inches(top), Inches(8.3), Inches(0.6),
            [
                {"text": f"{icon}   ", "size": 22},
                {"text": text, "size": 18, "color": TEXT},
            ],
            anchor="middle",
        )

    # Analogy box
    add_rect(s, Inches(4.5), Inches(5.3), Inches(8.3), Inches(1.4),
             fill=PRIMARY_SOFT, line=PRIMARY, line_width=1.5, corner=0.08)
    add_runs(
        s, Inches(4.7), Inches(5.4), Inches(7.9), Inches(1.2),
        [
            [{"text": "Think of it like this: ", "size": 14, "bold": True, "color": SECONDARY},
             {"text": "Gmail and Outlook are both for emails.", "size": 14, "color": SECONDARY}],
            [{"text": "Different apps, same job. You'll get used to it in a day.",
              "size": 14, "color": SECONDARY}],
        ],
        anchor="middle",
    )


def slide_09_phone_number(prs):
    s = new_blank_slide(prs)
    slide_header(s, 9, "The Phone Number",
                 "What about my existing Cozmaa WhatsApp number?")

    def option(left_in, badge, badge_color, title, bullets, recommended):
        card_w = 6.0
        card_h = 4.0
        line_color = PRIMARY if recommended else BORDER
        line_w = 2.5 if recommended else 1
        add_rect(s, Inches(left_in), Inches(2.2), Inches(card_w), Inches(card_h),
                 fill=WHITE, line=line_color, line_width=line_w, corner=0.06)

        # Badge pill
        badge_w = 1.4
        add_rect(s, Inches(left_in + 0.3), Inches(2.4), Inches(badge_w), Inches(0.4),
                 fill=badge_color, corner=0.5)
        add_text(s, Inches(left_in + 0.3), Inches(2.4), Inches(badge_w), Inches(0.4),
                 badge, size=11, bold=True, color=WHITE, align="center", anchor="middle")

        if recommended:
            rec_w = 1.9
            add_rect(s, Inches(left_in + card_w - rec_w - 0.3), Inches(2.4),
                     Inches(rec_w), Inches(0.4),
                     fill=PRIMARY, corner=0.5)
            add_text(s, Inches(left_in + card_w - rec_w - 0.3), Inches(2.4),
                     Inches(rec_w), Inches(0.4),
                     "⭐ RECOMMENDED", size=10, bold=True,
                     color=WHITE, align="center", anchor="middle")

        add_text(s, Inches(left_in + 0.3), Inches(3.0),
                 Inches(card_w - 0.6), Inches(0.7),
                 title, size=18, bold=True, color=SECONDARY)

        for i, (icon, text, tone) in enumerate(bullets):
            top = 3.85 + i * 0.6
            color = DANGER if tone == "warn" else TEXT
            add_runs(
                s, Inches(left_in + 0.3), Inches(top),
                Inches(card_w - 0.6), Inches(0.55),
                [
                    {"text": f"{icon}  ", "size": 16},
                    {"text": text, "size": 14, "color": color},
                ],
                anchor="middle",
            )

    option(0.6, "OPTION A", PRIMARY,
           "Use a NEW number for Cozmaa Business",
           [("✅", "Your personal WhatsApp stays untouched", "good"),
            ("✅", "Clean separation — work and personal don't mix", "good"),
            ("✅", "No risk of losing existing chats", "good")],
           recommended=True)

    option(6.73, "OPTION B", MUTED,
           "Migrate your current Cozmaa number",
           [("⚠️", "Number can NEVER be used on regular WhatsApp again", "warn"),
            ("⚠️", "All old chats on that number will be lost", "warn"),
            ("✅", "Customers who already have it reach the right place", "good")],
           recommended=False)

    add_runs(
        s, Inches(0.6), Inches(6.5), Inches(12.13), Inches(0.5),
        [
            {"text": "Our suggestion: ", "size": 18, "bold": True, "color": SECONDARY},
            {"text": "Option A", "size": 18, "bold": True, "color": PRIMARY},
            {"text": " — get a new number specifically for the website.",
             "size": 18, "bold": True, "color": SECONDARY},
        ],
        align="center",
    )


def slide_10_bsps(prs):
    s = new_blank_slide(prs)
    slide_header(s, 10, "Who provides this?",
                 "We don't talk to Meta directly — we go through a BSP")

    add_runs(
        s, Inches(0.6), Inches(1.85), Inches(12.13), Inches(0.45),
        [
            {"text": "A ", "size": 16, "color": TEXT},
            {"text": "BSP (Business Solution Provider) ", "size": 16, "color": TEXT, "bold": True},
            {"text": "is an authorised middleman approved by Meta. They give us:",
             "size": 16, "color": TEXT},
        ],
    )

    items = [
        ("🌐", "The chat widget for our website"),
        ("📊", "A dashboard to see all customer chats"),
        ("📱", "The mobile app to reply on the go"),
        ("🛠️", "Technical setup and support"),
    ]
    n = len(items)
    card_w = 2.7
    gap = 0.25
    total_w = n * card_w + (n - 1) * gap
    start = (13.33 - total_w) / 2
    top = 2.6
    for i, (icon, label) in enumerate(items):
        left = start + i * (card_w + gap)
        add_rect(s, Inches(left), Inches(top), Inches(card_w), Inches(2.3),
                 fill=BG_SOFT, line=PRIMARY, line_width=2, corner=0.08)
        add_text(s, Inches(left), Inches(top + 0.25),
                 Inches(card_w), Inches(0.9),
                 icon, size=44, align="center")
        add_text(s, Inches(left + 0.15), Inches(top + 1.25),
                 Inches(card_w - 0.3), Inches(0.95),
                 label, size=14, bold=True, color=SECONDARY, align="center", anchor="middle")

    # Analogy box
    add_rect(s, Inches(0.6), Inches(5.7), Inches(12.13), Inches(1.05),
             fill=PRIMARY_SOFT, line=PRIMARY, line_width=1.5, corner=0.07)
    add_runs(
        s, Inches(0.9), Inches(5.78), Inches(11.5), Inches(0.95),
        [
            {"text": "Real-life analogy: ", "size": 16, "bold": True, "color": SECONDARY},
            {"text": "It's like an authorised car dealer. We don't buy directly from the manufacturer (Meta) — we go through a trusted dealer who handles everything.",
             "size": 16, "color": SECONDARY},
        ],
        align="center", anchor="middle",
    )


def slide_11_bsp_comparison(prs):
    s = new_blank_slide(prs)
    slide_header(s, 11, "Top 3 BSP Options", "Which provider should we pick?")

    add_text(s, Inches(0.6), Inches(1.85), Inches(12.13), Inches(0.4),
             "We've shortlisted three. Here's how they compare for a clinic our size.",
             size=14, italic=True, color=MUTED)

    # Table
    headers = ["Feature", "AiSensy ⭐", "Interakt", "Wati"]
    rows = [
        ["Starting price", "₹1,500/mo", "₹999/mo", "₹2,499/mo"],
        ["Free trial", "14 days", "Yes", "7 days"],
        ["Mobile app", "✅", "✅", "✅"],
        ["Indian company", "✅", "✅ (Jio)", "❌ Global"],
        ["Best for", "Small clinics", "Tightest budget", "Larger teams"],
    ]
    col_widths = [3.2, 3.0, 3.0, 3.0]  # inches
    table_left = (13.33 - sum(col_widths)) / 2
    header_h = 0.55
    row_h = 0.55
    table_top = 2.5

    # Header row
    cur_left = table_left
    for ci, h in enumerate(headers):
        is_highlight = "AiSensy" in h
        fill_color = PRIMARY if is_highlight else SECONDARY
        add_rect(s, Inches(cur_left), Inches(table_top),
                 Inches(col_widths[ci]), Inches(header_h),
                 fill=fill_color, corner=0.0, shape=MSO_SHAPE.RECTANGLE)
        add_text(s, Inches(cur_left), Inches(table_top),
                 Inches(col_widths[ci]), Inches(header_h),
                 h, size=14, bold=True, color=WHITE,
                 align="center" if ci > 0 else "left", anchor="middle")
        cur_left += col_widths[ci]

    # Rows
    for ri, row in enumerate(rows):
        row_top = table_top + header_h + ri * row_h
        cur_left = table_left
        zebra = BG_SOFT if ri % 2 == 0 else WHITE
        for ci, val in enumerate(row):
            highlight_col = (ci == 1)
            cell_fill = RGBColor(0xE6, 0xF4, 0xF6) if highlight_col else zebra
            add_rect(s, Inches(cur_left), Inches(row_top),
                     Inches(col_widths[ci]), Inches(row_h),
                     fill=cell_fill, line=BORDER, line_width=0.5,
                     shape=MSO_SHAPE.RECTANGLE, corner=0.0)
            font_bold = (ci == 0) or highlight_col
            color = SECONDARY if ci == 0 else TEXT
            add_text(s, Inches(cur_left + 0.15), Inches(row_top),
                     Inches(col_widths[ci] - 0.3), Inches(row_h),
                     val, size=13, bold=font_bold, color=color,
                     align="center" if ci > 0 else "left", anchor="middle")
            cur_left += col_widths[ci]

    add_runs(
        s, Inches(0.6), Inches(6.55), Inches(12.13), Inches(0.4),
        [
            {"text": "⭐ Our pick: ", "size": 16, "bold": True, "color": SECONDARY},
            {"text": "AiSensy", "size": 16, "bold": True, "color": PRIMARY},
            {"text": " — best balance of price, support and features for Cozmaa.",
             "size": 16, "bold": True, "color": SECONDARY},
        ],
        align="center",
    )


def slide_12_costs(prs):
    s = new_blank_slide(prs)
    slide_header(s, 12, "Real Numbers", "What it'll actually cost per month")

    rows = [
        ("Platform fee (AiSensy plan)", "₹1,500 / month", False),
        ("Messages from customers to us (within 24 hrs)", "FREE", True),
        ("Our replies to customers (within 24 hrs)", "FREE", True),
        ("Promotional messages we send (optional)", "₹0.86 / msg", False),
        ("Appointment reminders we send", "₹0.12 / msg", False),
    ]
    for i, (label, amount, free) in enumerate(rows):
        top = 2.05 + i * 0.6
        add_rect(s, Inches(0.6), Inches(top), Inches(12.13), Inches(0.5),
                 fill=WHITE, line=BORDER, line_width=0.75, corner=0.08)
        add_text(s, Inches(0.85), Inches(top), Inches(8.5), Inches(0.5),
                 label, size=15, color=TEXT, anchor="middle")
        amount_color = SUCCESS if free else SECONDARY
        add_text(s, Inches(9.2), Inches(top), Inches(3.4), Inches(0.5),
                 amount, size=17, bold=True, color=amount_color,
                 align="right", anchor="middle")

    # Bottom-line callout
    add_rect(s, Inches(0.6), Inches(5.4), Inches(12.13), Inches(1.2),
             fill=PRIMARY, corner=0.08)
    add_text(s, Inches(0.6), Inches(5.45), Inches(12.13), Inches(0.35),
             "BOTTOM LINE", size=12, bold=True, color=WHITE, align="center")
    add_text(s, Inches(0.6), Inches(5.75), Inches(12.13), Inches(0.7),
             "₹1,500 – ₹2,500 / month for normal clinic usage",
             size=28, bold=True, color=WHITE, align="center", anchor="middle")

    add_text(s, Inches(0.6), Inches(6.7), Inches(12.13), Inches(0.35),
             "Less than the cost of one new patient per month.",
             size=13, italic=True, color=MUTED, align="center")


def slide_13_conversation_flow(prs):
    s = new_blank_slide(prs)
    slide_header(s, 13, "A Real Example", "How a real conversation will flow")

    steps = [
        (1, "Priya opens cozmaa.com", "💻", "On her laptop at home"),
        (2, "Clicks chat icon", "👆💬", "Bottom-right corner"),
        (3, "Types her question", "💬", "\"Hi, hair transplant info?\""),
        (4, "We get a notification", "📱🔔", "On the new business app"),
        (5, "We reply — instantly", "↩️", "\"Hello Priya! Yes, packages…\""),
    ]
    n = len(steps)
    card_w = 2.3
    gap = 0.25
    total_w = n * card_w + (n - 1) * gap
    start = (13.33 - total_w) / 2
    top = 2.0
    for i, (num, title, icon, sub) in enumerate(steps):
        left = start + i * (card_w + gap)
        add_rect(s, Inches(left), Inches(top), Inches(card_w), Inches(2.6),
                 fill=WHITE, line=BORDER, line_width=1, corner=0.08)
        # number badge
        add_rect(s, Inches(left + 0.2), Inches(top + 0.2),
                 Inches(0.55), Inches(0.55),
                 fill=PRIMARY, shape=MSO_SHAPE.OVAL)
        add_text(s, Inches(left + 0.2), Inches(top + 0.2),
                 Inches(0.55), Inches(0.55),
                 str(num), size=16, bold=True, color=WHITE,
                 align="center", anchor="middle")
        add_text(s, Inches(left + 0.85), Inches(top + 0.25),
                 Inches(card_w - 1.0), Inches(0.5),
                 title, size=12, bold=True, color=SECONDARY, anchor="middle")
        add_text(s, Inches(left), Inches(top + 0.95),
                 Inches(card_w), Inches(0.9),
                 icon, size=36, align="center", anchor="middle")
        add_text(s, Inches(left + 0.15), Inches(top + 1.95),
                 Inches(card_w - 0.3), Inches(0.55),
                 sub, size=11, color=MUTED, align="center", anchor="middle", italic=True)

    # Mini phone preview
    pleft = 5.5
    add_rect(s, Inches(pleft), Inches(5.0), Inches(2.4), Inches(1.7),
             fill=RGBColor(0x11, 0x11, 0x11), corner=0.13)
    add_rect(s, Inches(pleft + 0.1), Inches(5.1), Inches(2.2), Inches(0.4),
             fill=PRIMARY, corner=0.15)
    add_text(s, Inches(pleft + 0.15), Inches(5.1), Inches(2.1), Inches(0.4),
             "Priya — Patient", size=10, bold=True, color=WHITE, anchor="middle")
    add_rect(s, Inches(pleft + 0.1), Inches(5.5), Inches(2.2), Inches(1.1),
             fill=RGBColor(0xEC, 0xE5, 0xDD), corner=0.0)
    add_rect(s, Inches(pleft + 0.2), Inches(5.6), Inches(1.5), Inches(0.4),
             fill=WHITE, corner=0.25)
    add_text(s, Inches(pleft + 0.25), Inches(5.6), Inches(1.4), Inches(0.4),
             "Hair transplant info?", size=8, color=TEXT, anchor="middle")
    add_rect(s, Inches(pleft + 0.7), Inches(6.05), Inches(1.5), Inches(0.4),
             fill=DCFC, corner=0.25)
    add_text(s, Inches(pleft + 0.75), Inches(6.05), Inches(1.4), Inches(0.4),
             "Hello Priya! Sure 🌟", size=8, color=TEXT, anchor="middle")

    add_text(s, Inches(0.6), Inches(6.85), Inches(12.13), Inches(0.4),
             "Just like WhatsApp — but the customer never leaves our website.",
             size=14, bold=True, color=SECONDARY, align="center")


def slide_14_benefits(prs):
    s = new_blank_slide(prs)
    slide_header(s, 14, "What's in it for us", "Benefits — for Cozmaa")

    benefits = [
        ("🎯", "Capture desktop visitors who currently drop off"),
        ("💬", "One inbox for all customer chats — no missed messages"),
        ("📞", "Customer's name and phone number captured automatically"),
        ("🕐", "Reply from anywhere — phone, laptop, tablet"),
        ("👥", "Multiple staff can reply (receptionist + doctor + manager)"),
        ("📊", "Chat history of every patient — useful for follow-ups"),
    ]
    cols = 3
    card_w = 4.0
    card_h = 1.7
    gap_x = 0.13
    gap_y = 0.25
    start_left = (13.33 - cols * card_w - (cols - 1) * gap_x) / 2
    start_top = 2.1
    for i, (icon, text) in enumerate(benefits):
        col = i % cols
        row = i // cols
        left = start_left + col * (card_w + gap_x)
        top = start_top + row * (card_h + gap_y)
        add_rect(s, Inches(left), Inches(top), Inches(card_w), Inches(card_h),
                 fill=WHITE, line=BORDER, line_width=1, corner=0.07)
        # icon tile
        add_rect(s, Inches(left + 0.2), Inches(top + 0.3),
                 Inches(1.0), Inches(1.0),
                 fill=PRIMARY_SOFT, corner=0.15)
        add_text(s, Inches(left + 0.2), Inches(top + 0.3),
                 Inches(1.0), Inches(1.0),
                 icon, size=32, align="center", anchor="middle")
        add_text(s, Inches(left + 1.35), Inches(top + 0.2),
                 Inches(card_w - 1.5), Inches(card_h - 0.4),
                 text, size=14, bold=True, color=SECONDARY, anchor="middle")


def slide_15_setup(prs):
    s = new_blank_slide(prs)
    slide_header(s, 15, "Setup", "What's the setup process?")

    stages = [
        ("DAY 1", "Sign up", "Register on AiSensy and decide on the phone number"),
        ("DAY 2", "Verify Business", "Facebook Business Manager paperwork"),
        ("DAY 3", "Get number approved", "WhatsApp Business number approved by Meta"),
        ("DAY 4", "Install widget", "Add chat widget on cozmaa.com"),
        ("DAY 5", "Train + Go live", "Train staff on the new app and switch on"),
    ]
    n = len(stages)
    card_w = 2.2
    arrow_w = 0.3
    total = n * card_w + (n - 1) * arrow_w
    start = (13.33 - total) / 2
    top = 2.7
    for i, (day, title, sub) in enumerate(stages):
        left = start + i * (card_w + arrow_w)
        add_rect(s, Inches(left), Inches(top), Inches(card_w), Inches(2.6),
                 fill=WHITE, line=PRIMARY, line_width=2, corner=0.08)
        # day pill
        add_rect(s, Inches(left + 0.4), Inches(top + 0.25),
                 Inches(card_w - 0.8), Inches(0.4),
                 fill=PRIMARY, corner=0.5)
        add_text(s, Inches(left + 0.4), Inches(top + 0.25),
                 Inches(card_w - 0.8), Inches(0.4),
                 day, size=12, bold=True, color=WHITE,
                 align="center", anchor="middle")
        add_text(s, Inches(left + 0.15), Inches(top + 0.85),
                 Inches(card_w - 0.3), Inches(0.6),
                 title, size=15, bold=True, color=SECONDARY, align="center")
        add_text(s, Inches(left + 0.2), Inches(top + 1.55),
                 Inches(card_w - 0.4), Inches(1.0),
                 sub, size=11, color=MUTED, align="center")
        if i < n - 1:
            arrow_left = left + card_w + 0.02
            add_arrow(s, Inches(arrow_left), Inches(top + 1.15),
                      width=Inches(arrow_w - 0.04), height=Inches(0.3))

    add_runs(
        s, Inches(0.6), Inches(6.4), Inches(12.13), Inches(0.5),
        [
            {"text": "Roughly ", "size": 18, "bold": True, "color": SECONDARY},
            {"text": "5–7 working days", "size": 18, "bold": True, "color": PRIMARY},
            {"text": " from start to live.", "size": 18, "bold": True, "color": SECONDARY},
        ],
        align="center",
    )


def slide_16_keep_in_mind(prs):
    s = new_blank_slide(prs, bg=WARNING_BG)
    slide_header(s, 16, "Honest Heads-Up", "Things to keep in mind",
                 eyebrow_color=WARNING)

    items = [
        "The new business app is separate — needs a small mindset shift in the first week.",
        "For sending promotional messages, Meta needs to approve the message templates first (1–2 days).",
        "If we want to send marketing offers, those cost ~₹0.86 per message.",
        "We need to reply within 24 hours — otherwise sending free messages costs extra.",
        "Internet must be working for the app to receive messages (just like normal WhatsApp).",
    ]
    for i, text in enumerate(items):
        top = 2.0 + i * 0.75
        add_rect(s, Inches(0.6), Inches(top), Inches(12.13), Inches(0.65),
                 fill=WHITE, line=WARNING, line_width=1.25, corner=0.06)
        add_text(s, Inches(0.85), Inches(top), Inches(0.6), Inches(0.65),
                 "⚠️", size=22, anchor="middle")
        add_text(s, Inches(1.55), Inches(top), Inches(11.0), Inches(0.65),
                 text, size=14, color=TEXT, anchor="middle")

    add_text(s, Inches(0.6), Inches(6.7), Inches(12.13), Inches(0.4),
             "None of these are deal-breakers — but you should know them upfront.",
             size=13, italic=True, color=MUTED, align="center")


def slide_17_recommendation(prs):
    s = new_blank_slide(prs)
    slide_header(s, 17, "The Decision", "My Recommendation")

    # Big gradient-ish recommendation panel (solid color in pptx)
    add_rect(s, Inches(0.6), Inches(1.95), Inches(12.13), Inches(2.3),
             fill=SECONDARY, corner=0.06)
    # Inner accent strip
    add_rect(s, Inches(0.6), Inches(1.95), Inches(0.18), Inches(2.3),
             fill=PRIMARY, corner=0.0, shape=MSO_SHAPE.RECTANGLE)

    add_text(s, Inches(1.0), Inches(2.1), Inches(11), Inches(0.4),
             "GO WITH", size=13, bold=True, color=RGBColor(0xCB, 0xD5, 0xE1))

    col_w = 3.7
    cols_left = [1.0, 4.85, 8.7]

    items = [
        ("Provider", "AiSensy", "₹1,500/month plan"),
        ("Phone Number", "New dedicated number", "Just for Cozmaa Business"),
        ("Start with", "14-day free trial", "Test before paying"),
    ]
    for (label, big, sub), x in zip(items, cols_left):
        add_text(s, Inches(x), Inches(2.55), Inches(col_w), Inches(0.3),
                 label.upper(), size=10, bold=True,
                 color=RGBColor(0x9C, 0xA3, 0xAF))
        add_text(s, Inches(x), Inches(2.85), Inches(col_w), Inches(0.6),
                 big, size=22, bold=True, color=WHITE)
        add_text(s, Inches(x), Inches(3.5), Inches(col_w), Inches(0.5),
                 sub, size=13, color=RGBColor(0xE5, 0xE7, 0xEB))

    # Reasons
    add_text(s, Inches(0.6), Inches(4.55), Inches(12.13), Inches(0.4),
             "WHY THIS COMBINATION", size=13, bold=True, color=SECONDARY)
    reasons = [
        "Best price-to-feature ratio for a clinic our size",
        "Free Green Tick verification — looks professional to customers",
        "Indian company with Indian customer support",
    ]
    for i, r in enumerate(reasons):
        top = 5.1 + i * 0.55
        add_runs(
            s, Inches(0.6), Inches(top), Inches(12), Inches(0.5),
            [
                {"text": "✅  ", "size": 18, "bold": True, "color": SUCCESS},
                {"text": r, "size": 16, "color": TEXT},
            ],
            anchor="middle",
        )


def slide_18_next_steps(prs):
    s = new_blank_slide(prs)
    slide_header(s, 18, "Decision Time", "What we need from you to start")

    items = [
        "Approval on the AiSensy plan (₹1,500/month)",
        "Decision: New number or migrate existing one?",
        "Cozmaa logo + brand colours (already on the website)",
        "Sample replies for common patient questions",
        "List of staff members who'll handle chats",
    ]
    for i, text in enumerate(items):
        top = 2.0 + i * 0.6
        add_rect(s, Inches(0.6), Inches(top), Inches(12.13), Inches(0.5),
                 fill=WHITE, line=BORDER, line_width=0.75, corner=0.07)
        # checkbox
        add_rect(s, Inches(0.85), Inches(top + 0.1), Inches(0.3), Inches(0.3),
                 fill=WHITE, line=PRIMARY, line_width=2,
                 shape=MSO_SHAPE.RECTANGLE, corner=0.0)
        add_text(s, Inches(1.3), Inches(top), Inches(11), Inches(0.5),
                 text, size=15, color=TEXT, anchor="middle")

    # CTA box
    add_rect(s, Inches(0.6), Inches(5.3), Inches(12.13), Inches(1.0),
             fill=PRIMARY, corner=0.08)
    add_text(s, Inches(0.6), Inches(5.3), Inches(12.13), Inches(1.0),
             "Once approved — we go live in under a week. 🚀",
             size=22, bold=True, color=WHITE, align="center", anchor="middle")

    add_runs(
        s, Inches(0.6), Inches(6.5), Inches(12.13), Inches(0.4),
        [
            {"text": "Questions?  ", "size": 14, "color": MUTED},
            {"text": "Aakash Tawde", "size": 14, "bold": True, "color": SECONDARY},
            {"text": "  ·  📞 [your number]  ·  ✉️ [your email]",
             "size": 14, "color": MUTED},
        ],
        align="center",
    )


# ---------- Build ----------

def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    builders = [
        slide_01_title,
        slide_02_problem,
        slide_03_customers,
        slide_04_we_want,
        slide_05_overview,
        slide_06_business_api,
        slide_07_reality_check,
        slide_08_where_to_reply,
        slide_09_phone_number,
        slide_10_bsps,
        slide_11_bsp_comparison,
        slide_12_costs,
        slide_13_conversation_flow,
        slide_14_benefits,
        slide_15_setup,
        slide_16_keep_in_mind,
        slide_17_recommendation,
        slide_18_next_steps,
    ]
    for b in builders:
        b(prs)

    out = "cozmaa-whatsapp-solution.pptx"
    prs.save(out)
    print(f"Wrote {out} ({len(prs.slides)} slides)")


if __name__ == "__main__":
    build()
