# -*- coding: utf-8 -*-
"""
@Author  : Yc-Ma
@Desc    : DeepSeek LLM
@Time    : 2024-12-29 09:30:49
"""
import json
import inspect
import logging
import os

import requests
from typing import Any, List, Optional, Mapping

from langchain.callbacks.manager import CallbackManagerForLLMRun, Callbacks
from langchain.llms.base import LLM
from langchain.schema import LLMResult, Generation, PromptValue


class DeepSeekLLM(LLM):
    temperature: float = 0.0

    # 模型标记字段
    type: str = "deepseek"
    # 定义模型名称
    model: str = "deepseek-chat"

    max_tokens: int = 8192

    # 接口重试次数
    max_retries: int = 3
    # 接口超时时间，默认300s
    timeout: int = 300

    @property
    def _llm_type(self) -> str:
        return self.type

    def generate_prompt(
            self,
            prompts: List[PromptValue],
            stop: Optional[List[str]] = None,
            callbacks: Callbacks = None,
            **kwargs: Any,
    ) -> LLMResult:
        # prompt_strings = [p.to_string() for p in prompts]
        return self._generate(prompts, stop=stop, callbacks=callbacks, **kwargs)

    def _generate(
            self,
            prompts: List,
            stop: Optional[List[str]] = None,
            run_manager: Optional[CallbackManagerForLLMRun] = None,
            **kwargs: Any,
    ) -> LLMResult:
        """Run the LLM on the given prompt and input."""
        # TODO: add caching here.
        generations = []
        new_arg_supported = inspect.signature(self._call).parameters.get("run_manager")

        for prompt in prompts:
            text = (
                self._call(prompt, stop=stop, run_manager=run_manager, **kwargs)
                if new_arg_supported
                else self._call(prompt, stop=stop, **kwargs)
            )
            generations.append([Generation(text=text)])
        return LLMResult(generations=generations)

    def _call(
            self,
            prompt: PromptValue,
            stop: Optional[List[str]] = None,
            run_manager: Optional[CallbackManagerForLLMRun] = None,
            **kwargs
    ) -> str:
        # if stop is not None:
        #     raise ValueError("stop kwargs are not permitted.")
        return self.api(prompt)

    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        """Get the identifying parameters."""
        return {"type": self.type}

    def api(self, prompt: PromptValue):
        messages = self.pack(prompt)
        retries = 0
        result = None
        while retries < self.max_retries:
            try:
                # LLM API REQUEST
                url = "https://api.deepseek.com/chat/completions"
                payload = json.dumps({
                    "messages": messages,
                    "model": self.model,
                    "max_tokens": self.max_tokens,
                    "stream": False,
                    "temperature": self.temperature
                })
                headers = {
                    'Authorization': f'Bearer {os.environ['DEEPSEEK_API_KEY']}',
                    'Content-Type': 'application/json'
                }
                response = requests.request("POST", url, headers=headers, data=payload)
                result_json = response.json()
                result = result_json['choices'][0]['message']['content']
                break
            except Exception as e:
                retries += 1
                if retries == self.max_retries:
                    logging.error(e)
                    return "API request failed after maximum retries"
                else:
                    logging.debug("Retry API request...")
        return result

    def pack(self, prompt: PromptValue) -> List:
        messages = []
        if type(prompt) != str:
            mes = prompt.to_messages()
            for me in mes:
                if me.type == "system":
                    data = {
                        "role": "system",
                        "content": me.content
                    }
                elif me.type == "ai":
                    data = {
                        "role": "assistant",
                        "content": me.content
                    }
                else:
                    data = {
                        "role": "user",
                        "content": me.content
                    }

                messages.append(data)
        else:
            data = {
                "role": "user",
                "content": prompt
            }
            messages.append(data)
        return messages
