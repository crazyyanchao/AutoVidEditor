from typing import List

import pandas as pd
from pandas import DataFrame
from pydantic import BaseModel, Field

from src.organizer.note_organizer import NoteFormat, NoteOrganizer
from src.splitter.shot_splitter import ShotFormat, ShotSplitter


class ClipFormat(BaseModel):
    shot: ShotFormat = Field(description="镜头")
    notes: List[NoteFormat] = Field(description="一个镜头至少对应一个速记内容")


class Clipper:
    """基于脚本中的镜头分割点和时间戳，使用LLM语义相似度分析和字符串相似度计算等算法自动匹配并剪辑视频素材"""

    def __init__(self, note_path: str, shot_path: str):
        self.note_path = note_path
        self.shot_path = shot_path

    def run(self) -> List[ClipFormat]:
        # 处理速记
        note = NoteOrganizer(note_path=self.note_path)
        # 处理成片脚本
        shot = ShotSplitter(note_path=self.shot_path)
        # 关联镜头与速记内容
        result = self.clip(note, shot)
        return result

    def clip(self, note: NoteOrganizer, shot: ShotSplitter) -> List[ClipFormat]:
        """每个镜头关联一个速记内容"""

    def to_dataframe(self, result: List[ClipFormat]) -> DataFrame:
        data_dict = [note.model_dump() for note in result]
        return pd.DataFrame(data_dict)

    def to_dict(self, result: List[ClipFormat]) -> List[dict]:
        data_dict = [note.model_dump() for note in result]
        return data_dict

    def to_json(self, result: List[ClipFormat]) -> str:
        df = pd.DataFrame(self.to_dict(result))
        json_result = df.to_json(orient='records', force_ascii=False)  # 'records' 格式每行一个字典
        return json_result


if __name__ == '__main__':
    from dotenv import load_dotenv

    load_dotenv()
    clipper = Clipper(note_path=r"D:\workspace\AutoVidEditor\data\孙铮速记.mp3-文稿-转写结果2.docx",
                      shot_path=r"D:\workspace\AutoVidEditor\data\【制作文案】刘健钧-科创投资八问2.docx")
    result = clipper.run()
    print(result)
    print(clipper.to_dataframe(result))
    print(clipper.to_json(result))
