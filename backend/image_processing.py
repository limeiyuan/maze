from PIL import Image
import os

def process_images(files):
    resources = []
    for file in files:
        image = Image.open(file)  # 假设文件是图像
        # 这里可以添加合成、拆分等图像处理操作
        # 例如，将图像转化为精灵图
        output_file = os.path.join('output', os.path.basename(file))
        image.save(output_file)

        resources.append({
            'name': os.path.basename(file),
            'path': output_file
        })

    return resources
