#!/bin/bash

  docker run --gpus all --shm-size 1g -p 11434:80 \
  -v /var/lib/ollama/tgi:/data ghcr.io/huggingface/text-generation-inference:latest \
  --model-id deepseek-ai/DeepSeek-R1-Distill-Qwen-32B \
  --num-shard 4