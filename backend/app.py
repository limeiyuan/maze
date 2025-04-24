import sys
import json
import os
import logging
from PIL import Image

# 配置日志记录器
logging.basicConfig(
    level=logging.DEBUG,  # 默认日志级别，可改为 INFO / WARNING / ERROR
    format='[%(levelname)s] %(message)s',
    stream=sys.stderr  # 所有日志输出到 stderr，确保 Electron 能接收到
)

def process_images(file_paths):
    logging.info("开始处理文件：%s", file_paths)
    result = []
    for path in file_paths:
        try:
            if not os.path.exists(path):
                logging.error("文件不存在：%s", path)
                continue
            name = os.path.basename(path)
            output_path = os.path.join("output", name)
            os.makedirs("output", exist_ok=True)
            logging.info("建立输出文件夹：%s", path)
            with Image.open(path) as img:
                logging.info("已打开文件：%s", path)
                img.save(output_path)
            result.append({"name": name, "path": output_path})
        except Exception as e:
            logging.exception("处理文件 %s 出错: ", path)
    logging.info("处理完成，返回结果：%s", result)
    return result

def main():
    input_data = sys.stdin.read()
    print("[Python] 接收到的文件路径数据：", input_data, file=sys.stderr)
    file_paths = json.loads(input_data)
    result = process_images(file_paths)
    sys.stdout.write(json.dumps(result))

if __name__ == '__main__':
    main()