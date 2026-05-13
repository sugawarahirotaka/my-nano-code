# セキュアで最低限のBun開発環境
# 非rootユーザ、権限制限、プロジェクトディレクトリのみ
FROM oven/bun:1.3

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    sudo \
    zsh \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 非rootユーザ作成
RUN useradd -ms /bin/zsh vscode
RUN usermod -aG sudo vscode \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

USER vscode
WORKDIR /nano-code

# 基本環境変数
ENV DEVCONTAINER=true
ENV PATH="/home/vscode/.bin/bin:$PATH"

# Bunのキャッシュをユーザごとに分離
ENV BUN_INSTALL_CACHE_DIR=/home/vscode/.bun-cache
RUN mkdir -p $BUN_INSTALL_CACHE_DIR

CMD ["zsh"]
