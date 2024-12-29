from dotenv import load_dotenv
from langchain.chains.llm import LLMChain
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, PromptTemplate, \
    HumanMessagePromptTemplate

from src.llm.deepseek import DeepSeekLLM

load_dotenv()

llm = DeepSeekLLM()
print(llm)

SYSTEM_TEMPLATE = f"""你是机器人！
"""

HUMAN_TEMPLATE = """**用户问题**
{now}

{question}

Let’s think step by step!"""

PROMPT = ChatPromptTemplate.from_messages(
    [
        SystemMessagePromptTemplate(
            prompt=PromptTemplate(input_variables=[], template=SYSTEM_TEMPLATE)),
        HumanMessagePromptTemplate(
            prompt=PromptTemplate(input_variables=["question"],
                                  template=HUMAN_TEMPLATE).partial(now="NOW")
        )
    ]
)

chain: LLMChain = PROMPT | llm
response = chain.invoke(input={"question": "你好"})
print(response)
