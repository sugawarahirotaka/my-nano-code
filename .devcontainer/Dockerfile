# セキュアで最低限のBun開発環境
FROM oven/bun:1.3

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    jq \
    curl \
    ca-certificates \
    nano \
    bubblewrap \
    sudo \
    zsh \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# GitHub CLIをイメージに含め、コンテナ作成ごとの手動インストールを避ける
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends gh \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 非rootユーザ作成
RUN useradd -ms /bin/zsh vscode \
    && usermod -aG sudo vscode \
    && mkdir -p /etc/sudoers.d \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

USER vscode
WORKDIR /nano-code

# 基本環境変数
ENV DEVCONTAINER=true
ENV PATH="/home/vscode/.bun/bin:$PATH"

# Bunのキャッシュをユーザごとに分離
ENV BUN_INSTALL_CACHE_DIR=/home/vscode/.bun-cache
RUN mkdir -p "$BUN_INSTALL_CACHE_DIR"

CMD ["zsh"]
