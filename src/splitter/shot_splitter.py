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

SYSTEM_TEMPLATE = f"""你是一名财经新闻视频助手，可以按照文字稿内容进行视频镜头语言的设计，请仔细整理文字稿，并按照指定格式输出。
文字稿内容一般会使用指定格式给出，例如`<正片>...内容...</正片>`。
正片文字中[cut]表示镜头可能需要组合，即`content`内容可能是多个。

输出格式为JSON：字典对象放在列表中，index、speaker、content。
`index`的值应该是递增的。
`speaker`表示讲话人。
`content`表示当前镜头语言，是数组，只保留说话人内容即可。
"""

HUMAN_TEMPLATE = """<正片>
{text}
</正片>

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


class ShotFormat(BaseModel):
    index: int = Field(description="序号")
    # start_time: str = Field(description="开始时间")
    # end_time: str = Field(description="结束时间")
    speaker: str = Field(description="说话人")
    content: List[str] = Field(description="内容")


class ShotSplitter:
    """整理文字稿（分说话人、按照镜头切片）"""

    def __init__(self, note_path: str):
        # docx结尾的文件
        self.note_path = note_path

    def run(self) -> List[ShotFormat]:
        data = []
        text = self.read()
        segmented_text = self.segment_text_by_keyword(text, "主持人-", 3000)

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

    def pack_format(self, index, text) -> Tuple[int, List[ShotFormat]]:
        logger.info("ShotSplitter...")
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

    def parse(self, result: str) -> List[ShotFormat]:
        """将JSON用正则解析出来，然后转为`NoteFormat`"""
        cleaned_str = self.remove_markdown(result)
        json_data = json.loads(cleaned_str)
        formats = [ShotFormat(**item) for item in json_data]
        return formats

    def remove_markdown(self, json_str: str) -> str:
        # 正则表达式匹配Markdown中的JSON代码块
        json_pattern = r'```json\n(.*?)\n```'
        # 使用re.DOTALL使得.可以匹配换行符
        json_strings = re.findall(json_pattern, json_str, re.DOTALL)
        return json_strings[0]

    def to_dataframe(self, result: List[ShotFormat]) -> DataFrame:
        data_dict = [note.model_dump() for note in result]
        return pd.DataFrame(data_dict)

    def to_json(self, result: List[ShotFormat]) -> str:
        data_dict = [note.model_dump() for note in result]
        df = pd.DataFrame(data_dict)
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
    # spliter = ShotSplitter(note_path=r"D:\workspace\AutoVidEditor\data\【制作文案】刘健钧-科创投资八问.docx")
    spliter = ShotSplitter(note_path=r"D:\workspace\AutoVidEditor\data\【制作文案】刘健钧-科创投资八问2.docx")
    result = spliter.run()
    print(result)
    print(spliter.to_dataframe(result))
    print(spliter.to_json(result))
