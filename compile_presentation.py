import os
import base64
import glob
import math
from PIL import Image, ImageChops, ImageDraw

def find_base_image():
    brain_dir = r"C:\Users\Aby Johny\.gemini\antigravity-ide\brain\918cd2b0-c000-4a8e-bf12-3d6c3035469e"
    pattern = os.path.join(brain_dir, "jesus_wine_base_*.png")
    files = glob.glob(pattern)
    if files:
        files.sort()
        return files[-1]
    return None

def create_optimized_gif(base_path, output_path):
    print(f"Generating optimized GIF from: {base_path}")
    base_img = Image.open(base_path).convert("RGB")
    
    # Resize to 600x600 for optimal Base64 size
    target_size = 600
    base_img = base_img.resize((target_size, target_size), Image.Resampling.LANCZOS)
    W, H = base_img.size
    
    num_frames = 24
    frames = []
    
    band_width = int((W + H) * 0.15)
    total_dist = W + H + 2 * band_width
    
    for f in range(num_frames):
        progress = f / num_frames
        center = -band_width + progress * total_dist
        
        grad_size = W + H
        grad_img = Image.new('L', (grad_size, 1), 0)
        draw = ImageDraw.Draw(grad_img)
        
        for x in range(grad_size):
            dist_to_center = abs(x - center)
            if dist_to_center < band_width:
                factor = math.cos((math.pi / 2.0) * (dist_to_center / band_width)) ** 2
                val = int(200 * factor)
                draw.point((x, 0), fill=val)
        
        grad_2d = grad_img.resize((grad_size, grad_size))
        rotated_grad = grad_2d.rotate(45, resample=Image.Resampling.BILINEAR)
        
        left = (grad_size - W) // 2
        top = (grad_size - H) // 2
        shimmer_mask = rotated_grad.crop((left, top, left + W, top + H))
        
        r_channel = shimmer_mask
        g_channel = Image.eval(shimmer_mask, lambda x: int(x * 0.85))
        b_channel = Image.eval(shimmer_mask, lambda x: int(x * 0.40))
        highlight = Image.merge('RGB', [r_channel, g_channel, b_channel])
        
        frame = ImageChops.screen(base_img, highlight)
        
        # Convert frame to palette mode with reduced colors (128 colors) to optimize size
        # quantization helps keep file size very small (approx 1.5MB to 2.5MB)
        frame_pal = frame.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)
        frames.append(frame_pal)
        
    print(f"Saving optimized GIF to: {output_path}...")
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=80,
        loop=0,
        optimize=True
    )
    print("Optimized GIF saved!")

def compress_image(src_path, dst_path, size):
    print(f"Compressing {src_path} to {dst_path} (Size: {size}x{size})...")
    img = Image.open(src_path)
    # Convert to RGB if it has alpha channel (since JPEG doesn't support transparency)
    # We will use white background for transparent images
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        alpha = img.convert('RGBA').split()[-1]
        bg = Image.new("RGBA", img.size, (74, 10, 24, 255)) # use burgundy background color
        bg.paste(img, mask=img.convert('RGBA'))
        img = bg.convert('RGB')
    else:
        img = img.convert('RGB')
        
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    img.save(dst_path, "JPEG", quality=85, optimize=True)
    print("Image compressed!")

def get_base64_uri(file_path, mime_type):
    with open(file_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    return f"data:{mime_type};base64,{encoded_string}"

def compile_all():
    workspace = r"d:\communion-exhibition"
    
    # 1. Optimize assets
    base_img_path = find_base_image()
    if not base_img_path:
        print("Error: Base Communion image not found!")
        return
        
    gif_small_path = os.path.join(workspace, "jesus_wine_small.gif")
    create_optimized_gif(base_img_path, gif_small_path)
    
    st_patrick_small = os.path.join(workspace, "st_patrick_small.jpg")
    compress_image(os.path.join(workspace, "st_patrick.png"), st_patrick_small, 600)
    
    shamrock_small = os.path.join(workspace, "shamrock_icon_small.jpg")
    compress_image(os.path.join(workspace, "shamrock_icon.png"), shamrock_small, 200)
    
    staff_small = os.path.join(workspace, "staff_icon_small.jpg")
    compress_image(os.path.join(workspace, "staff_icon.png"), staff_small, 200)
    
    mitre_small = os.path.join(workspace, "mitre_icon_small.jpg")
    compress_image(os.path.join(workspace, "mitre_icon.png"), mitre_small, 200)
    
    # St. Brigid assets
    st_brigid_small = os.path.join(workspace, "st_brigid_small.jpg")
    compress_image(os.path.join(workspace, "st_brigid.png"), st_brigid_small, 600)
    
    brigid_cross_small = os.path.join(workspace, "brigid_cross_icon_small.jpg")
    compress_image(os.path.join(workspace, "brigid_cross_icon.png"), brigid_cross_small, 200)
    
    brigid_staff_small = os.path.join(workspace, "brigid_staff_icon_small.jpg")
    compress_image(os.path.join(workspace, "brigid_staff_icon.png"), brigid_staff_small, 200)
    
    brigid_flame_small = os.path.join(workspace, "brigid_flame_icon_small.jpg")
    compress_image(os.path.join(workspace, "brigid_flame_icon.png"), brigid_flame_small, 200)
    
    # 2. Encode to Base64
    print("Encoding assets to Base64...")
    gif_b64 = get_base64_uri(gif_small_path, "image/gif")
    st_patrick_b64 = get_base64_uri(st_patrick_small, "image/jpeg")
    shamrock_b64 = get_base64_uri(shamrock_small, "image/jpeg")
    staff_b64 = get_base64_uri(staff_small, "image/jpeg")
    mitre_b64 = get_base64_uri(mitre_small, "image/jpeg")
    
    st_brigid_b64 = get_base64_uri(st_brigid_small, "image/jpeg")
    brigid_cross_b64 = get_base64_uri(brigid_cross_small, "image/jpeg")
    brigid_staff_b64 = get_base64_uri(brigid_staff_small, "image/jpeg")
    brigid_flame_b64 = get_base64_uri(brigid_flame_small, "image/jpeg")
    
    # 3. Read CSS and JS files
    css_path = os.path.join(workspace, "index.css")
    js_path = os.path.join(workspace, "index.js")
    
    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()
        
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()
        
    # Modify JS content to support YouTube iframe play/pause
    js_modified = js_content.replace(
        "const video = document.getElementById('zacchaeus-video');",
        "const video = document.getElementById('zacchaeus-video');"
    ).replace(
        "video.pause();",
        "if (video.tagName === 'IFRAME') { video.contentWindow.postMessage('{\"event\":\"command\",\"func\":\"pauseVideo\",\"args\":\"\"}', '*'); } else { video.pause(); }"
    ).replace(
        "video.currentTime = 0;\n            video.play().catch(e => console.log(\"Auto-play blocked by browser. User interaction required.\"));",
        "if (video.tagName === 'IFRAME') { video.contentWindow.postMessage('{\"event\":\"command\",\"func\":\"playVideo\",\"args\":\"\"}', '*'); } else { video.currentTime = 0; video.play().catch(e => {}); }"
    )

    # 4. Compile index.html
    html_template_path = os.path.join(workspace, "index_src.html")
    with open(html_template_path, "r", encoding="utf-8") as f:
        html_content = f.read()
        
    # Replace stylesheets and scripts with inlined tags
    html_compiled = html_content.replace(
        '<link rel="stylesheet" href="index.css">',
        f'<style>\n{css_content}\n</style>'
    ).replace(
        '<script src="index.js"></script>',
        f'<script>\n{js_modified}\n</script>'
    )
    
    # Replace images with Base64 inlined strings
    html_compiled = html_compiled.replace(
        'src="jesus_wine.gif"',
        f'src="{gif_b64}"'
    ).replace(
        'src="st_patrick.png"',
        f'src="{st_patrick_b64}"'
    ).replace(
        'src="shamrock_icon.png"',
        f'src="{shamrock_b64}"'
    ).replace(
        'src="staff_icon.png"',
        f'src="{staff_b64}"'
    ).replace(
        'src="mitre_icon.png"',
        f'src="{mitre_b64}"'
    ).replace(
        'src="st_brigid.png"',
        f'src="{st_brigid_b64}"'
    ).replace(
        'src="brigid_cross_icon.png"',
        f'src="{brigid_cross_b64}"'
    ).replace(
        'src="brigid_staff_icon.png"',
        f'src="{brigid_staff_b64}"'
    ).replace(
        'src="brigid_flame_icon.png"',
        f'src="{brigid_flame_b64}"'
    )
    
    # Replace Video element with YouTube embed iframe (adding enablejsapi=1 for JS controls)
    # The original was:
    # <video id="zacchaeus-video" controls poster="st_patrick.png">
    #     <source src="zacchaeus.mp4" type="video/mp4">
    #     Your browser does not support the video tag.
    # </video>
    video_old = """                    <video id="zacchaeus-video" controls poster="st_patrick.png">
                        <source src="zacchaeus.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>"""
    
    video_new = """                    <iframe id="zacchaeus-video" src="https://www.youtube.com/embed/5BjtbJFz2ug?enablejsapi=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>"""
    
    if video_old in html_compiled:
        html_compiled = html_compiled.replace(video_old, video_new)
    else:
        # Fallback regex-free replacement for robustness
        import re
        html_compiled = re.sub(r'<video id="zacchaeus-video".*?</video>', video_new, html_compiled, flags=re.DOTALL)

    # 5. Save Compiled Presentation
    output_html_path = os.path.join(workspace, "index.html")
    with open(output_html_path, "w", encoding="utf-8") as f:
        f.write(html_compiled)
        
    # Clean up temporary small files to keep workspace clean
    for f in [gif_small_path, st_patrick_small, shamrock_small, staff_small, mitre_small, 
              st_brigid_small, brigid_cross_small, brigid_staff_small, brigid_flame_small]:
        if os.path.exists(f):
            os.remove(f)
            
    print(f"\nSUCCESS: Standalone presentation compiled to: {output_html_path}")
    print(f"File size: {os.path.getsize(output_html_path) / 1024 / 1024:.2f} MB")

if __name__ == '__main__':
    compile_all()
