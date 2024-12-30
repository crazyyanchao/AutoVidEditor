import json
import re
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import List, Tuple

import pandas as pd
from docx import Document
from langchain.chains.llm import LLMChain
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, PromptTemplate, \
    HumanMessagePromptTemplate
from pandas import DataFrame
from pydantic import BaseModel, Field

from src.llm.deepseek import DeepSeekLLM

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

SYSTEM_TEMPLATE = f"""你是一名新闻速记助手，请将速记内容进行仔细整理，并按照指定的格式输出。
速记内容一般会使用指定格式给出，例如`<速记>...内容...</速记>`。

输出格式为JSON：字典对象放在列表中，每个元素是一个字典对象，字典对象包含`index`、`start_time`、`end_time`、`speaker`、`content`字段）。
`index`的值应该是递增的。
`start_time`和`end_time`时间的格式应该为`00:00:00`，如果缺少开头`0`则补充`0`。
`speaker`表示讲话人，应该是角色名称、人物名称等。
`content`表示说话人内容。
"""

HUMAN_TEMPLATE = """<速记>
{text}
</速记>

Let’s think step by step!"""

PROMPT = ChatPromptTemplate.from_messages(
    [
        SystemMessagePromptTemplate(
            prompt=PromptTemplate(input_variables=[], template=SYSTEM_TEMPLATE)),
        HumanMessagePromptTemplate(
            prompt=PromptTemplate(input_variables=["text"], template=HUMAN_TEMPLATE)
        )
    ]
)


class NoteFormat(BaseModel):
    index: int = Field(description="序号")
    start_time: str = Field(description="开始时间")
    end_time: str = Field(description="结束时间")
    speaker: str = Field(description="说话人")
    content: str = Field(description="内容")


class NoteOrganizer:
    """整理速记（将速记整理为<序号、开始时间、结束时间、说话人、说话内容>）"""

    def __init__(self, note_path: str):
        # docx结尾的文件
        self.note_path = note_path

    def run(self) -> List[NoteFormat]:
        data = []
        text = self.read()
        segmented_text = self.segment_text_by_keyword(text, "主持人 ", 3000)

        params = []
        for idx, segment in enumerate(segmented_text, 1):
            params.append({"index": idx, "text": f"段落 {idx}\n{segment}\n\n"})

        # 使用ThreadPoolExecutor进行并发调用pack_format函数，整理数据
        with ThreadPoolExecutor() as executor:
            # 异步并行处理每个段落
            results = list(executor.map(lambda p: self.pack_format(p['index'], p['text']), params))
        # 按照index升序排序results（段落）
        results = sorted(results, key=lambda x: x[0])
        idx = 0
        for index, formats in results:
            for format_item in formats:
                idx += 1
                format_item.index = idx  # NoteFormat有一个index属性
            data.extend(formats)
        data = sorted(data, key=lambda x: x.index)
        return data

    def pack_format(self, index, text) -> Tuple[int, List[NoteFormat]]:
        logger.info("NoteOrganizer...")
        chain: LLMChain = PROMPT | DeepSeekLLM()
        response = chain.invoke(input={"text": text})
        formats = self.parse(response)
        return index, formats

    def read(self) -> str:
        doc = Document(self.note_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return "\n".join(full_text)

    def parse(self, result: str) -> List[NoteFormat]:
        """将JSON用正则解析出来，然后转为`NoteFormat`"""
        cleaned_str = self.remove_markdown(result)
        json_data = json.loads(cleaned_str)
        formats = [NoteFormat(**item) for item in json_data]
        return formats

    # def extract_json(self, content: str) -> str:
    #     # 使用正则表达式提取JSON字符串
    #     match = re.search(r'\[.*?\]', content, re.DOTALL)
    #     if match:
    #         return match.group(0)
    #     return ""

    def remove_markdown(self, json_str: str) -> str:
        # 正则表达式匹配Markdown中的JSON代码块
        json_pattern = r'```json\n(.*?)\n```'
        # 使用re.DOTALL使得.可以匹配换行符
        json_strings = re.findall(json_pattern, json_str, re.DOTALL)
        return json_strings[0]

    def to_dataframe(self, result: List[NoteFormat]) -> DataFrame:
        data_dict = [note.model_dump() for note in result]
        return pd.DataFrame(data_dict)

    def to_dict(self, result: List[NoteFormat]) -> List[dict]:
        data_dict = [note.model_dump() for note in result]
        return data_dict

    def to_json(self, result: List[NoteFormat]) -> str:
        df = pd.DataFrame(self.to_dict(result))
        json_result = df.to_json(orient='records', force_ascii=False)  # 'records' 格式每行一个字典
        return json_result

    def segment_text_by_keyword(self, text, keyword, max_length=1000):
        # 使用关键词分割文本，并保留分割前的关键词
        segments = text.split(keyword)

        # 初始化结果列表
        result = []
        current_segment = ""

        # 遍历分割后的文本片段，按需合并为1000字一段
        for i, segment in enumerate(segments):
            # 如果不是第一个片段，前面需要加上关键词
            if i > 0:
                segment = keyword + segment

            # 检查当前片段的长度，如果加上当前片段后不超过最大长度，则添加到当前段落
            if len(current_segment) + len(segment) <= max_length:
                current_segment += segment
            else:
                # 当前段落已经超过最大长度，保存当前段落并开始新的段落
                if current_segment.strip():
                    result.append(current_segment)
                current_segment = segment

        # 添加最后的段落
        if current_segment:
            result.append(current_segment)

        return result


if __name__ == '__main__':
    from dotenv import load_dotenv

    load_dotenv()
    note = NoteOrganizer(note_path=r"D:\workspace\AutoVidEditor\data\孙铮速记.mp3-文稿-转写结果2.docx")
    # note = NoteOrganizer(note_path=r"D:\workspace\AutoVidEditor\data\孙铮速记.mp3-文稿-转写结果.docx")
    result = note.run()
    print(result)
    print(note.to_dataframe(result))
    print(note.to_json(result))
